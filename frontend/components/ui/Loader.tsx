"use client";
import { motion } from "framer-motion";

export function Loader({ size = 24, color = "#2563EB" }: { size?: number; color?: string }) {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                className="rounded-full border-2 border-t-transparent"
                style={{
                    width: size,
                    height: size,
                    borderColor: `${color}40`,
                    borderTopColor: color,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative w-16 h-16">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-t-primary border-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">DT</span>
                    </div>
                </div>
                <p className="text-sm text-muted font-medium">Loading DigiTwin…</p>
            </motion.div>
        </div>
    );
}
