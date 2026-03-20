"use client";
import { motion } from "framer-motion";
import { Activity, CheckCircle, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FloatingPulse } from "@/components/animations/FloatingPulse";

export function TwinStatus() {
    const stats = [
        { label: "Accuracy", value: "96.3%", icon: CheckCircle, color: "#22C55E" },
        { label: "Data Points", value: "2.4M", icon: Zap, color: "#2563EB" },
        { label: "Last Sync", value: "2 min ago", icon: Clock, color: "#06B6D4" },
        { label: "Predictions", value: "Active", icon: Activity, color: "#8B5CF6" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-health-cyan/5 rounded-2xl border border-primary/10">
                <FloatingPulse size={12} color="#22C55E" />
                <div>
                    <p className="text-sm font-semibold text-dark">Digital Twin Active</p>
                    <p className="text-xs text-muted">Syncing with wearable devices</p>
                </div>
                <Badge label="Live" color="green" dot className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${s.color}15` }}
                        >
                            <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-dark">{s.value}</p>
                            <p className="text-[10px] text-muted">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
