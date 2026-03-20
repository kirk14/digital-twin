"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { VITALS_HISTORY } from "@/lib/constants";
import { motion } from "framer-motion";

interface VitalChartProps {
    dataKey: "heartRate" | "oxygen" | "stress";
    color: string;
    label: string;
    unit: string;
}

const CustomTooltip = ({ active, payload, label, unit }: { active?: boolean; payload?: any[]; label?: string; unit?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded-xl shadow-card-md border border-border px-3 py-2 text-xs">
                <p className="text-muted mb-1">{label}</p>
                <p className="font-bold text-dark">{payload[0].value} <span className="font-normal text-muted">{unit}</span></p>
            </div>
        );
    }
    return null;
};

export function VitalChart({ dataKey, color, label, unit }: VitalChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
        >
            <p className="text-xs font-medium text-muted mb-3">{label} (24h)</p>
            <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={VITALS_HISTORY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={5} />
                    <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip unit={unit} />} />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#gradient-${dataKey})`}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
