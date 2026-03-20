"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { LifestyleControls } from "@/components/simulation/LifestyleControls";
import { SimulationGraph } from "@/components/simulation/SimulationGraph";
import { useSimulation } from "@/hooks/useSimulation";
import { TrendingDown, TrendingUp, Heart, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

function ResultBadge({ icon: Icon, label, value, delta, positive }: {
    icon: any; label: string; value: string; delta: string; positive: boolean;
}) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${positive ? "bg-green-50" : "bg-red-50"}`}>
                <Icon className={`w-4 h-4 ${positive ? "text-green-500" : "text-red-500"}`} />
            </div>
            <div>
                <p className="text-xs font-semibold text-dark">{label}</p>
                <p className="text-[10px] text-muted">{value}</p>
            </div>
            <div className={`ml-auto text-xs font-bold ${positive ? "text-green-600" : "text-red-600"}`}>
                {delta}
            </div>
        </div>
    );
}

export default function SimulationPage() {
    const { result } = useSimulation();

    return (
        <PageWrapper>
            <div className="space-y-6">
                <FadeIn>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-dark">Treatment Simulation</h2>
                            <p className="text-xs text-muted mt-0.5">Predict health outcomes with AI-driven scenario modeling</p>
                        </div>
                        <Badge label="AI Powered" color="blue" dot />
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Controls */}
                    <Card>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FlaskConical className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-dark">Scenario Controls</h3>
                                <p className="text-[10px] text-muted">Adjust parameters</p>
                            </div>
                        </div>
                        <LifestyleControls />
                    </Card>

                    {/* Chart */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-dark">12-Month Projection</h3>
                                {result && <Badge label="Updated" color="green" dot size="sm" />}
                            </div>
                            <SimulationGraph />
                        </Card>

                        {/* Results summary */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <Card padding="sm">
                                    <h4 className="text-xs font-bold text-dark mb-3">Simulation Results</h4>
                                    <div className="space-y-2">
                                        <ResultBadge
                                            icon={TrendingDown}
                                            label="Heart Disease Risk"
                                            value={`${result.heartDiseaseRisk}% risk level`}
                                            delta={`↓ ${result.riskReduction}%`}
                                            positive={false}
                                        />
                                        <ResultBadge
                                            icon={TrendingUp}
                                            label="Recovery Rate"
                                            value={`${result.recoveryRate}% probability`}
                                            delta={`↑ ${result.recoveryRate - 60}%`}
                                            positive={true}
                                        />
                                        <ResultBadge
                                            icon={Heart}
                                            label="Cardiovascular Health"
                                            value="Improved with current plan"
                                            delta="↑ Good"
                                            positive={true}
                                        />
                                    </div>
                                </Card>
                                <Card padding="sm">
                                    <h4 className="text-xs font-bold text-dark mb-3">Recommendations</h4>
                                    <ul className="space-y-2">
                                        {[
                                            "Maintain 45+ min exercise 5×/week",
                                            "Reduce refined sugar intake",
                                            "Take medication consistently",
                                            "Target 7–9 hrs sleep nightly",
                                        ].map((r) => (
                                            <li key={r} className="flex items-start gap-2 text-xs text-dark">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
