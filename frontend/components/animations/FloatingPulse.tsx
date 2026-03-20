"use client";
import { motion } from "framer-motion";

interface FloatingPulseProps {
    size?: number;
    color?: string;
    className?: string;
}

export function FloatingPulse({
    size = 48,
    color = "#2563EB",
    className = "",
}: FloatingPulseProps) {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            {/* Outer pulse rings */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: size * 2,
                    height: size * 2,
                    backgroundColor: color,
                    opacity: 0.08,
                }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.08, 0, 0.08] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: size * 1.5,
                    height: size * 1.5,
                    backgroundColor: color,
                    opacity: 0.12,
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0, 0.12] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
            {/* Core dot */}
            <div
                className="relative rounded-full z-10"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    opacity: 0.9,
                }}
            />
        </div>
    );
}
