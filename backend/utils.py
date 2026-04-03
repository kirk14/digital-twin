"""Utility helpers for the Digital Twin backend."""
import numpy as np
import os
import pickle
from typing import Any


MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")


def compute_bmi(weight_kg: float, height_cm: float) -> float:
    """Return Body Mass Index rounded to 1 decimal."""
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m ** 2), 1)


def normalize_inputs(inputs: dict) -> np.ndarray:
    """
    Convert raw health inputs dict into a feature vector for the ML model.
    Feature order must match the training pipeline in train.py.
    """
    bmi = compute_bmi(inputs["weight_kg"], inputs["height_cm"])
    features = np.array([[
        inputs["age"],
        inputs["steps_per_day"],
        inputs["sleep_hours"],
        inputs["heart_rate"],
        inputs["systolic_bp"],
        inputs["diastolic_bp"],
        inputs["blood_oxygen"],
        inputs["stress_level"],
        bmi,
    ]], dtype=np.float32)
    return features


def load_model() -> Any:
    """Load the trained RandomForest model from disk."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. "
            "Run `python backend/train.py` first."
        )
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)


def score_to_status(score: float) -> str:
    """Map a numeric health score to a human-readable status string."""
    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Fair"
    else:
        return "Poor"
