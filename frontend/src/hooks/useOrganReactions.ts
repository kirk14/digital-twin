/**
 * useOrganReactions — pure organ mapping function extracted from store.
 *
 * Takes health inputs → returns organ state map.
 * Reusable: used by ComparePage to show two different organ states side-by-side
 * without touching the main store.
 */

import { useMemo } from 'react';
import type { HealthInputs, OrganName, OrganStateData, OrganStatus } from '../types/health';

function resolveColor(status: OrganStatus): string {
  if (status === 'normal') return '#22c55e';
  if (status === 'warning') return '#f59e0b';
  return '#ef4444';
}

/**
 * Pure function: health inputs → organ state record
 * Used by the store and directly by ComparePage for the "optimized" side.
 */
export function computeOrganStates(
  inputs: HealthInputs,
  medStage?: string
): Record<OrganName, OrganStateData> {
  const { systolicBP, diastolicBP, activityLevel, sleepHours, stressLevel, glucose, heartRate } = inputs;

  const derivedHR = heartRate ?? 60 + stressLevel * 3 + (systolicBP - 120) * 0.4;

  let heartStatus: OrganStatus = systolicBP > 140 || derivedHR > 100 ? 'critical' : systolicBP > 125 || derivedHR > 85 ? 'warning' : 'normal';
  let heartSpeed: 'slow' | 'normal' | 'fast' = systolicBP > 125 ? 'fast' : derivedHR < 60 ? 'slow' : 'normal';

  const lungsStatus: OrganStatus = activityLevel < 3 ? 'warning' : 'normal';
  const lungsSpeed: 'slow' | 'normal' | 'fast' = activityLevel > 8 ? 'fast' : activityLevel < 3 ? 'slow' : 'normal';

  const brainStatus: OrganStatus = sleepHours < 5 ? 'critical' : sleepHours < 7 || stressLevel > 7 ? 'warning' : 'normal';
  const brainIntensity: 'low' | 'medium' | 'high' = sleepHours < 5 ? 'low' : sleepHours < 7 || stressLevel > 7 ? 'medium' : 'high';

  let liverStatus: OrganStatus = glucose > 140 ? 'critical' : glucose > 110 ? 'warning' : 'normal';
  const liverIntensity: 'low' | 'medium' | 'high' = glucose > 140 ? 'high' : glucose > 110 ? 'medium' : 'low';

  let stomachStatus: OrganStatus = stressLevel > 8 ? 'critical' : stressLevel > 5 ? 'warning' : 'normal';
  const stomachIntensity: 'low' | 'medium' | 'high' = stressLevel > 8 ? 'high' : stressLevel > 5 ? 'medium' : 'low';

  const kidneysStatus: OrganStatus = diastolicBP > 100 || glucose > 160 ? 'critical' : diastolicBP > 90 || glucose > 120 ? 'warning' : 'normal';
  const kidneysIntensity: 'low' | 'medium' | 'high' = kidneysStatus === 'critical' ? 'high' : kidneysStatus === 'warning' ? 'medium' : 'low';

  let vascularStatus: OrganStatus = systolicBP > 140 ? 'critical' : systolicBP > 125 ? 'warning' : 'normal';
  let vascularSpeed: 'slow' | 'normal' | 'fast' = systolicBP > 140 ? 'fast' : 'normal';

  // Medication overrides
  if (medStage === 'peak') {
    heartStatus = 'normal'; heartSpeed = 'normal';
    vascularStatus = 'normal'; vascularSpeed = 'normal';
  }
  if (medStage === 'ingestion') stomachStatus = 'warning';
  if (medStage === 'absorption') liverStatus = 'warning';

  return {
    heart: { status: heartStatus, color: resolveColor(heartStatus), speed: heartSpeed, intensity: heartStatus === 'critical' ? 'high' : 'medium' },
    lungs: { status: lungsStatus, color: resolveColor(lungsStatus), speed: lungsSpeed, intensity: lungsStatus === 'normal' ? 'low' : 'medium' },
    brain: { status: brainStatus, color: resolveColor(brainStatus), speed: 'normal', intensity: brainIntensity },
    liver: { status: liverStatus, color: medStage === 'absorption' ? '#06b6d4' : resolveColor(liverStatus), speed: 'normal', intensity: liverIntensity },
    stomach: { status: stomachStatus, color: (medStage === 'ingestion' || medStage === 'absorption') ? '#06b6d4' : resolveColor(stomachStatus), speed: 'normal', intensity: stomachIntensity },
    kidneys: { status: kidneysStatus, color: resolveColor(kidneysStatus), speed: 'normal', intensity: kidneysIntensity },
    vascular: { status: vascularStatus, color: resolveColor(vascularStatus), speed: vascularSpeed, intensity: vascularStatus === 'normal' ? 'low' : 'medium' },
  };
}

/**
 * Hook version: memoizes organ states from health inputs.
 * Use this in components. Falls back to current store state.
 */
export function useOrganReactions(inputs: HealthInputs) {
  return useMemo(() => computeOrganStates(inputs), [
    inputs.systolicBP,
    inputs.diastolicBP,
    inputs.activityLevel,
    inputs.sleepHours,
    inputs.stressLevel,
    inputs.glucose,
    inputs.heartRate,
    inputs.weight,
  ]);
}
