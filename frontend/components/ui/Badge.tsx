"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeProps {
    label: string;
    color?: "green" | "blue" | "cyan" | "red" | "amber" | "gray";
    size?: "sm" | "md";
    dot?: boolean;
    className?: string;
}

const colorMap = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    red: "bg-red-50 text-red-600 border-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
};

const dotColorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    gray: "bg-slate-400",
};

export function Badge({ label, color = "blue", size = "sm", dot = false, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border font-medium",
                size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
                colorMap[color],
                className
            )}
        >
            {dot && (
                <span className={cn("w-1.5 h-1.5 rounded-full", dotColorMap[color])} />
            )}
            {label}
        </span>
    );
}
