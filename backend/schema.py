"""Pydantic schemas for request/response models."""
from pydantic import BaseModel, Field
from typing import List, Optional


class HealthInput(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years")
    steps_per_day: int = Field(..., ge=0, le=50000, description="Daily step count")
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Hours of sleep per night")
    heart_rate: int = Field(..., ge=30, le=220, description="Resting heart rate in BPM")
    systolic_bp: int = Field(..., ge=70, le=200, description="Systolic blood pressure mmHg")
    diastolic_bp: int = Field(..., ge=40, le=130, description="Diastolic blood pressure mmHg")
    blood_oxygen: float = Field(..., ge=80.0, le=100.0, description="SpO2 percentage")
    stress_level: int = Field(..., ge=0, le=100, description="Stress level 0–100")
    weight_kg: float = Field(..., ge=20.0, le=300.0, description="Weight in kilograms")
    height_cm: float = Field(..., ge=100.0, le=250.0, description="Height in centimetres")


class SimulationScenario(BaseModel):
    name: str
    description: str
    icon: str
    current_score: float
    projected_score: float
    delta: float
    insight: str


class LongTermRisk(BaseModel):
    risk_5yr: float = Field(..., description="5-year cardiovascular risk %")
    risk_10yr: float = Field(..., description="10-year cardiovascular risk %")
    risk_category: str = Field(..., description="Low / Moderate / High / Very High")
    key_factors: List[str]


class AnalysisResponse(BaseModel):
    health_score: float
    health_status: str
    recommendations: List[str]
    simulation: List[SimulationScenario]
    long_term: LongTermRisk
