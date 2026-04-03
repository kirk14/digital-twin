"""
What-if simulation engine.

Takes a baseline HealthInput and a pre-loaded model, then runs three
lifestyle-improvement scenarios and returns the score deltas.
"""
from schema import SimulationScenario
from model import HealthModel


def run_simulation(inputs: dict, model: HealthModel) -> list[SimulationScenario]:
    """
    Run three what-if scenarios against the baseline score.

    Scenarios
    ---------
    1. +3000 Steps / Day  — increase activity
    2. Optimal Sleep (8h) — fix sleep deficit or excess
    3. Reduced Blood Pressure — lower systolic by 10 mmHg
    """
    baseline_score = model.predict_score(inputs)
    results: list[SimulationScenario] = []

    # ── Scenario 1: Extra Steps ──────────────────────────────────────────
    s1 = dict(inputs)
    s1["steps_per_day"] = min(inputs["steps_per_day"] + 3000, 20_000)
    score1 = model.predict_score(s1)
    delta1 = round(score1 - baseline_score, 1)
    results.append(SimulationScenario(
        name="Add 3,000 Steps/Day",
        description="Walk an extra 2–3 km daily",
        icon="footprints",
        current_score=round(baseline_score, 1),
        projected_score=round(score1, 1),
        delta=delta1,
        insight=(
            f"Increasing daily activity could improve your score by {delta1:+.1f} pts. "
            "Regular walking reduces cardiovascular risk and supports metabolic health."
        ) if delta1 > 0 else
            "Your activity level is already well-optimised — great work!",
    ))

    # ── Scenario 2: Optimal Sleep ────────────────────────────────────────
    s2 = dict(inputs)
    s2["sleep_hours"] = 8.0
    score2 = model.predict_score(s2)
    delta2 = round(score2 - baseline_score, 1)
    results.append(SimulationScenario(
        name="Optimal Sleep (8 hrs)",
        description="Target 7–9 hours of quality sleep",
        icon="moon",
        current_score=round(baseline_score, 1),
        projected_score=round(score2, 1),
        delta=delta2,
        insight=(
            f"Adjusting to 8 hrs sleep could shift your score by {delta2:+.1f} pts. "
            "Sleep directly regulates cortisol, heart rate, and metabolic recovery."
        ) if abs(delta2) > 0.5 else
            "You are already getting near-optimal sleep — excellent habit!",
    ))

    # ── Scenario 3: Reduced Blood Pressure ──────────────────────────────
    s3 = dict(inputs)
    s3["systolic_bp"] = max(90, inputs["systolic_bp"] - 10)
    s3["diastolic_bp"] = max(55, inputs["diastolic_bp"] - 5)
    score3 = model.predict_score(s3)
    delta3 = round(score3 - baseline_score, 1)
    results.append(SimulationScenario(
        name="Reduce Blood Pressure",
        description="Lower systolic by 10 mmHg via diet & lifestyle",
        icon="heart",
        current_score=round(baseline_score, 1),
        projected_score=round(score3, 1),
        delta=delta3,
        insight=(
            f"Reducing BP by 10/5 mmHg could improve your score by {delta3:+.1f} pts. "
            "A DASH-style diet and reduced sodium are highly effective."
        ) if delta3 > 0 else
            "Your blood pressure is already in a healthy range — keep it up!",
    ))

    return results
