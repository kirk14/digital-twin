"use client";
import { motion } from "framer-motion";
import { Heart, Droplets, Moon, Activity, User } from "lucide-react";

const events = [
    { time: "08:00", label: "Morning run", detail: "3.2 km • 28 min", icon: Activity, color: "#22C55E" },
    { time: "10:30", label: "Heart rate spike", detail: "Peak: 142 bpm", icon: Heart, color: "#EF4444" },
    { time: "13:00", label: "Lunch — Low sugar", detail: "Blood glucose stable", icon: Droplets, color: "#2563EB" },
    { time: "18:00", label: "Evening walk", detail: "5,240 steps", icon: User, color: "#06B6D4" },
    { time: "22:30", label: "Sleep onset", detail: "Sleep score: 84", icon: Moon, color: "#8B5CF6" },
];

export function HealthTimeline() {
    return (
        <div className="flex flex-col gap-0">
            {events.map((event, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-3 pb-4 last:pb-0"
                >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center gap-0">
                        <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${event.color}15` }}
                        >
                            <event.icon className="w-3.5 h-3.5" style={{ color: event.color }} />
                        </div>
                        {i < events.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-1 min-h-[16px]" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-medium text-muted">{event.time}</span>
                        </div>
                        <p className="text-xs font-semibold text-dark">{event.label}</p>
                        <p className="text-[11px] text-muted mt-0.5">{event.detail}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
