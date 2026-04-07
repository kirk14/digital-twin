/**
 * API Service Layer — ALL network calls go here.
 *
 * Currently uses mock responses structured EXACTLY like the backend schema.
 * To plug in the real backend: change BASE_URL and remove the mock interceptor.
 *
 * Backend endpoint: POST /analyze  (FastAPI @ localhost:8000)
 */

import axios from 'axios';
import type {
  HealthInputs,
  AnalysisResponse,
  MedicationSimResponse,
  OrganStateData,
  OrganName,
  TimelinePoint,
} from '../types/health';

// ── Config ─────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Mock Mode ──────────────────────────────────────────────────────────────
// Set VITE_USE_MOCK=false in .env to hit the real backend

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// ── Mock helpers ───────────────────────────────────────────────────────────

function resolveColor(status: 'normal' | 'warning' | 'critical'): string {
  if (status === 'normal') return '#22c55e';
  if (status === 'warning') return '#f59e0b';
  return '#ef4444';
}

function organFromInputs(inputs: HealthInputs): Record<OrganName, OrganStateData> {
  const heartStatus =
    inputs.systolicBP > 140 || inputs.heartRate > 100
      ? 'critical'
      : inputs.systolicBP > 125 || inputs.heartRate > 85
      ? 'warning'
      : 'normal';

  const lungsStatus = inputs.activityLevel < 3 ? 'warning' : 'normal';
  const brainStatus =
    inputs.sleepHours < 5
      ? 'critical'
      : inputs.sleepHours < 7 || inputs.stressLevel > 7
      ? 'warning'
      : 'normal';
  const liverStatus =
    inputs.glucose > 140
      ? 'critical'
      : inputs.glucose > 110
      ? 'warning'
      : 'normal';
  const stomachStatus =
    inputs.stressLevel > 8
      ? 'critical'
      : inputs.stressLevel > 5
      ? 'warning'
      : 'normal';
  const kidneysStatus =
    inputs.diastolicBP > 100 || inputs.glucose > 160
      ? 'critical'
      : inputs.diastolicBP > 90 || inputs.glucose > 120
      ? 'warning'
      : 'normal';
  const vascularStatus = inputs.systolicBP > 140 ? 'critical' : inputs.systolicBP > 125 ? 'warning' : 'normal';

  const make = (
    status: 'normal' | 'warning' | 'critical',
    speed: 'slow' | 'normal' | 'fast' = 'normal',
    intensity: 'low' | 'medium' | 'high' = 'medium'
  ): OrganStateData => ({ status, color: resolveColor(status), speed, intensity });

  return {
    heart: make(heartStatus, inputs.systolicBP > 125 ? 'fast' : 'normal', heartStatus === 'critical' ? 'high' : 'medium'),
    lungs: make(lungsStatus, inputs.activityLevel > 8 ? 'fast' : inputs.activityLevel < 3 ? 'slow' : 'normal', 'low'),
    brain: make(brainStatus, 'normal', inputs.sleepHours < 5 ? 'low' : inputs.sleepHours < 7 ? 'medium' : 'high'),
    liver: make(liverStatus, 'normal', inputs.glucose > 140 ? 'high' : inputs.glucose > 110 ? 'medium' : 'low'),
    stomach: make(stomachStatus, 'normal', inputs.stressLevel > 8 ? 'high' : inputs.stressLevel > 5 ? 'medium' : 'low'),
    kidneys: make(kidneysStatus, 'normal', kidneysStatus === 'critical' ? 'high' : kidneysStatus === 'warning' ? 'medium' : 'low'),
    vascular: make(vascularStatus, inputs.systolicBP > 140 ? 'fast' : 'normal', vascularStatus === 'normal' ? 'low' : 'medium'),
  };
}

function calcScore(inputs: HealthInputs): number {
  let score = 100
    - Math.abs(inputs.weight - 70) * 0.5
    + (inputs.activityLevel - 5) * 2
    - Math.abs(inputs.sleepHours - 8) * 3
    - (inputs.systolicBP > 120 ? (inputs.systolicBP - 120) * 0.5 : 0)
    - (inputs.diastolicBP > 80 ? (inputs.diastolicBP - 80) * 0.5 : 0)
    - (inputs.glucose > 100 ? (inputs.glucose - 100) * 0.4 : 0)
    - inputs.stressLevel * 1.5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildTimeline(currentScore: number): TimelinePoint[] {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => ({
    month,
    actual: i <= 5 ? Math.max(0, Math.min(100, currentScore - (5 - i) * 2 + (Math.random() * 4 - 2))) : null,
    projected: i >= 5 ? Math.min(100, currentScore + (i - 5) * 5) : null,
    simulated: i >= 4 ? Math.min(100, currentScore + (i - 4) * 8) : null,
  }));
}

function buildMockAnalysisResponse(inputs: HealthInputs): AnalysisResponse {
  const score = calcScore(inputs);
  const diabetesRisk = Math.min(99, Math.max(2, Math.round((inputs.weight - 60) * 0.5 + (inputs.glucose - 80) * 0.5 - inputs.activityLevel * 2)));
  const heartRisk = Math.min(99, Math.max(1, Math.round((inputs.systolicBP - 110) * 0.3 + inputs.stressLevel * 2 + (inputs.weight - 60) * 0.3 - inputs.activityLevel * 1.5)));
  const hypertensionRisk = Math.min(99, Math.max(5, Math.round((inputs.systolicBP - 100) * 0.4 + (inputs.diastolicBP - 70) * 0.4 + inputs.stressLevel * 2)));

  const warnings: string[] = [];
  if (inputs.systolicBP > 130) warnings.push('Elevated systolic pressure increasing vascular load.');
  if (inputs.glucose > 110) warnings.push('Pre-diabetic glucose range — hepatic and renal stress detected.');
  if (inputs.sleepHours < 7) warnings.push('Sleep deficit impairing cortisol regulation and cognitive recovery.');
  if (inputs.stressLevel > 6) warnings.push('Elevated stress index compressing cardiac reserve capacity.');

  const recs: string[] = [];
  if (score < 80) recs.push('Increase daily physical activity to ≥ 7,500 steps.');
  if (inputs.sleepHours < 7.5) recs.push('Target 7.5–8.5 hours of consolidated sleep nightly.');
  if (inputs.systolicBP > 125) recs.push('Consider low-sodium diet and BP monitoring protocol.');
  if (inputs.glucose > 100) recs.push('Reduce refined carbohydrates; schedule HbA1c test.');
  if (recs.length === 0) recs.push('Maintain current physiological homeostasis.');

  return {
    health_score: score,
    risks: { diabetes: diabetesRisk, heart: heartRisk, hypertension: hypertensionRisk },
    organs: organFromInputs(inputs),
    medication_effect: null,
    timeline: buildTimeline(score),
    ai_insight: {
      summary: `Twin operating at ${score}% integrity. ${score < 70 ? 'Significant stress loads detected across multiple organ systems.' : score < 85 ? 'System is moderately stable with localized stress vectors.' : 'Optimal physiological homeostasis maintained.'}`,
      risk_vectors: warnings.map((text, i) => ({
        type: i === 0 ? 'warning' : 'critical',
        title: `Vector ${String(i + 1).padStart(2, '0')}`,
        text,
      })),
      recommendations: recs,
      forecast: score >= 85
        ? 'Projected health trajectory is positive. Maintain current lifestyle parameters.'
        : `Implementing recommended changes could improve health score by ${Math.round((100 - score) * 0.35)} points over 90 days.`,
    },
    long_term: {
      risk_5yr: Math.min(60, Math.round(heartRisk * 0.8 + hypertensionRisk * 0.3)),
      risk_10yr: Math.min(80, Math.round(heartRisk * 1.2 + hypertensionRisk * 0.5 + diabetesRisk * 0.3)),
      risk_category: score >= 80 ? 'Low' : score >= 65 ? 'Moderate' : score >= 45 ? 'High' : 'Very High',
      key_factors: [
        inputs.systolicBP > 130 ? 'Hypertension' : null,
        inputs.glucose > 110 ? 'Dysglycemia' : null,
        inputs.stressLevel > 6 ? 'Chronic stress' : null,
        inputs.sleepHours < 7 ? 'Sleep disorder risk' : null,
      ].filter(Boolean) as string[],
    },
    recommendations: recs,
  };
}

function buildMockMedResponse(
  drug: string,
  dosage: string,
  scoreBefore: number
): MedicationSimResponse {
  const delta = Math.round(Math.random() * 8 + 3);
  return {
    drug,
    dosage,
    score_before: scoreBefore,
    score_after: Math.min(100, scoreBefore + delta),
    delta,
    affected_organs: ['stomach', 'liver', 'heart', 'vascular'] as OrganName[],
    ai_note: `${drug} ${dosage} expected to reduce vascular resistance by ~${Math.round(delta * 2.5)}% over 4–6 hours. Monitor renal clearance.`,
  };
}

// ── Simulated network delay ────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Public API Functions ───────────────────────────────────────────────────

/**
 * Analyze health inputs.
 * Backend: POST /analyze
 * Mock: returns computed response matching AnalysisResponse schema.
 */
export async function analyzeHealth(inputs: HealthInputs): Promise<AnalysisResponse> {
  if (USE_MOCK) {
    await delay(900 + Math.random() * 400);
    return buildMockAnalysisResponse(inputs);
  }

  // Real backend call — maps frontend field names to backend schema
  const payload = {
    age: inputs.age,
    steps_per_day: inputs.activityLevel * 1500,
    sleep_hours: inputs.sleepHours,
    heart_rate: inputs.heartRate,
    systolic_bp: inputs.systolicBP,
    diastolic_bp: inputs.diastolicBP,
    blood_oxygen: inputs.bloodOxygen,
    stress_level: inputs.stressLevel * 10,
    weight_kg: inputs.weight,
    height_cm: inputs.height,
  };

  const { data } = await apiClient.post<AnalysisResponse>('/analyze', payload);
  return data;
}

/**
 * Simulate medication pharmacokinetics.
 * Backend: POST /simulate-medication (to be implemented)
 * Mock: returns structured delta + affected organ list.
 */
export async function simulateMedication(
  drug: string,
  dosage: string,
  currentScore: number
): Promise<MedicationSimResponse> {
  if (USE_MOCK) {
    await delay(300);
    return buildMockMedResponse(drug, dosage, currentScore);
  }

  const { data } = await apiClient.post<MedicationSimResponse>('/simulate-medication', {
    drug,
    dosage,
    current_score: currentScore,
  });
  return data;
}

/**
 * Get AI insight independently (for Insights page refresh).
 * Backend: POST /insight
 * Mock: returns insight section of AnalysisResponse.
 */
export async function getAIInsight(inputs: HealthInputs): Promise<AnalysisResponse> {
  return analyzeHealth(inputs); // reuse full analysis for now
}
