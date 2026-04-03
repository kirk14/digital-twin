"""
Long-term cardiovascular risk prediction.

Uses a validated rule-based scoring approach inspired by the
Framingham Heart Study risk factors. Returns 5-year and 10-year
risk percentages and a risk category.
"""
from schema import LongTermRisk
from utils import compute_bmi


_CATEGORY_THRESHOLDS = [
    (10.0, "Low"),
    (20.0, "Moderate"),
    (30.0, "High"),
    (100.0, "Very High"),
]


def _categorise(risk_pct: float) -> str:
    for threshold, label in _CATEGORY_THRESHOLDS:
        if risk_pct < threshold:
            return label
    return "Very High"


def predict_long_term(inputs: dict, health_score: float) -> LongTermRisk:
    """
    Returns estimated 5-year and 10-year cardiovascular risk percentages.

    Base risk derived from age + score, then adjusted by individual factors.
    """
    age         = inputs["age"]
    sys_bp      = inputs["systolic_bp"]
    spo2        = inputs["blood_oxygen"]
    steps       = inputs["steps_per_day"]
    sleep       = inputs["sleep_hours"]
    stress      = inputs["stress_level"]
    bmi         = compute_bmi(inputs["weight_kg"], inputs["height_cm"])

    # ── Base risk from age (Framingham-inspired baseline) ──────────────
    base_5yr  = max(1.0, (age - 20) * 0.18)
    base_10yr = max(2.0, (age - 20) * 0.38)

    # ── Modifiers (additive percentages) ──────────────────────────────
    mods_5yr  = 0.0
    mods_10yr = 0.0
    key_factors: list[str] = []

    # Blood pressure
    if sys_bp >= 140:
        mods_5yr  += 4.0
        mods_10yr += 8.0
        key_factors.append("Elevated blood pressure (Stage 2 hypertension)")
    elif sys_bp >= 130:
        mods_5yr  += 2.0
        mods_10yr += 4.0
        key_factors.append("Borderline high blood pressure")

    # BMI
    if bmi >= 30:
        mods_5yr  += 3.0
        mods_10yr += 6.0
        key_factors.append("Obesity (BMI ≥ 30)")
    elif bmi >= 25:
        mods_5yr  += 1.5
        mods_10yr += 3.0
        key_factors.append("Overweight (BMI 25–29.9)")

    # Low oxygen saturation
    if spo2 < 94:
        mods_5yr  += 3.5
        mods_10yr += 7.0
        key_factors.append("Low blood oxygen saturation")
    elif spo2 < 97:
        mods_5yr  += 1.0
        mods_10yr += 2.0

    # Physical inactivity
    if steps < 3000:
        mods_5yr  += 3.0
        mods_10yr += 6.0
        key_factors.append("Sedentary lifestyle (< 3,000 steps/day)")
    elif steps < 7000:
        mods_5yr  += 1.0
        mods_10yr += 2.0

    # Sleep
    if sleep < 6 or sleep > 9:
        mods_5yr  += 2.0
        mods_10yr += 4.0
        key_factors.append("Poor sleep duration")

    # High stress
    if stress >= 70:
        mods_5yr  += 2.5
        mods_10yr += 5.0
        key_factors.append("Chronic high stress")
    elif stress >= 50:
        mods_5yr  += 1.0
        mods_10yr += 2.0

    # Protective effect of good health score
    protection = max(0.0, (health_score - 50) / 50 * 4)
    mods_5yr  -= protection
    mods_10yr -= protection * 2

    # ── Final risk values ──────────────────────────────────────────────
    risk_5yr  = round(max(1.0, min(99.0, base_5yr  + mods_5yr)),  1)
    risk_10yr = round(max(2.0, min(99.0, base_10yr + mods_10yr)), 1)

    if not key_factors:
        key_factors.append("No major risk factors identified")

    return LongTermRisk(
        risk_5yr=risk_5yr,
        risk_10yr=risk_10yr,
        risk_category=_categorise(risk_10yr),
        key_factors=key_factors[:4],  # cap at 4 for display
    )
