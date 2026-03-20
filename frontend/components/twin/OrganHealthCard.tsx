"use client";
import { motion } from "framer-motion";
import { Heart, Wind, Droplets, Filter, Zap, Bone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORGANS } from "@/lib/constants";
import { getHealthStatus } from "@/lib/utils";

const iconMap: Record<string, any> = {
    Heart, Wind, Brain: Zap, Droplets, Filter, Bone,
};

export function OrganHealthCard({ organ }: { organ: typeof ORGANS[0] }) {
    const status = getHealthStatus(organ.score);
    const Icon = iconMap[organ.icon] ?? Heart;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px 0 rgba(0,0,0,0.09)" }}
            className="health-card p-4 flex flex-col gap-3"
        >
            <div className="flex items-center justify-between">
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${organ.color}18` }}
                >
                    <Icon className="w-4 h-4" style={{ color: organ.color }} />
                </div>
                <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ color: status.color, backgroundColor: status.bg }}
                >
                    {status.label}
                </span>
            </div>
            <div>
                <p className="text-xs font-semibold text-dark">{organ.name}</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: organ.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${organ.score}%` }}
                            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                        />
                    </div>
                    <span className="text-xs font-bold text-dark">{organ.score}</span>
                </div>
            </div>
        </motion.div>
    );
}
