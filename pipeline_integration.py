import torch
import numpy as np
import json
from preprocessing import FHIRPreprocessor
from baseline_model import BiomarkerTrajectoryModel
from simulation_engine import CausalTreatmentEngine
from safety_net import SafetyNet

def run_digital_twin_pipeline(fhir_bundle_path: str, proposed_drug: str, dosage_mg: float):
    """
    Orchestrates the entire Digital Twin pipeline.
    """
    print(f"--- Starting Digital Twin Pipeline for {fhir_bundle_path} ---")
    
    # 1. Initialize Components
    preprocessor = FHIRPreprocessor()
    model = BiomarkerTrajectoryModel(static_dim=2, temporal_dim=12, output_horizon=12) # 1 year prediction
    causal_engine = CausalTreatmentEngine(n_biomarkers=12)
    safety_net = SafetyNet()
    
    # 2. Preprocess Data
    print("Step 1: Parsing FHIR & Generating PatientVector...")
    parsed_data = preprocessor.parse_bundle(fhir_bundle_path)
    static_x, temporal_x = preprocessor.align_to_tensor(parsed_data)
    
    # 3. Predict Baseline Trajectory
    print("Step 2: Predicting 12-month Baseline Trajectory...")
    with torch.no_grad():
        baseline_trajectory = model(static_x, temporal_x)
    
    # 4. Check Safety Net
    print(f"Step 3: Checking Safety for {proposed_drug}...")
    active_meds = [m['code'] for m in parsed_data['medications']]
    # Extract latest eGFR from observations
    latest_egfr = 90.0 # Default fallback
    for obs in parsed_data['temporal_obs']:
        if obs['metric'] == 'egfr':
            latest_egfr = obs['value']
            
    safety_check = safety_net.check_safety(proposed_drug, dosage_mg, active_meds, latest_egfr)
    
    if not safety_check['safe']:
        print("--- PIPELINE HALTED: Safety Violation Detected ---")
        return {
            "status": "SAFETY_VIOLATION",
            "alerts": safety_check['alerts'],
            "baseline_trajectory": baseline_trajectory.tolist()
        }
    
    # 5. Simulate Treatment Impact
    print("Step 4: Simulating Causal Treatment Impact...")
    # Flatten patient state for causal engine
    patient_state_flat = temporal_x[:, -1, :].numpy() # Take the most recent snapshot for simplicity
    simulation = causal_engine.simulate_treatment(patient_state_flat, proposed_drug, dosage_mg)
    
    # 6. Aggregated Final Report
    print("--- Pipeline Completed Successfully ---")
    return {
        "status": "SUCCESS",
        "safety": safety_check,
        "baseline_trajectory_summary": baseline_trajectory[0, 11, :].tolist(), # Final month prediction
        "simulated_impact": simulation
    }

if __name__ == "__main__":
    # Example simulation for Metformin on a patient with low eGFR
    # Mock file path (using first patient in dataset)
    bundle_path = "/Users/ankur/Desktop/digital-twin-1/training/dataset/00/000/0000e4c0-2057-4c43-a90e-33891c7bc097.json"
    
    # Target: Metformin
    # result = run_digital_twin_pipeline(bundle_path, "Metformin", 500.0)
    # print(json.dumps(result, indent=2))
    print("Digital Twin Pipeline Integration Loaded.")
