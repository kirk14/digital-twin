"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RiskIndicatorProps {
    label: string;
    value: number;
    max?: number;
    color?: string;
    showBar?: boolean;
}

function getRiskLevel(pct: number): { label: string; color: string } {
    if (pct < 30) return { label: "Low", color: "#22C55E" };
    if (pct < 65) return { label: "Moderate", color: "#F59E0B" };
    return { label: "High", color: "#EF4444" };
}

export function RiskIndicator({ label, value, max = 100, color, showBar = true }: RiskIndicatorProps) {
    const pct = Math.min(100, (value / max) * 100);
    const { label: riskLabel, color: riskColor } = getRiskLevel(pct);
    const fillColor = color ?? riskColor;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-dark">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-dark">{value}</span>
                    <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ color: fillColor, backgroundColor: `${fillColor}18` }}
                    >
                        {riskLabel}
                    </span>
                </div>
            </div>
            {showBar && (
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: fillColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                </div>
            )}
        </div>
    );
}
