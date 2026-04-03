"""
FastAPI entry point for the Digital Twin Healthcare backend.

Start with:
    cd backend
    uvicorn main:app --reload --port 8000
"""
import os
import sys

# Ensure local imports resolve when run from the backend/ directory
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schema import HealthInput, AnalysisResponse
from model import HealthModel
from simulation import run_simulation
from prediction import predict_long_term
from recommendation import generate_recommendations
from utils import score_to_status, MODEL_PATH

# ── App setup ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="DigiTwin Healthcare API",
    description="ML-powered health analysis with what-if simulation and long-term risk prediction.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model at startup ──────────────────────────────────────────────────
_model = HealthModel()

@app.on_event("startup")
def load_model_on_startup():
    if os.path.exists(MODEL_PATH):
        _model.load()
    else:
        raise RuntimeError(
            "model.pkl not found. Run `python train.py` inside the backend/ directory first."
        )


# ── Routes ─────────────────────────────────────────────────────────────────
@app.get("/health", tags=["system"])
def health_check():
    """Liveness probe."""
    return {"status": "ok", "model_loaded": _model.clf is not None}


@app.post("/analyze", response_model=AnalysisResponse, tags=["analysis"])
def analyze(body: HealthInput):
    """
    Analyse smartwatch / wearable data and return:
    - Health score (0–100)
    - Health status
    - Personalised recommendations
    - What-if simulation results (3 scenarios)
    - Long-term 5-year / 10-year risk prediction
    """
    try:
        inputs = body.model_dump()

        # Core score
        health_score  = _model.predict_score(inputs)
        health_status = score_to_status(health_score)

        # Modules
        recommendations = generate_recommendations(inputs, health_score)
        simulation      = run_simulation(inputs, _model)
        long_term       = predict_long_term(inputs, health_score)

        return AnalysisResponse(
            health_score=health_score,
            health_status=health_status,
            recommendations=recommendations,
            simulation=simulation,
            long_term=long_term,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
