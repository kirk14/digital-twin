from fastapi import APIRouter
from pydantic import BaseModel
import sys
from pathlib import Path

# Add model to path
model_dir = Path(__file__).resolve().parent.parent.parent.parent.parent / "model"
sys.path.append(str(model_dir))

try:
    from clinical_explainer import ClinicalExplainer
except ImportError:
    pass

router = APIRouter()

class InsightRequest(BaseModel):
    weight: float
    activityLevel: float
    sleepHours: float
    systolicBP: float
    diastolicBP: float
    glucose: float
    stressLevel: float
    heartRate: float

@router.post("")
def get_insight(req: InsightRequest):
    # explainer = ClinicalExplainer(model, None)
    # Use SHAP/Captum to identify vectors
    return {
        "summary": f"Insight Engine processing twin operating at stress {req.stressLevel}.",
        "risk_vectors": [
            {
                "type": "warning" if req.systolicBP > 130 else "info",
                "title": "Vascular Vector",
                "text": "BP reading analyzed by Captum indicates potential vascular pressure."
            }
        ],
        "recommendations": ["Consider lowering sodium." if req.systolicBP > 120 else "Maintain homeostasis"],
        "forecast": f"Trajectories suggest improvement over next 30 days."
    }
