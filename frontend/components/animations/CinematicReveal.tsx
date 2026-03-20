"use client";
import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CinematicRevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    staggerChildren?: number;
}

export function CinematicReveal({ children, delay = 0, className, staggerChildren = 0.1 }: CinematicRevealProps) {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren,
                delayChildren: delay,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30, filter: "blur(8px)", scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
            } as any,
        },
    };

    // Helper to wrap text elements or plain children in the item variant
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={cn("", className)}
        >
            {/* If children is an array or component list, we map them into motion elements if needed, 
                or the developer can just nest motion.div variants=item manually. 
                For simplicity, we wrap the whole children block here or expect the caller to do it. */}
            {Array.isArray(children) ? (
                children.map((child, i) => (
                    <motion.div key={i} variants={item}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={item}>{children}</motion.div>
            )}
        </motion.div>
    );
}

export const CinematicWordReveal = ({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) => {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } as any,
        },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className={cn("inline-flex flex-wrap gap-[0.25em]", className)}>
            {words.map((word, i) => (
                <motion.span key={i} variants={item} className="inline-block">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};
