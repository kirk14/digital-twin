"use client";
import { motion } from "framer-motion";

interface HeartbeatAnimationProps {
    color?: string;
    size?: "sm" | "md" | "lg";
}

const sizes = { sm: 32, md: 48, lg: 64 };

export function HeartbeatAnimation({ color = "#EF4444", size = "md" }: HeartbeatAnimationProps) {
    const s = sizes[size];
    return (
        <motion.svg
            width={s}
            height={s}
            viewBox="0 0 48 48"
            fill="none"
            animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <path
                d="M24 40s-16-10.5-16-20C8 13.1 13.1 8 19 8c2.7 0 5.3 1.1 7 3 1.7-1.9 4.3-3 7-3 5.9 0 11 5.1 11 12 0 9.5-16 20-16 20z"
                fill={color}
                fillOpacity={0.15}
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </motion.svg>
    );
}

export function EKGLine({ color = "#2563EB" }: { color?: string }) {
    return (
        <motion.svg
            viewBox="0 0 200 60"
            className="w-full h-10"
            fill="none"
        >
            <motion.path
                d="M0 30 L40 30 L50 10 L60 50 L70 30 L90 30 L100 5 L110 55 L120 30 L160 30 L170 15 L180 45 L190 30 L200 30"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.svg>
    );
}
