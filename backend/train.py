"""
Generate synthetic training data and train the HealthModel.

Run this script once before starting the API:
    cd backend
    python train.py
"""
import numpy as np
import sys, os

# Allow running directly from backend/ directory
sys.path.insert(0, os.path.dirname(__file__))

from model import HealthModel


RNG = np.random.default_rng(42)
N = 20_000  # synthetic samples


def _bucket(score: float) -> int:
    """Convert a 0–100 score to a 0–4 bucket label."""
    if score < 40:
        return 0       # Poor
    elif score < 55:
        return 1       # Fair-Low
    elif score < 70:
        return 2       # Fair-High
    elif score < 85:
        return 3       # Good
    else:
        return 4       # Excellent


def _synthetic_score(age, steps, sleep, hr, sys_bp, dia_bp, spo2, stress, bmi) -> float:
    """
    Rule-based ground-truth score used to generate training labels.
    Combines multiple health factors into 0–100.
    """
    s = 100.0

    # Age penalty (mild)
    s -= max(0, (age - 30) * 0.25)

    # Steps: reward up to 10k
    s += min(steps / 10_000 * 15, 15) - 7.5

    # Sleep: optimal 7–9 hrs
    sleep_pen = abs(sleep - 8.0) * 3.5
    s -= sleep_pen

    # Heart rate: optimal 55–75
    hr_pen = max(0, abs(hr - 65) - 10) * 0.5
    s -= hr_pen

    # Blood pressure
    sys_pen = max(0, sys_bp - 120) * 0.3
    dia_pen = max(0, dia_bp - 80) * 0.4
    s -= sys_pen + dia_pen

    # SpO2: penalise if < 95
    s -= max(0, (95 - spo2) * 2.5)

    # Stress: 0 = none, 100 = extreme
    s -= stress * 0.12

    # BMI: optimal 18.5–24.9
    if bmi < 18.5:
        s -= (18.5 - bmi) * 1.5
    elif bmi > 24.9:
        s -= (bmi - 24.9) * 1.2

    return float(np.clip(s, 0, 100))


def generate_data():
    age        = RNG.integers(18, 80, N).astype(float)
    steps      = RNG.integers(500, 20_000, N).astype(float)
    sleep      = RNG.uniform(4.0, 10.0, N)
    hr         = RNG.integers(45, 110, N).astype(float)
    sys_bp     = RNG.integers(90, 180, N).astype(float)
    dia_bp     = RNG.integers(55, 120, N).astype(float)
    spo2       = RNG.uniform(88.0, 100.0, N)
    stress     = RNG.integers(0, 100, N).astype(float)
    weight     = RNG.uniform(45, 130, N)
    height     = RNG.uniform(150, 195, N)
    bmi        = weight / (height / 100) ** 2

    X = np.column_stack([age, steps, sleep, hr, sys_bp, dia_bp, spo2, stress, bmi])

    scores = np.array([
        _synthetic_score(age[i], steps[i], sleep[i], hr[i], sys_bp[i],
                         dia_bp[i], spo2[i], stress[i], bmi[i])
        for i in range(N)
    ])
    y = np.array([_bucket(s) for s in scores])
    return X, y


if __name__ == "__main__":
    print("[train] Generating synthetic dataset …")
    X, y = generate_data()
    print(f"[train] Dataset shape: {X.shape}  Label distribution: {np.bincount(y)}")

    model = HealthModel()
    model.fit(X, y)
    model.save()
    print("[train] Done - model.pkl saved to backend/")
