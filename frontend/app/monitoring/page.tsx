"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { FloatingPulse } from "@/components/animations/FloatingPulse";
import { VitalChart } from "@/components/health/VitalChart";
import { useHealthData } from "@/hooks/useHealthData";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle, CheckCircle, Clock, Wifi, WifiOff, Watch, Heart,
    Activity, Thermometer, Zap
} from "lucide-react";

const alerts = [
    { id: 1, type: "warning", message: "Resting heart rate elevated: 88 bpm", time: "2 min ago", icon: Heart, color: "#F59E0B" },
    { id: 2, type: "critical", message: "Blood oxygen dipped to 94% during sleep", time: "6 hrs ago", icon: AlertTriangle, color: "#EF4444" },
    { id: 3, type: "info", message: "Irregular heartbeat detected — resolved", time: "Yesterday", icon: Zap, color: "#2563EB" },
];

const devices = [
    { name: "Apple Watch", model: "Series 9", connected: true, battery: 82, icon: Watch },
    { name: "Oura Ring", model: "Gen 3", connected: true, battery: 67, icon: Activity },
    { name: "Sleep Monitor", model: "Withings Mat", connected: false, battery: 0, icon: Thermometer },
];

export default function MonitoringPage() {
    const { metrics } = useHealthData();

    const vitals = [
        { label: "Heart Rate", value: metrics.heartRate.value, unit: "bpm", color: "#EF4444" },
        { label: "Blood Oxygen", value: metrics.bloodOxygen.value, unit: "%", color: "#2563EB" },
        { label: "Stress Level", value: metrics.stressLevel.value, unit: "%", color: "#F59E0B" },
        { label: "Sleep Score", value: metrics.sleepScore.value, unit: "/100", color: "#8B5CF6" },
    ];

    return (
        <PageWrapper>
            <div className="space-y-6">
                <FadeIn>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-dark">Live Monitoring</h2>
                            <p className="text-xs text-muted mt-0.5">Real-time health metrics from connected wearables</p>
                        </div>
                        <Badge label="Live Feed" color="green" dot />
                    </div>
                </FadeIn>

                {/* Live vitals */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {vitals.map((v, i) => (
                        <FadeIn key={v.label} delay={i * 0.06}>
                            <Card className="relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                    style={{ backgroundColor: v.color }}
                                />
                                <div className="flex items-center gap-2 mb-3 mt-1">
                                    <FloatingPulse size={8} color={v.color} />
                                    <span className="text-[10px] font-medium text-muted uppercase tracking-wide">{v.label}</span>
                                </div>
                                <motion.p
                                    key={v.value}
                                    initial={{ scale: 0.9, opacity: 0.5 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-2xl font-extrabold text-dark"
                                >
                                    {v.value}
                                </motion.p>
                                <p className="text-xs text-muted">{v.unit}</p>
                            </Card>
                        </FadeIn>
                    ))}
                </div>

                {/* Charts + Alerts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <h3 className="text-sm font-bold text-dark mb-4">Heart Rate — Live</h3>
                        <VitalChart dataKey="heartRate" color="#EF4444" label="Beats per minute" unit="bpm" />
                        <div className="mt-4">
                            <VitalChart dataKey="oxygen" color="#2563EB" label="Blood Oxygen" unit="%" />
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-dark">Health Alerts</h3>
                            <Badge label={`${alerts.length} Active`} color="amber" />
                        </div>
                        <div className="space-y-3">
                            {alerts.map((alert, i) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 p-3 rounded-xl"
                                    style={{ backgroundColor: `${alert.color}0D` }}
                                >
                                    <div
                                        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${alert.color}18` }}
                                    >
                                        <alert.icon className="w-3.5 h-3.5" style={{ color: alert.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-dark leading-snug">{alert.message}</p>
                                        <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            {alert.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Devices */}
                <Card>
                    <h3 className="text-sm font-bold text-dark mb-4">Connected Devices</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {devices.map((d, i) => (
                            <motion.div
                                key={d.name}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${d.connected ? "bg-green-50" : "bg-slate-100"}`}>
                                    <d.icon className={`w-4.5 h-4.5 ${d.connected ? "text-green-600" : "text-muted"} w-5 h-5`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-dark">{d.name}</p>
                                    <p className="text-[10px] text-muted">{d.model}</p>
                                    {d.connected && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[9px] text-green-600 font-medium">Connected</span>
                                            <span className="text-[9px] text-muted">· {d.battery}% battery</span>
                                        </div>
                                    )}
                                </div>
                                {d.connected ? (
                                    <Wifi className="w-4 h-4 text-green-500 flex-shrink-0" />
                                ) : (
                                    <WifiOff className="w-4 h-4 text-muted flex-shrink-0" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>
        </PageWrapper>
    );
}
