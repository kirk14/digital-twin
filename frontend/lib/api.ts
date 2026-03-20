// Mock API layer for health data
export async function fetchHealthMetrics() {
    // In production, replace with real API calls
    await new Promise((r) => setTimeout(r, 300));
    return {
        heartRate: 72,
        bloodOxygen: 98,
        bloodPressure: "118/76",
        sleepScore: 84,
        stressLevel: 32,
        healthScore: 87,
    };
}

export async function fetchSimulationResult(params: {
    exercise: number;
    sugar: number;
    medication: string;
}) {
    await new Promise((r) => setTimeout(r, 600));
    const riskReduction = Math.round(params.exercise * 0.4 + (100 - params.sugar) * 0.2);
    const recoveryRate = Math.round(params.exercise * 0.3 + 60);
    return {
        heartDiseaseRisk: Math.max(5, 45 - riskReduction),
        recoveryRate: Math.min(95, recoveryRate),
        riskReduction,
        projection: Array.from({ length: 12 }, (_, i) => ({
            month: `Month ${i + 1}`,
            risk: Math.max(5, 45 - riskReduction * ((i + 1) / 12)),
            recovery: Math.min(95, recoveryRate * ((i + 1) / 12) + 20),
        })),
    };
}

export async function fetchTwinData() {
    await new Promise((r) => setTimeout(r, 200));
    return {
        lastSync: new Date().toISOString(),
        status: "Active",
        accuracy: 96.3,
    };
}
