"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HealthMetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: ReactNode;
    iconBg: string;
    trend?: "up" | "down" | "stable";
    trendValue?: string;
    status?: "normal" | "warning" | "critical";
    delay?: number;
}

const statusColors = {
    normal: "text-green-600",
    warning: "text-amber-600",
    critical: "text-red-600",
};

export function HealthMetricCard({
    label,
    value,
    unit,
    icon,
    iconBg,
    trend = "stable",
    trendValue,
    status = "normal",
    delay = 0,
}: HealthMetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)" }}
            className="health-card p-5 flex flex-col gap-4"
        >
            <div className="flex items-start justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                >
                    {icon}
                </div>
                {trendValue && (
                    <div className={cn("flex items-center gap-1 text-xs font-medium", statusColors[status])}>
                        {trend === "up" && <TrendingUp className="w-3 h-3" />}
                        {trend === "down" && <TrendingDown className="w-3 h-3" />}
                        {trend === "stable" && <Minus className="w-3 h-3" />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-baseline gap-1">
                    <motion.span
                        key={String(value)}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-2xl font-bold text-dark"
                    >
                        {value}
                    </motion.span>
                    {unit && <span className="text-sm text-muted font-medium">{unit}</span>}
                </div>
                <p className="text-xs text-muted mt-0.5 font-medium">{label}</p>
            </div>
        </motion.div>
    );
}
