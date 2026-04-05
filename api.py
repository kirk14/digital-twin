import torch
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Import the new advanced modules
from pharmacovigilance import PharmacovigilanceEngine
from trajectory_transformer import TimeAwareTransformer, get_device
from causal_simulator import Dragonnet, CausalSimulator

app = FastAPI(title="Digital Twin Clinical Predictor", description="Enterprise-grade AI testing environment.")

# --- 1. Define Request/Response Models ---
class SimulationRequest(BaseModel):
    patient_id: str
    proposed_drug: str  # Drug name
    dosage_mg: float
    active_meds: List[str]
    latest_labs: Dict[str, Optional[float]]
    
class SimulationResponse(BaseModel):
    status: str
    safety_check: Dict[str, Any]
    causal_simulation: Dict[str, Any]

# --- 2. Initialize Models in Memory ---
device = get_device()
print(f"Loading Models onto device: {device}")

# We mock the initialization dimensions here for the testing environment.
# Assuming 12 biomarkers + delta_t + treatment_flag = 14 temporal features.
temporal_dim = 14
static_dim = 2

try:
    safety_net = PharmacovigilanceEngine()
    
    # Initialize the Trajectory Transformer
    trajectory_model = TimeAwareTransformer(static_dim=static_dim, temporal_dim=temporal_dim, output_horizon=5).to(device)
    trajectory_model.eval()
    
    # Initialize the Causal Simulator
    dragonnet = Dragonnet(input_dim=temporal_dim).to(device) # Simplification: passing temporal_dim as flat input
    causal_engine = CausalSimulator(dragonnet)
    print("All models loaded successfully.")
except Exception as e:
    print(f"Warning: Model initialization failed. {e}")

# --- 3. API Endpoints ---
@app.get("/")
def health_check():
    return {"status": "Running", "device": str(device)}

@app.post("/simulate", response_model=SimulationResponse)
def simulate_treatment(request: SimulationRequest):
    """
    Test endpoint for running the Digital Twin counterfactual simulation.
    """
    # 1. Run determinisitic safety check first
    safety_result = safety_net.validate_treatment(
        proposed_drug=request.proposed_drug, 
        active_meds=request.active_meds, 
        patient_state=request.latest_labs
    )
    
    if not safety_result["is_safe"]:
        return {
            "status": "SAFETY_VIOLATION_BLOCKED",
            "safety_check": safety_result,
            "causal_simulation": {}
        }
        
    # 2. Run Causal Simulation (Mocking a flattened feature vector for the test)
    # In reality, this vector would be pulled via data pipeline with the patient_id
    mock_patient_state = torch.randn(1, temporal_dim).to(device)
    
    # Run the causal engine's what-if scenario
    simulation_output = causal_engine.simulate_treatment(mock_patient_state, dosage=request.dosage_mg)
    
    return {
        "status": "SUCCESS",
        "safety_check": safety_result,
        "causal_simulation": simulation_output
    }
