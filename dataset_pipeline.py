import json
import os
import torch
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
from torch.utils.data import Dataset, DataLoader

class FHIRPreprocessor:
    """
    Two-Stage Data Preprocessing & Temporal Alignment Pipeline.
    
    Converts FHIR JSON bundles into standardized tensors with explicit 
    time-delta (Δt) calculation and treatment alignment.
    """
    
    def __init__(self, sequence_length: int = 60):
        self.sequence_length = sequence_length
        self.biomarker_loincs = {
            "8480-6": "systolic_bp",
            "8462-4": "diastolic_bp",
            "2093-3": "total_cholesterol",
            "2571-8": "triglycerides",
            "18262-6": "ldl_cholesterol",
            "2085-9": "hdl_cholesterol",
            "62238-1": "egfr",
            "29463-7": "weight",
            "39156-5": "bmi",
            "4548-4": "hba1c",
            "2339-0": "glucose",
            "38483-4": "creatinine"
        }
        self.metric_order = sorted(self.biomarker_loincs.values())
        self.metric_to_idx = {m: i for i, m in enumerate(self.metric_order)}

    def process_offline(self, json_dir: str, output_dir: str):
        """
        Offline Stage: Processes raw JSONs into standardized .pt tensors.
        
        Args:
            json_dir: Directory containing FHIR JSON bundles.
            output_dir: Directory to save pre-processed .pt files.
        """
        os.makedirs(output_dir, exist_ok=True)
        
        for filename in os.listdir(json_dir):
            if filename.endswith(".json"):
                file_path = os.path.join(json_dir, filename)
                try:
                    patient_id, static_tensor, temporal_tensor = self.parse_and_align(file_path)
                    save_path = os.path.join(output_dir, f"{patient_id}.pt")
                    torch.save({
                        "static": static_tensor,
                        "temporal": temporal_tensor
                    }, save_path)
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

    def parse_and_align(self, bundle_path: str) -> Tuple[str, torch.Tensor, torch.Tensor]:
        """
        Parses a single FHIR bundle and aligns observations with Δt.
        
        Returns:
            patient_id: Unique identifier.
            static_tensor: [static_dim]
            temporal_tensor: [seq_len, feature_dim] 
                             where feature_dim includes biomarkers + Δt + treatment_flag
        """
        with open(bundle_path, 'r') as f:
            bundle = json.load(f)
            
        patient_id = "unknown"
        static_data = {"age": 0, "gender": 0}
        observations = []
        medications = []
        
        for entry in bundle.get('entry', []):
            resource = entry.get('resource', {})
            r_type = resource.get('resourceType')
            
            if r_type == 'Patient':
                patient_id = resource.get('id')
                birth_date = resource.get('birthDate')
                if birth_date:
                    static_data["age"] = (datetime.now() - datetime.strptime(birth_date, '%Y-%m-%d')).days / 365.25
                static_data["gender"] = 1 if resource.get('gender') == 'male' else 0
                
            elif r_type == 'Observation':
                obs_date = resource.get('effectiveDateTime')
                if not obs_date: continue
                
                if 'component' in resource:
                    for comp in resource['component']:
                        code = comp.get('code', {}).get('coding', [{}])[0].get('code')
                        if code in self.biomarker_loincs:
                            observations.append({
                                "date": pd.to_datetime(obs_date, utc=True),
                                "metric": self.biomarker_loincs[code],
                                "value": comp.get('valueQuantity', {}).get('value')
                            })
                else:
                    code = resource.get('code', {}).get('coding', [{}])[0].get('code')
                    if code in self.biomarker_loincs:
                        observations.append({
                            "date": pd.to_datetime(obs_date, utc=True),
                            "metric": self.biomarker_loincs[code],
                            "value": resource.get('valueQuantity', {}).get('value')
                        })
                        
            elif r_type == 'MedicationRequest':
                medications.append({
                    "date": pd.to_datetime(resource.get('authoredOn'), utc=True),
                    "code": resource.get('medicationCodeableConcept', {}).get('coding', [{}])[0].get('code'),
                    "active": 1.0
                })
        
        # --- Time-Alignment Logic ---
        obs_df = pd.DataFrame(observations)
        med_df = pd.DataFrame(medications)
        
        if obs_df.empty:
            raise ValueError(f"No valid observations found for patient {patient_id}")
            
        # Combine all events to compute global timeline
        events = obs_df.groupby('date').first().reset_index()[['date']]
        if not med_df.empty:
            events = pd.concat([events, med_df[['date']]]).drop_duplicates().sort_values('date')
        else:
            events = events.sort_values('date')
            
        # Calculate Δt (in days)
        events['delta_t'] = events['date'].diff().dt.total_seconds() / (24 * 3600)
        events['delta_t'] = events['delta_t'].fillna(0.0)
        
        # Pivot observations
        obs_pivot = obs_df.pivot_table(index='date', columns='metric', values='value').reindex(events['date'])
        obs_pivot = obs_pivot[self.metric_order].ffill().fillna(0.0)
        
        # Align treatments (flag if a medication request occurred at or before this timestamp)
        # For simplicity, we mark the timestamp where the med was requested.
        treatment_flags = np.zeros(len(events))
        if not med_df.empty:
            for med_date in med_df['date']:
                idx = events.index[events['date'] == med_date][0]
                treatment_flags[idx] = 1.0
                
        # Final Tensor Assembly: [seq_len, biomarkers + delta_t + treatment]
        # shape: (N, num_biomarkers + 2)
        combined_features = np.hstack([
            obs_pivot.values, 
            events['delta_t'].values.reshape(-1, 1),
            treatment_flags.reshape(-1, 1)
        ])
        
        # Truncate/Pad
        if len(combined_features) > self.sequence_length:
            combined_features = combined_features[-self.sequence_length:]
        else:
            padding = np.zeros((self.sequence_length - len(combined_features), combined_features.shape[1]))
            combined_features = np.vstack([padding, combined_features])
            
        static_tensor = torch.tensor([static_data['age'], static_data['gender']]).float()
        temporal_tensor = torch.tensor(combined_features).float()
        
        return patient_id, static_tensor, temporal_tensor

class ClinicalDataset(Dataset):
    """
    Online Stage: Efficiently loads pre-processed tensors for training.
    """
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.files = [f for f in os.listdir(data_dir) if f.endswith(".pt")]
        
    def __len__(self):
        return len(self.files)
        
    def __getitem__(self, idx) -> Tuple[torch.Tensor, torch.Tensor]:
        data = torch.load(os.path.join(self.data_dir, self.files[idx]))
        return data["static"], data["temporal"]

if __name__ == "__main__":
    # Demo initialization
    preprocessor = FHIRPreprocessor(sequence_length=60)
    print(f"Preprocessor loaded with metric order: {preprocessor.metric_order}")
    # Example: preprocessor.process_offline("raw_fhir_jsons", "processed_tensors")
