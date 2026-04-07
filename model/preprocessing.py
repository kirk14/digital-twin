import json
import pandas as pd
import numpy as np
import torch
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sklearn.preprocessing import LabelEncoder, StandardScaler

class FHIRPreprocessor:
    """
    Data Preprocessing & Alignment Pipeline for Digital Twin.
    Transforms raw FHIR JSON bundles into a unified, temporal PatientVector.
    """
    
    def __init__(self, sequence_length: int = 60, bucket_size_days: int = 30):
        self.sequence_length = sequence_length
        self.bucket_size_days = bucket_size_days
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
        self.static_scaler = StandardScaler()
        self.temporal_scaler = StandardScaler()

    def parse_bundle(self, bundle_path: str) -> Dict[str, Any]:
        """
        Extracts relevant resources from a FHIR JSON bundle.
        """
        with open(bundle_path, 'r') as f:
            bundle = json.load(f)
            
        patient_data = {}
        observations = []
        medications = []
        
        for entry in bundle.get('entry', []):
            resource = entry.get('resource', {})
            r_type = resource.get('resourceType')
            
            if r_type == 'Patient':
                patient_data = {
                    "id": resource.get('id'),
                    "birthDate": resource.get('birthDate'),
                    "gender": resource.get('gender'),
                    "race": self._get_extension_value(resource, 'us-core-race'),
                    "ethnicity": self._get_extension_value(resource, 'us-core-ethnicity')
                }
            elif r_type == 'Observation':
                obs_date = resource.get('effectiveDateTime')
                code = resource.get('code', {}).get('coding', [{}])[0].get('code')
                
                # Handle multi-component observations (e.g. Blood Pressure)
                if 'component' in resource:
                    for comp in resource['component']:
                        comp_code = comp.get('code', {}).get('coding', [{}])[0].get('code')
                        if comp_code in self.biomarker_loincs:
                            observations.append({
                                "date": obs_date,
                                "metric": self.biomarker_loincs[comp_code],
                                "value": comp.get('valueQuantity', {}).get('value')
                            })
                elif code in self.biomarker_loincs:
                    observations.append({
                        "date": obs_date,
                        "metric": self.biomarker_loincs[code],
                        "value": resource.get('valueQuantity', {}).get('value')
                    })
            elif r_type == 'MedicationRequest':
                medications.append({
                    "start": resource.get('authoredOn'),
                    "code": resource.get('medicationCodeableConcept', {}).get('coding', [{}])[0].get('code'),
                    "name": resource.get('medicationCodeableConcept', {}).get('text')
                })
                
        return {
            "static": patient_data,
            "temporal_obs": observations,
            "medications": medications
        }

    def _get_extension_value(self, resource: Dict, url_keyword: str) -> str:
        for ext in resource.get('extension', []):
            if url_keyword in ext.get('url', ''):
                return ext.get('valueCodeableConcept', {}).get('text', 'unknown')
        return 'unknown'

    def align_to_tensor(self, parsed_data: Dict[str, Any]) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Aligns observations and medications into a fixed-length temporal tensor.
        
        Returns:
            static_tensor: [1, static_dim]
            temporal_tensor: [1, sequence_length, feature_dim]
        """
        # 1. Process Static Data
        static = parsed_data['static']
        age = (datetime.now() - datetime.strptime(static['birthDate'], '%Y-%m-%d')).days / 365.25
        gender_idx = 1 if static['gender'] == 'male' else 0
        static_vec = np.array([age, gender_idx]) # Simplified for demo
        
        # 2. Process Temporal Data
        obs_df = pd.DataFrame(parsed_data['temporal_obs'])
        if obs_df.empty:
            return torch.zeros(1, 2), torch.zeros(1, self.sequence_length, len(self.biomarker_loincs))
            
        obs_df['date'] = pd.to_datetime(obs_df['date'], utc=True)
        obs_df = obs_df.pivot_table(index='date', columns='metric', values='value')
        
        # Resample to buckets
        resampled = obs_df.resample(f'{self.bucket_size_days}D').mean()
        
        # Forward fill and pad/truncate to sequence_length
        resampled = resampled.ffill().fillna(0)
        
        # Ensure all biomarker columns exist
        for col in self.biomarker_loincs.values():
            if col not in resampled.columns:
                resampled[col] = 0.0
        
        # Sort columns to ensure consistent order
        resampled = resampled[sorted(self.biomarker_loincs.values())]
        
        # Slice to sequence_length (taking most recent)
        final_seq = resampled.tail(self.sequence_length).values
        if len(final_seq) < self.sequence_length:
            padding = np.zeros((self.sequence_length - len(final_seq), final_seq.shape[1]))
            final_seq = np.vstack([padding, final_seq])
            
        return torch.tensor(static_vec).float().unsqueeze(0), torch.tensor(final_seq).float().unsqueeze(0)

if __name__ == "__main__":
    # Example usage (would be triggered by the pipeline integration)
    preprocessor = FHIRPreprocessor()
    # Mock file path
    # data = preprocessor.parse_bundle("path/to/fhir.json")
    # static, temporal = preprocessor.align_to_tensor(data)
    print("FHIR Preprocessor initialized.")
