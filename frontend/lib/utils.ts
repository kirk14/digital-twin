import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatValue(value: number, decimals = 1): string {
    return value.toFixed(decimals);
}

export function getRiskColor(value: number, max = 100): string {
    const pct = (value / max) * 100;
    if (pct < 33) return "#22C55E";
    if (pct < 66) return "#F59E0B";
    return "#EF4444";
}

export function getHealthStatus(score: number): {
    label: string;
    color: string;
    bg: string;
} {
    if (score >= 80) return { label: "Excellent", color: "#22C55E", bg: "#F0FDF4" };
    if (score >= 60) return { label: "Good", color: "#06B6D4", bg: "#ECFEFF" };
    if (score >= 40) return { label: "Fair", color: "#F59E0B", bg: "#FFFBEB" };
    return { label: "At Risk", color: "#EF4444", bg: "#FEF2F2" };
}

export function formatBPM(val: number) {
    return `${val} bpm`;
}
