"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { BodyVisualization } from "@/components/twin/BodyVisualization";
import { OrganHealthCard } from "@/components/twin/OrganHealthCard";
import { TwinStatus } from "@/components/twin/TwinStatus";
import { ORGANS } from "@/lib/constants";
import { ScanLine, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TwinPage() {
    return (
        <PageWrapper>
            <div className="space-y-6">
                <FadeIn>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-dark">Digital Twin</h2>
                            <p className="text-xs text-muted mt-0.5">Your real-time biological model — accurate to 96.3%</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
                                Re-sync
                            </Button>
                            <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                                Export Report
                            </Button>
                        </div>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Body visualization */}
                    <Card className="lg:row-span-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <ScanLine className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold text-dark">Body Model</h3>
                            </div>
                            <Badge label="3D Active" color="blue" dot size="sm" />
                        </div>
                        <BodyVisualization />
                        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border">
                            {[
                                { label: "Overall", value: "87", color: "#22C55E" },
                                { label: "Organs", value: "6/6", color: "#2563EB" },
                                { label: "Age Bio", value: "31 yrs", color: "#06B6D4" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                                    <p className="text-[10px] text-muted">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Twin status */}
                    <Card>
                        <h3 className="text-sm font-bold text-dark mb-4">Twin Status</h3>
                        <TwinStatus />
                    </Card>

                    {/* Organ cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {ORGANS.slice(0, 4).map((organ, i) => (
                            <FadeIn key={organ.name} delay={i * 0.06}>
                                <OrganHealthCard organ={organ} />
                            </FadeIn>
                        ))}
                    </div>
                </div>

                {/* Bottom organ grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {ORGANS.map((organ, i) => (
                        <FadeIn key={organ.name} delay={i * 0.04}>
                            <OrganHealthCard organ={organ} />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
