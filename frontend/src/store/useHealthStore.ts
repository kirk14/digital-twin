import { create } from 'zustand';
import type { AnalysisResponse } from '../types/health';

// Re-export types kept here for backward compatibility with existing component imports
export type { OrganName, OrganStatus, OrganStateData, MedStage, MedSimulationState } from '../types/health';

export interface HealthState {
  // ── Inputs ──────────────────────────────────────────────────────────────
  weight: number;
  activityLevel: number;
  sleepHours: number;
  systolicBP: number;
  diastolicBP: number;
  glucose: number;
  stressLevel: number;
  heartRate: number;

  // ── Simulation State ─────────────────────────────────────────────────────
  isSimulatingImproved: boolean;
  xrayMode: boolean;
  medSim: {
    isRunning: boolean;
    stage: 'idle' | 'ingestion' | 'absorption' | 'peak' | 'recovery';
    progress: number;
    drug: string;
    dosage: string;
    initialScore: number;
    finalScore: number | null;
    intervalId: ReturnType<typeof setInterval> | null;
  };

  // ── API State ─────────────────────────────────────────────────────────────
  apiResponse: AnalysisResponse | null;
  isAnalyzing: boolean;

  // ── Derived Values ────────────────────────────────────────────────────────
  healthScore: number;
  risks: { diabetes: number; heartDisease: number; hypertension: number };
  organs: Record<import('../types/health').OrganName, import('../types/health').OrganStateData>;
  focusedOrgan: import('../types/health').OrganName | null;
  selectedScenario: string;

  // ── Actions ───────────────────────────────────────────────────────────────
  updateMetric: (key: keyof HealthState, value: number) => void;
  setFocusedOrgan: (organ: import('../types/health').OrganName | null) => void;
  setSelectedScenario: (val: string) => void;
  runMedicationSimulation: (drug: string, dosage: string) => void;
  toggleSimulation: () => void;
  toggleXrayMode: () => void;
  recalculateState: () => void;
  setApiResponse: (response: AnalysisResponse) => void;
  setIsAnalyzing: (val: boolean) => void;
}

import type { OrganStatus, OrganName, OrganStateData } from '../types/health';

const resolveColor = (status: OrganStatus): string => {
  switch (status) {
    case 'normal': return '#22c55e';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    default: return '#22c55e';
  }
};

type MedStage = 'idle' | 'ingestion' | 'absorption' | 'peak' | 'recovery';

export const useHealthStore = create<HealthState>((set, get) => ({
  weight: 72,
  activityLevel: 4,
  sleepHours: 6.5,
  systolicBP: 135,
  diastolicBP: 88,
  glucose: 105,
  stressLevel: 6,
  heartRate: 75,

  isSimulatingImproved: false,
  xrayMode: false,

  medSim: {
    isRunning: false,
    stage: 'idle',
    progress: 0,
    drug: '',
    dosage: '',
    initialScore: 0,
    finalScore: null,
    intervalId: null,
  },

  // API state
  apiResponse: null,
  isAnalyzing: false,

  healthScore: 78,
  risks: { diabetes: 18, heartDisease: 15, hypertension: 25 },
  focusedOrgan: null,
  selectedScenario: 'optimization-protocol-901',

  organs: {
    heart: { status: 'warning', color: '#f59e0b', speed: 'fast', intensity: 'medium' },
    lungs: { status: 'normal', color: '#22c55e', speed: 'normal', intensity: 'low' },
    brain: { status: 'warning', color: '#f59e0b', speed: 'normal', intensity: 'medium' },
    liver: { status: 'normal', color: '#22c55e', speed: 'normal', intensity: 'medium' },
    stomach: { status: 'normal', color: '#22c55e', speed: 'normal', intensity: 'low' },
    kidneys: { status: 'normal', color: '#22c55e', speed: 'normal', intensity: 'low' },
    vascular: { status: 'warning', color: '#f59e0b', speed: 'fast', intensity: 'medium' },
  },

  // ── API actions ────────────────────────────────────────────────────────────

  setApiResponse: (response) => set({ apiResponse: response }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),

  // ── UI actions ─────────────────────────────────────────────────────────────

  setFocusedOrgan: (organ) => set({ focusedOrgan: organ }),
  setSelectedScenario: (val) => set({ selectedScenario: val }),

  toggleSimulation: () => {
    set((state) => ({ isSimulatingImproved: !state.isSimulatingImproved }));
    get().recalculateState();
  },

  toggleXrayMode: () => set((state) => ({ xrayMode: !state.xrayMode })),

  updateMetric: (key, value) => {
    set({ [key]: value, isSimulatingImproved: false });
    get().recalculateState();
  },

  // ── Medication Simulation ─────────────────────────────────────────────────

  runMedicationSimulation: (drug, dosage) => {
    const state = get();
    if (state.medSim.isRunning) return;

    if (state.medSim.intervalId) clearInterval(state.medSim.intervalId);

    set({
      medSim: {
        ...state.medSim,
        isRunning: true,
        stage: 'ingestion',
        progress: 0,
        drug,
        dosage,
        initialScore: state.healthScore,
        finalScore: null,
        intervalId: null,
      },
    });

    get().recalculateState();

    const interval = setInterval(() => {
      const current = get();
      if (!current.medSim.isRunning) {
        clearInterval(interval);
        return;
      }

      let newProgress = current.medSim.progress + 1;
      let newStage: MedStage = current.medSim.stage;

      if (newProgress <= 20) newStage = 'ingestion';
      else if (newProgress <= 50) newStage = 'absorption';
      else if (newProgress <= 80) newStage = 'peak';
      else if (newProgress <= 100) newStage = 'recovery';

      // Apply biological modifications at key stages
      if (newProgress === 35) {
        set({ glucose: Math.max(80, current.glucose - 10) });
      }
      if (newProgress === 65) {
        set({
          systolicBP: Math.max(110, current.systolicBP - 15),
          diastolicBP: Math.max(70, current.diastolicBP - 10),
          stressLevel: Math.max(2, current.stressLevel - 2),
        });
      }

      set((s) => ({ medSim: { ...s.medSim, progress: newProgress, stage: newStage } }));
      get().recalculateState();

      if (newProgress >= 100) {
        clearInterval(interval);
        set((s) => ({
          medSim: {
            ...s.medSim,
            isRunning: false,
            stage: 'idle',
            progress: 0,
            finalScore: s.healthScore,
            intervalId: null,
          },
        }));
        get().recalculateState();
      }
    }, 100);

    set((s) => ({ medSim: { ...s.medSim, intervalId: interval } }));
  },

  // ── Recalculate (core engine) ─────────────────────────────────────────────

  recalculateState: () => {
    const rawState = get();

    // Proxy inputs if simulating improved
    const weight = rawState.isSimulatingImproved ? Math.max(65, rawState.weight - 5) : rawState.weight;
    const activityLevel = rawState.isSimulatingImproved ? Math.min(10, rawState.activityLevel + 4) : rawState.activityLevel;
    const sleepHours = rawState.isSimulatingImproved ? Math.max(8, rawState.sleepHours + 1.5) : rawState.sleepHours;
    const systolicBP = rawState.isSimulatingImproved ? Math.max(115, rawState.systolicBP - 20) : rawState.systolicBP;
    const diastolicBP = rawState.isSimulatingImproved ? Math.max(75, rawState.diastolicBP - 15) : rawState.diastolicBP;
    const glucose = rawState.isSimulatingImproved ? Math.max(85, rawState.glucose - 20) : rawState.glucose;
    const stressLevel = rawState.isSimulatingImproved ? Math.max(2, rawState.stressLevel - 4) : rawState.stressLevel;

    const derivedHR = 60 + stressLevel * 3 + (systolicBP - 120) * 0.4;

    let healthScore = 100
      - Math.abs(weight - 70) * 0.5
      + (activityLevel - 5) * 2
      - Math.abs(sleepHours - 8) * 3
      - (systolicBP > 120 ? (systolicBP - 120) * 0.5 : 0)
      - (diastolicBP > 80 ? (diastolicBP - 80) * 0.5 : 0)
      - (glucose > 100 ? (glucose - 100) * 0.4 : 0)
      - stressLevel * 1.5;

    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    const diabetesRisk = Math.min(99, Math.max(2, Math.round((weight - 60) * 0.5 + (glucose - 80) * 0.5 - activityLevel * 2)));
    const heartRisk = Math.min(99, Math.max(1, Math.round((systolicBP - 110) * 0.3 + stressLevel * 2 + (weight - 60) * 0.3 - activityLevel * 1.5)));
    const hypertensionRisk = Math.min(99, Math.max(5, Math.round((systolicBP - 100) * 0.4 + (diastolicBP - 70) * 0.4 + stressLevel * 2)));

    // Organ computation
    let heartStatus: OrganStatus = systolicBP > 140 || derivedHR > 100 ? 'critical' : systolicBP > 125 || derivedHR > 85 ? 'warning' : 'normal';
    let heartSpeed: 'slow' | 'normal' | 'fast' = systolicBP > 125 || derivedHR > 85 ? 'fast' : derivedHR < 60 ? 'slow' : 'normal';
    let lungsStatus: OrganStatus = activityLevel < 3 ? 'warning' : 'normal';
    let lungsSpeed: 'slow' | 'normal' | 'fast' = activityLevel > 8 ? 'fast' : activityLevel < 3 ? 'slow' : 'normal';
    let brainStatus: OrganStatus = sleepHours < 5 ? 'critical' : sleepHours < 7 || stressLevel > 7 ? 'warning' : 'normal';
    let brainIntensity: 'low' | 'medium' | 'high' = sleepHours < 5 ? 'low' : sleepHours < 7 || stressLevel > 7 ? 'medium' : 'high';
    let liverStatus: OrganStatus = glucose > 140 || weight > 95 ? 'critical' : glucose > 110 || weight > 85 ? 'warning' : 'normal';
    let liverIntensity: 'low' | 'medium' | 'high' = glucose > 140 ? 'high' : glucose > 110 ? 'medium' : 'low';
    let stomachStatus: OrganStatus = stressLevel > 8 ? 'critical' : stressLevel > 5 ? 'warning' : 'normal';
    let stomachIntensity: 'low' | 'medium' | 'high' = stressLevel > 8 ? 'high' : stressLevel > 5 ? 'medium' : 'low';
    let kidneysStatus: OrganStatus = diastolicBP > 100 || glucose > 160 ? 'critical' : diastolicBP > 90 || glucose > 120 ? 'warning' : 'normal';
    let kidneysIntensity: 'low' | 'medium' | 'high' = diastolicBP > 100 || glucose > 160 ? 'high' : diastolicBP > 90 || glucose > 120 ? 'medium' : 'low';
    let vascularStatus: OrganStatus = systolicBP > 140 ? 'critical' : systolicBP > 125 ? 'warning' : 'normal';
    let vascularSpeed: 'slow' | 'normal' | 'fast' = systolicBP > 140 ? 'fast' : 'normal';

    // Medication stage overrides
    const { isRunning, stage } = rawState.medSim;
    if (isRunning) {
      if (stage === 'ingestion') {
        stomachStatus = 'warning'; stomachIntensity = 'high';
      } else if (stage === 'absorption') {
        stomachStatus = 'warning'; stomachIntensity = 'medium';
        liverStatus = 'warning'; liverIntensity = 'high';
      } else if (stage === 'peak') {
        heartStatus = 'normal'; heartSpeed = 'normal';
        lungsStatus = 'normal'; lungsSpeed = 'normal';
        vascularStatus = 'normal'; vascularSpeed = 'normal';
        liverIntensity = 'low'; stomachIntensity = 'low';
      } else if (stage === 'recovery') {
        heartStatus = 'normal'; liverStatus = 'normal'; stomachStatus = 'normal';
      }
    }

    const organs: Record<OrganName, OrganStateData> = {
      heart: { status: heartStatus, color: isRunning && stage === 'peak' ? resolveColor('normal') : resolveColor(heartStatus), speed: heartSpeed, intensity: heartStatus === 'critical' ? 'high' : 'medium' },
      lungs: { status: lungsStatus, color: resolveColor(lungsStatus), speed: lungsSpeed, intensity: lungsStatus === 'normal' ? 'low' : 'medium' },
      brain: { status: brainStatus, color: resolveColor(brainStatus), speed: 'normal', intensity: brainIntensity },
      liver: { status: liverStatus, color: isRunning && stage === 'absorption' ? '#06b6d4' : resolveColor(liverStatus), speed: 'normal', intensity: liverIntensity },
      stomach: { status: stomachStatus, color: isRunning && (stage === 'ingestion' || stage === 'absorption') ? '#06b6d4' : resolveColor(stomachStatus), speed: 'normal', intensity: stomachIntensity },
      kidneys: { status: kidneysStatus, color: resolveColor(kidneysStatus), speed: 'normal', intensity: kidneysIntensity },
      vascular: { status: vascularStatus, color: resolveColor(vascularStatus), speed: vascularSpeed, intensity: vascularStatus === 'normal' ? 'low' : 'medium' },
    };

    set({ healthScore, heartRate: Math.round(derivedHR), risks: { diabetes: diabetesRisk, heartDisease: heartRisk, hypertension: hypertensionRisk }, organs });
  },
}));
