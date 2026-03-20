"use client";
import { motion } from "framer-motion";
import { HeartbeatAnimation } from "@/components/health/HeartbeatAnimation";
import { FloatingPulse } from "@/components/animations/FloatingPulse";

export function BodyVisualization() {
    const hotspots = [
        { label: "Heart", x: "48%", y: "38%", color: "#EF4444", value: "72 bpm" },
        { label: "Lungs", x: "35%", y: "42%", color: "#06B6D4", value: "98% O₂" },
        { label: "Brain", x: "48%", y: "14%", color: "#8B5CF6", value: "91/100" },
        { label: "Liver", x: "58%", y: "52%", color: "#F59E0B", value: "79/100" },
    ];

    return (
        <div className="relative flex justify-center items-center min-h-[280px]">
            {/* Body silhouette */}
            <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
            >
                <svg
                    viewBox="0 0 120 280"
                    width={150}
                    height={280}
                    fill="none"
                    className="drop-shadow-lg"
                >
                    {/* Head */}
                    <ellipse cx="60" cy="24" rx="20" ry="22" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Neck */}
                    <rect x="52" y="44" width="16" height="14" rx="4" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Torso */}
                    <rect x="28" y="56" width="64" height="90" rx="12" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Left arm */}
                    <rect x="10" y="58" width="18" height="70" rx="9" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Right arm */}
                    <rect x="92" y="58" width="18" height="70" rx="9" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Left leg */}
                    <rect x="30" y="144" width="24" height="90" rx="12" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Right leg */}
                    <rect x="66" y="144" width="24" height="90" rx="12" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Heart glow */}
                    <circle cx="52" cy="80" r="7" fill="#EF4444" fillOpacity={0.12} stroke="#EF4444" strokeWidth="1" />
                </svg>
            </motion.div>

            {/* Hotspot overlays */}
            {hotspots.map((h, i) => (
                <motion.div
                    key={h.label}
                    className="absolute flex items-center gap-1.5"
                    style={{ left: h.x, top: h.y }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                >
                    <div
                        className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow"
                        style={{ backgroundColor: h.color }}
                    />
                    <div className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-card border border-border/50">
                        <span className="text-[9px] font-semibold" style={{ color: h.color }}>{h.label}</span>
                        <span className="text-[9px] text-muted">{h.value}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
