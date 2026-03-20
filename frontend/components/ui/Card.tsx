"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glass?: boolean;
    padding?: "sm" | "md" | "lg";
}

export function Card({ children, className, hover = true, glass = false, padding = "md" }: CardProps) {
    const paddingMap = { sm: "p-4", md: "p-5", lg: "p-6" };
    return (
        <motion.div
            className={cn(
                glass ? "glass-card" : "health-card",
                paddingMap[padding],
                className
            )}
            whileHover={hover ? { y: -2, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)" } : {}}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
