/**
 * useSimulation — Dedicated simulation controller hook.
 *
 * Encapsulates all stage-timing logic, keeping MedicationPage clean.
 * Backed by the store's runMedicationSimulation() action.
 * Replace the inner call with a websocket/SSE subscription when backend is ready.
 */

import { useCallback } from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { simulateMedication } from '../services/api';

export function useSimulation() {
  const medSim = useHealthStore((s) => s.medSim);
  const healthScore = useHealthStore((s) => s.healthScore);
  const runMedicationSimulation = useHealthStore((s) => s.runMedicationSimulation);

  /**
   * Start the medication simulation.
   * 1. Calls API layer (mock for now)
   * 2. Hands off to store to drive the stage progression animation
   */
  const startSimulation = useCallback(
    async (drug: string, dosage: string) => {
      if (medSim.isRunning || !drug || !dosage) return;

      let result = null;
      try {
        result = await simulateMedication(drug, dosage, healthScore);
      } catch (e) {
        console.warn("Simulation API call failed, falling back to local simulation.", e);
      }

      // Kick off the local stage progression (driven by store)
      runMedicationSimulation(drug, dosage, result);
    },
    [medSim.isRunning, healthScore, runMedicationSimulation]
  );

  return {
    stage: medSim.stage,
    progress: medSim.progress,
    isRunning: medSim.isRunning,
    drug: medSim.drug,
    dosage: medSim.dosage,
    initialScore: medSim.initialScore,
    finalScore: medSim.finalScore,
    aiNote: medSim.aiNote,
    startSimulation,
  };
}
