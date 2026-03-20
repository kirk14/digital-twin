"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HealthGlowProps {
    children: ReactNode;
    color?: "blue" | "green" | "cyan" | "red";
    className?: string;
    animate?: boolean;
}

const colorMap = {
    blue: "glow-blue",
    green: "glow-green",
    cyan: "glow-cyan",
    red: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
};

export function HealthGlow({ children, color = "blue", className, animate = true }: HealthGlowProps) {
    return (
        <motion.div
            className={cn(colorMap[color], "rounded-2xl", className)}
            animate={animate ? {
                boxShadow: [
                    "0 0 10px rgba(37, 99, 235, 0.2)",
                    "0 0 25px rgba(37, 99, 235, 0.4)",
                    "0 0 10px rgba(37, 99, 235, 0.2)",
                ],
            } : {}}
            transition={animate ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
        >
            {children}
        </motion.div>
    );
}
