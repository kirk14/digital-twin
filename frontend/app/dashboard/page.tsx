"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HealthMetricCard } from "@/components/health/HealthMetricCard";
import { VitalChart } from "@/components/health/VitalChart";
import { RiskIndicator } from "@/components/health/RiskIndicator";
import { HealthTimeline } from "@/components/health/HealthTimeline";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { useHealthData } from "@/hooks/useHealthData";
import { HEALTH_SCORE } from "@/lib/constants";
import { Heart, Droplets, Activity, Moon, Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { EKGLine } from "@/components/health/HeartbeatAnimation";

const riskFactors = [
    { label: "Cardiovascular Risk", value: 18 },
    { label: "Diabetes Risk", value: 24 },
    { label: "Hypertension Risk", value: 31 },
    { label: "Stress Load", value: 32 },
];

export default function DashboardPage() {
    const { metrics } = useHealthData();

    const metricCards = [
        {
            label: "Heart Rate",
            value: metrics.heartRate.value,
            unit: "bpm",
            icon: <Heart className="w-5 h-5 text-red-500" />,
            iconBg: "#FEF2F2",
            trend: "stable" as const,
            trendValue: "Normal",
            status: "normal" as const,
        },
        {
            label: "Blood Oxygen",
            value: `${metrics.bloodOxygen.value}`,
            unit: "%",
            icon: <Droplets className="w-5 h-5 text-blue-500" />,
            iconBg: "#EFF6FF",
            trend: "up" as const,
            trendValue: "+1%",
            status: "normal" as const,
        },
        {
            label: "Blood Pressure",
            value: metrics.bloodPressure.value,
            unit: "mmHg",
            icon: <Activity className="w-5 h-5 text-cyan-500" />,
            iconBg: "#ECFEFF",
            trend: "stable" as const,
            trendValue: "Optimal",
            status: "normal" as const,
        },
        {
            label: "Sleep Score",
            value: metrics.sleepScore.value,
            unit: "/100",
            icon: <Moon className="w-5 h-5 text-purple-500" />,
            iconBg: "#F5F3FF",
            trend: "up" as const,
            trendValue: "+3pts",
            status: "normal" as const,
        },
        {
            label: "Stress Level",
            value: `${metrics.stressLevel.value}`,
            unit: "%",
            icon: <Brain className="w-5 h-5 text-amber-500" />,
            iconBg: "#FFFBEB",
            trend: "down" as const,
            trendValue: "-8%",
            status: metrics.stressLevel.value > 60 ? "warning" as const : "normal" as const,
        },
    ];

    return (
        <PageWrapper>
            <div className="space-y-6">
                {/* Section header */}
                <FadeIn>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-dark">Health Overview</h2>
                            <p className="text-xs text-muted mt-0.5">Last updated just now · Synced from all devices</p>
                        </div>
                        <Badge label="All Normal" color="green" dot />
                    </div>
                </FadeIn>

                {/* Metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {metricCards.map((m, i) => (
                        <HealthMetricCard key={m.label} {...m} delay={i * 0.05} />
                    ))}
                </div>

                {/* Charts + health score row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Charts */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-dark">Vitals Monitor</h3>
                                <Badge label="Live" color="green" dot size="sm" />
                            </div>
                            <EKGLine color="#2563EB" />
                            <div className="mt-4">
                                <VitalChart dataKey="heartRate" color="#EF4444" label="Heart Rate" unit="bpm" />
                            </div>
                        </Card>
                    </div>

                    {/* Health score */}
                    <Card className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-dark">Health Score</h3>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex flex-col items-center justify-center py-4">
                            <motion.div
                                className="relative w-24 h-24"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                                    <circle cx="48" cy="48" r="40" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                                    <motion.circle
                                        cx="48" cy="48" r="40"
                                        stroke="#22C55E"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - HEALTH_SCORE / 100) }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-extrabold text-dark">{HEALTH_SCORE}</span>
                                    <span className="text-[10px] text-muted">/ 100</span>
                                </div>
                            </motion.div>
                            <p className="text-xs text-green-600 font-semibold mt-3">Excellent Health</p>
                            <p className="text-[10px] text-muted mt-1 text-center">Top 15% for your age group</p>
                        </div>
                        <div className="space-y-3">
                            {riskFactors.map((r) => (
                                <RiskIndicator key={r.label} {...r} />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <h3 className="text-sm font-bold text-dark mb-4">Oxygen & Stress Trends</h3>
                        <VitalChart dataKey="oxygen" color="#06B6D4" label="Blood Oxygen" unit="%" />
                        <div className="mt-4">
                            <VitalChart dataKey="stress" color="#F59E0B" label="Stress Level" unit="%" />
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-sm font-bold text-dark mb-4">Today's Timeline</h3>
                        <HealthTimeline />
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
}
