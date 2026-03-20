"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { FadeIn } from "@/components/animations/FadeIn";
import { RiskIndicator } from "@/components/health/RiskIndicator";
import { DEVICES, HEALTH_SCORE } from "@/lib/constants";
import {
    User, Shield, Bell, Settings, Watch, Wifi, WifiOff,
    Activity, Edit2, ChevronRight, Camera, Thermometer
} from "lucide-react";
import { motion } from "framer-motion";

const medicalHistory = [
    { year: "2024", event: "Annual Cardiac Screen", result: "Normal", color: "#22C55E" },
    { year: "2023", event: "Blood Panel", result: "Cholesterol borderline", color: "#F59E0B" },
    { year: "2022", event: "Physical Exam", result: "Excellent", color: "#22C55E" },
    { year: "2021", event: "ECG", result: "Normal sinus rhythm", color: "#22C55E" },
];

const settingsItems = [
    { icon: Bell, label: "Notifications", desc: "Alerts for out-of-range metrics" },
    { icon: Shield, label: "Data Privacy", desc: "Manage your health data sharing" },
    { icon: Settings, label: "Device Settings", desc: "Configure connected devices" },
    { icon: User, label: "Account Details", desc: "Name, email, and credentials" },
];

const deviceIcons: Record<string, any> = {
    Smartwatch: Watch,
    "Smart Ring": Activity,
    "Sleep Monitor": Thermometer,
};

export default function ProfilePage() {
    return (
        <PageWrapper>
            <div className="space-y-6">
                <FadeIn>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-dark">Profile</h2>
                            <p className="text-xs text-muted mt-0.5">Manage your health profile and settings</p>
                        </div>
                        <Button variant="outline" size="sm" icon={<Edit2 className="w-3.5 h-3.5" />}>
                            Edit Profile
                        </Button>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Profile card */}
                    <FadeIn delay={0.05}>
                        <Card className="flex flex-col items-center text-center gap-4">
                            <div className="relative mt-2">
                                <Avatar name="Dr. Sarah Chen" size="lg" />
                                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                    <Camera className="w-3 h-3 text-white" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-dark">Dr. Sarah Chen</h3>
                                <p className="text-xs text-muted mt-0.5">Cardiologist · Boston Medical</p>
                                <Badge label="Premium Member" color="blue" className="mt-2" />
                            </div>
                            <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-border">
                                {[
                                    { label: "Health Score", value: `${HEALTH_SCORE}` },
                                    { label: "Days Tracked", value: "284" },
                                    { label: "Devices", value: "2" },
                                ].map((s) => (
                                    <div key={s.label} className="text-center">
                                        <p className="text-sm font-bold text-dark">{s.value}</p>
                                        <p className="text-[10px] text-muted">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full space-y-2">
                                <p className="text-xs font-semibold text-dark text-left">Health Risks</p>
                                <RiskIndicator label="Cardiovascular" value={18} />
                                <RiskIndicator label="Metabolic" value={24} />
                                <RiskIndicator label="Stress" value={32} />
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Medical history */}
                    <FadeIn delay={0.08}>
                        <Card>
                            <h3 className="text-sm font-bold text-dark mb-4">Medical History</h3>
                            <div className="space-y-4">
                                {medicalHistory.map((h, i) => (
                                    <motion.div
                                        key={h.year + h.event}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                                            style={{ backgroundColor: `${h.color}15`, color: h.color }}
                                        >
                                            {h.year.slice(2)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-dark">{h.event}</p>
                                            <p className="text-[10px] text-muted">{h.year} · {h.result}</p>
                                        </div>
                                        <span
                                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                                            style={{ color: h.color, backgroundColor: `${h.color}15` }}
                                        >
                                            {h.result.split(" ")[0]}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Devices & Settings */}
                    <div className="space-y-4">
                        <FadeIn delay={0.1}>
                            <Card>
                                <h3 className="text-sm font-bold text-dark mb-4">Connected Devices</h3>
                                <div className="space-y-2.5">
                                    {DEVICES.map((d, i) => {
                                        const Icon = deviceIcons[d.name] ?? Watch;
                                        return (
                                            <div key={d.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
                                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${d.connected ? "bg-green-50" : "bg-slate-100"}`}>
                                                    <Icon className={`w-3.5 h-3.5 ${d.connected ? "text-green-600" : "text-muted"}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-dark">{d.name}</p>
                                                    <p className="text-[10px] text-muted">{d.model}</p>
                                                </div>
                                                {d.connected ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[9px] text-muted">{d.battery}%</span>
                                                        <Wifi className="w-3.5 h-3.5 text-green-500" />
                                                    </div>
                                                ) : (
                                                    <WifiOff className="w-3.5 h-3.5 text-muted" />
                                                )}
                                            </div>
                                        );
                                    })}
                                    <Button variant="outline" size="sm" className="w-full justify-center mt-1">
                                        + Add Device
                                    </Button>
                                </div>
                            </Card>
                        </FadeIn>

                        <FadeIn delay={0.12}>
                            <Card>
                                <h3 className="text-sm font-bold text-dark mb-4">Settings</h3>
                                <div className="space-y-1">
                                    {settingsItems.map((s, i) => (
                                        <motion.button
                                            key={s.label}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                                            whileHover={{ x: 2 }}
                                        >
                                            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <s.icon className="w-3.5 h-3.5 text-muted" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-dark">{s.label}</p>
                                                <p className="text-[10px] text-muted hidden sm:block">{s.desc}</p>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                                        </motion.button>
                                    ))}
                                </div>
                            </Card>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
