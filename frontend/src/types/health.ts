/**
 * Shared TypeScript interfaces matching both the frontend Zustand state
 * and the backend AnalysisResponse schema exactly.
 * Structured for backend plug-and-play: replace mock with real endpoint and UI reacts with zero changes.
 */

// ── Organ Types ────────────────────────────────────────────────────────────

export type OrganName =
  | 'heart'
  | 'lungs'
  | 'brain'
  | 'liver'
  | 'stomach'
  | 'kidneys'
  | 'vascular';

export type OrganStatus = 'normal' | 'warning' | 'critical';

export interface OrganStateData {
  status: OrganStatus;
  color: string;
  speed: 'slow' | 'normal' | 'fast';
  intensity: 'low' | 'medium' | 'high';
}

// ── Medication / Simulation Types ──────────────────────────────────────────

export type MedStage = 'idle' | 'ingestion' | 'absorption' | 'peak' | 'recovery';

export interface MedSimulationState {
  isRunning: boolean;
  stage: MedStage;
  progress: number;
  drug: string;
  dosage: string;
  initialScore: number;
  finalScore: number | null;
  aiNote: string | null;
  intervalId: ReturnType<typeof setInterval> | null;
}

export interface MedicationEffect {
  drug: string;
  dosage: string;
  score_delta: number;
  affected_organs: OrganName[];
  stages: MedStage[];
}

// ── Health Input ───────────────────────────────────────────────────────────

export interface HealthInputs {
  age: number;
  height: number;
  weight: number;
  bloodOxygen: number;
  activityLevel: number;
  sleepHours: number;
  systolicBP: number;
  diastolicBP: number;
  glucose: number;
  stressLevel: number;
  heartRate: number;
}

// ── Risks ──────────────────────────────────────────────────────────────────

export interface RiskScores {
  diabetes: number;
  heartDisease: number;
  hypertension: number;
}

// ── AI Insight ─────────────────────────────────────────────────────────────

export interface AIInsightItem {
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  text: string;
}

export interface AIInsight {
  summary: string;
  risk_vectors: AIInsightItem[];
  recommendations: string[];
  forecast: string;
}

// ── Timeline ───────────────────────────────────────────────────────────────

export interface TimelinePoint {
  month: string;
  actual: number | null;
  projected: number | null;
  simulated: number | null;
}

// ── Long-Term Risk (matches backend LongTermRisk) ──────────────────────────

export interface LongTermRisk {
  risk_5yr: number;
  risk_10yr: number;
  risk_category: 'Low' | 'Moderate' | 'High' | 'Very High';
  key_factors: string[];
}

// ── Analysis Response (matches backend AnalysisResponse exactly) ────────────

export interface AnalysisResponse {
  health_score: number;
  risks: {
    diabetes: number;
    heart: number;
    hypertension: number;
  };
  organs: Record<OrganName, OrganStateData>;
  medication_effect: MedicationEffect | null;
  timeline: TimelinePoint[];
  ai_insight: AIInsight;
  long_term?: LongTermRisk;
  recommendations?: string[];
}

// ── Medication Simulation Response ─────────────────────────────────────────

export interface MedicationSimResponse {
  drug: string;
  dosage: string;
  score_before: number;
  score_after: number;
  delta: number;
  affected_organs: OrganName[];
  ai_note: string;
}
