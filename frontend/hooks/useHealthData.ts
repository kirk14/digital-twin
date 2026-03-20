"use client";
import { useState, useEffect } from "react";
import { VITALS_HISTORY, HEALTH_METRICS } from "@/lib/constants";

export function useHealthData() {
    const [metrics, setMetrics] = useState(HEALTH_METRICS);
    const [history] = useState(VITALS_HISTORY);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                ...prev,
                heartRate: {
                    ...prev.heartRate,
                    value: 68 + Math.round(Math.random() * 10),
                },
                bloodOxygen: {
                    ...prev.bloodOxygen,
                    value: 96 + Math.round(Math.random() * 3),
                },
                stressLevel: {
                    ...prev.stressLevel,
                    value: 25 + Math.round(Math.random() * 20),
                },
            }));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return { metrics, history, loading };
}
