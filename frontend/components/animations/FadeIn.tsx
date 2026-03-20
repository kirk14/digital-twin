"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    blur?: boolean;
    scale?: boolean;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.8,
    direction = "up",
    blur = false,
    scale = false,
    className,
    ...props
}: FadeInProps) {
    const directionMap = {
        up: { y: 20, x: 0 },
        down: { y: -20, x: 0 },
        left: { x: 20, y: 0 },
        right: { x: -20, y: 0 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            initial={{ 
                opacity: 0, 
                ...directionMap[direction],
                filter: blur ? "blur(12px)" : "blur(0px)",
                scale: scale ? 0.95 : 1
            }}
            animate={{ 
                opacity: 1, 
                x: 0, 
                y: 0,
                filter: "blur(0px)",
                scale: 1 
            }}
            transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
