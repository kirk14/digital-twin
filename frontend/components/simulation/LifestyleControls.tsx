"use client";
import { useSimulation } from "@/hooks/useSimulation";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { FlaskConical, Play } from "lucide-react";

const MEDICATIONS = ["None", "Aspirin", "Metformin", "Atorvastatin", "Lisinopril"];

export function LifestyleControls() {
    const { exercise, setExercise, sugar, setSugar, medication, setMedication, loading, runSimulation } = useSimulation();

    return (
        <div className="flex flex-col gap-5">
            {/* Exercise */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-dark">Exercise Level</label>
                    <span className="text-xs font-bold text-primary">{exercise}%</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={exercise}
                    onChange={(e) => setExercise(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                    aria-label="Exercise level"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1">
                    <span>Sedentary</span><span>Active</span>
                </div>
            </div>

            {/* Sugar intake */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-dark">Sugar Intake</label>
                    <span className="text-xs font-bold text-amber-600">{sugar}%</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={sugar}
                    onChange={(e) => setSugar(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-amber-500"
                    aria-label="Sugar intake"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1">
                    <span>Low</span><span>High</span>
                </div>
            </div>

            {/* Medication */}
            <div>
                <label className="text-xs font-semibold text-dark block mb-2">Medication</label>
                <select
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-border rounded-xl px-3 py-2 text-dark outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="Medication selector"
                >
                    {MEDICATIONS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <Button
                variant="primary"
                icon={loading ? <Loader size={14} color="white" /> : <Play className="w-3.5 h-3.5" />}
                onClick={runSimulation}
                loading={loading}
                className="w-full justify-center"
                aria-label="Run simulation"
            >
                {loading ? "Running…" : "Run Simulation"}
            </Button>
        </div>
    );
}
