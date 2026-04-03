"""
Threshold-based personalised health recommendations.
"""


def generate_recommendations(inputs: dict, health_score: float) -> list[str]:
    """
    Return a prioritised list of actionable recommendations (max 6).
    Each is a plain string for easy rendering.
    """
    recs: list[tuple[int, str]] = []  # (priority, message)

    steps    = inputs["steps_per_day"]
    sleep    = inputs["sleep_hours"]
    sys_bp   = inputs["systolic_bp"]
    spo2     = inputs["blood_oxygen"]
    stress   = inputs["stress_level"]
    hr       = inputs["heart_rate"]

    # ── Physical Activity ────────────────────────────────────────────────
    if steps < 3000:
        recs.append((1, "🚶 Increase daily steps to at least 7,000 — start with a 20-minute walk after meals."))
    elif steps < 7000:
        recs.append((2, "🏃 Aim for 10,000 steps/day — consider a morning walk or cycling commute."))
    elif steps >= 10_000:
        recs.append((5, "✅ Great activity level! Maintain your current routine and add strength training 2×/week."))

    # ── Sleep ─────────────────────────────────────────────────────────────
    if sleep < 6:
        recs.append((1, "😴 You are severely sleep-deprived. Prioritise 7–9 hours — use a consistent bedtime and avoid screens 1 hr before sleep."))
    elif sleep < 7:
        recs.append((2, "🌙 Try to get 7–8 hours of sleep. Even 45 minutes extra can noticeably improve cognition and metabolic health."))
    elif sleep > 9.5:
        recs.append((3, "⚠️ Excessive sleep can signal underlying issues. Discuss with your doctor if you consistently sleep > 9.5 hrs."))
    else:
        recs.append((5, "✅ Sleep duration is healthy. Focus on sleep quality — keep your room cool and dark."))

    # ── Blood Pressure ────────────────────────────────────────────────────
    if sys_bp >= 140:
        recs.append((1, "❤️ Your blood pressure is in Stage 2 hypertension range. Consult a physician promptly and reduce sodium intake to < 2,300 mg/day."))
    elif sys_bp >= 130:
        recs.append((2, "🩺 Borderline high BP detected. Follow a DASH diet (fruits, vegetables, low-fat dairy) and limit alcohol."))
    elif sys_bp <= 110:
        recs.append((3, "⚡ Low blood pressure noted. Stay well-hydrated and rise slowly from sitting or lying positions."))
    else:
        recs.append((5, "✅ Blood pressure is in the optimal range. Maintain a heart-healthy diet and limit processed foods."))

    # ── Blood Oxygen ─────────────────────────────────────────────────────
    if spo2 < 94:
        recs.append((1, "🫁 Blood oxygen is below safe threshold. Seek medical evaluation — there may be a respiratory or cardiac issue."))
    elif spo2 < 97:
        recs.append((3, "💨 SpO₂ is slightly low. Practice deep-breathing exercises and consider improving indoor air quality."))

    # ── Stress ───────────────────────────────────────────────────────────
    if stress >= 70:
        recs.append((1, "🧘 High stress is significantly impacting your health. Incorporate 10 min of mindfulness or meditation daily."))
    elif stress >= 50:
        recs.append((2, "😮‍💨 Moderate stress detected. Regular physical activity, journaling, and social connection can help regulate cortisol."))

    # ── Heart Rate ────────────────────────────────────────────────────────
    if hr > 100:
        recs.append((2, "💓 Resting heart rate is elevated. Aerobic training and stress reduction can lower it over weeks."))
    elif hr < 50:
        recs.append((3, "⚠️ Very low resting heart rate. If you are not a trained athlete, consult a cardiologist."))

    # ── Overall Score ─────────────────────────────────────────────────────
    if health_score >= 85:
        recs.append((5, "🌟 Outstanding health score! Stay consistent with your habits and schedule an annual check-up."))
    elif health_score < 50:
        recs.append((1, "📋 Your overall health score needs attention. A comprehensive GP check-up is recommended within 4 weeks."))

    # Sort by priority ascending and return top 6 messages
    recs.sort(key=lambda x: x[0])
    unique = list(dict.fromkeys(r[1] for r in recs))
    return unique[:6]
