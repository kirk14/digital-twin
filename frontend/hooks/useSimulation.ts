"use client";
import { useState, useCallback } from "react";
import { fetchSimulationResult } from "@/lib/api";

export function useSimulation() {
    const [exercise, setExercise] = useState(40);
    const [sugar, setSugar] = useState(50);
    const [medication, setMedication] = useState("None");
    const [result, setResult] = useState<{
        heartDiseaseRisk: number;
        recoveryRate: number;
        riskReduction: number;
        projection: { month: string; risk: number; recovery: number }[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const runSimulation = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSimulationResult({ exercise, sugar, medication });
            setResult(data);
        } finally {
            setLoading(false);
        }
    }, [exercise, sugar, medication]);

    return {
        exercise, setExercise,
        sugar, setSugar,
        medication, setMedication,
        result, loading,
        runSimulation,
    };
}
