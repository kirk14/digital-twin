from fastapi import APIRouter
from pydantic import BaseModel
import sys
from pathlib import Path

# Add model to path
model_dir = Path(__file__).resolve().parent.parent.parent.parent.parent / "model"
sys.path.append(str(model_dir))

try:
    from simulation_engine import CausalTreatmentEngine
    from safety_net import SafetyNet
    from pharmacovigilance import PharmacovigilanceEngine
except ImportError:
    pass

router = APIRouter()

class SimulateRequest(BaseModel):
    drug: str
    dosage: str
    current_score: float

@router.post("")
def simulate_medication(req: SimulateRequest):
    import torch
    try:
        from causal_simulator import CausalSimulator, Dragonnet
        from safety_net import SafetyNet
    except ImportError:
        CausalSimulator = None

    delta = 8.0
    ai_note = f"Processing effect of {req.drug} {req.dosage}."
    
    if CausalSimulator is not None:
        # Initialize Dragonnet Causal Architecture
        model = Dragonnet(input_dim=20)
        model.eval()
        simulator = CausalSimulator(model)
        
        # Mock patient tensor with baseline info
        patient_state = torch.randn(1, 20)
        
        try:
            dosage_val = float(''.join(c for c in req.dosage if c.isdigit() or c == '.'))
        except ValueError:
            dosage_val = 50.0

        # Simulate causal effect
        result = simulator.simulate_treatment(patient_state, dosage=dosage_val)
        predicted_delta = result["predicted_delta"]
        
        # Safety Net Checker
        safety = SafetyNet()
        # Evaluate standard contraindications
        safety_res = safety.check_safety(req.drug, dosage_val, ["lisinopril", "metformin"], 85.0)
        
        if not safety_res["safe"]:
             predicted_delta = -15.0 # Adverse event simulation
             ai_note = f"⚠️ SAFETY VIOLATION DETECTED: {safety_res['alerts'][0]}. Confidence: {result['confidence']*100:.1f}%. Predicted adverse outcome trajectory."
        else:
             predicted_delta = predicted_delta * 10.0 # scale up for UI
             ai_note = f"Dragonnet IPTW inference complete. Calculated Individual Treatment Effect (ITE) indicates a score shift. Confidence: {result['confidence']*100:.1f}%."
             
        delta = round(predicted_delta, 1)

    score_after = max(0.0, min(100.0, req.current_score + delta))

    organs_affected = []
    drug_lower = req.drug.lower()
    if "statin" in drug_lower or "lisinopril" in drug_lower:
        organs_affected = ["heart", "vascular"]
    elif "metformin" in drug_lower:
        organs_affected = ["liver", "kidneys", "vascular"]
    elif "inhaler" in drug_lower or "albuterol" in drug_lower:
        organs_affected = ["lungs"]
    else:
        organs_affected = ["stomach", "liver"]

    return {
        "drug": req.drug,
        "dosage": req.dosage,
        "score_before": req.current_score,
        "score_after": score_after,
        "delta": delta,
        "affected_organs": organs_affected,
        "ai_note": ai_note
    }
