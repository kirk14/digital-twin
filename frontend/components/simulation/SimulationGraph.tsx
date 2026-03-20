"use client";
import { motion } from "framer-motion";
import { useSimulation } from "@/hooks/useSimulation";
import { Button } from "@/components/ui/Button";
import { PlayCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function SimulationGraph() {
    const { result } = useSimulation();

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
                <PlayCircle className="w-10 h-10 text-muted/40" />
                <p className="text-sm text-muted font-medium">Run a simulation to see predictions</p>
                <p className="text-xs text-muted/60">Adjust controls and click Run Simulation</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-xl shadow-card-md border border-border px-3 py-2 text-xs">
                    <p className="text-muted mb-1">{label}</p>
                    {payload.map((p) => (
                        <p key={p.name} style={{ color: p.color }} className="font-semibold">
                            {p.name}: {p.value.toFixed(1)}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.projection} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={2} />
                    <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} dot={false} name="Risk %" />
                    <Line type="monotone" dataKey="recovery" stroke="#22C55E" strokeWidth={2} dot={false} name="Recovery %" />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
