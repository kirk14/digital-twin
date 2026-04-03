import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../store/useHealthStore';
import { BodyCanvas } from '../components/Dashboard/BodyCanvas';
import { Pill, Activity, Syringe, ChevronRight } from 'lucide-react';

export default function MedicationPage() {
  const [drug, setDrug] = useState('');
  const [dosage, setDosage] = useState('');
  
  const runMedicationSimulation = useHealthStore(state => state.runMedicationSimulation);
  const medSim = useHealthStore(state => state.medSim);
  const healthScore = useHealthStore(state => state.healthScore);

  const handleSimulate = () => {
    if (drug && dosage && !medSim.isRunning) runMedicationSimulation(drug, dosage);
  };

  // Convert string Stage to readable format
  const formatStage = (stage: string) => {
    switch (stage) {
      case 'idle': return 'Awaiting Simulation';
      case 'ingestion': return 'Ingestion Phase (Oral)';
      case 'absorption': return 'Hepatic Absorption';
      case 'peak': return 'Peak Systemic Effect';
      case 'recovery': return 'Metabolic Recovery';
      default: return stage;
    }
  };

  // Map progress to Pill Y-axis position mathematically down the torso
  // (-150 is mouth, 50 is stomach). Fades away at 30+
  const pillY = -150 + medSim.progress * 2;
  const pillOpacity = medSim.progress < 5 ? 0 : (medSim.progress > 25 ? 0 : 1);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      <header className="border-b border-panelBorder pb-4 shrink-0">
        <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight">Pharmacokinetic <span className="font-bold text-neon-cyan">Simulation</span></h1>
        <p className="text-text-muted text-xs md:text-sm mt-1">Live timeline mapping of pharmaceutical compounds</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        {/* Controls */}
        <motion.div 
          className="lg:col-span-4 xl:col-span-3 glass-panel p-6 flex flex-col z-10"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-mono uppercase tracking-widest text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
            <Syringe className="text-neon-cyan" /> Med Sim
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2 block">Compound</label>
              <input 
                type="text" 
                placeholder="e.g. Lisinopril"
                value={drug}
                onChange={e => setDrug(e.target.value)}
                disabled={medSim.isRunning}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all placeholder:text-text-muted/50 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2 block">Dosage (mg)</label>
              <input 
                type="text" 
                placeholder="e.g. 20mg"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                disabled={medSim.isRunning}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all placeholder:text-text-muted/50 disabled:opacity-50"
              />
            </div>
            
            <button
              disabled={medSim.isRunning || !drug || !dosage}
              onClick={handleSimulate}
              className={`w-full mt-4 font-bold tracking-widest uppercase p-3 rounded-lg flex justify-center items-center gap-2 transition-all ${
                medSim.isRunning 
                  ? 'bg-white/10 text-text-muted cursor-not-allowed' 
                  : 'bg-neon-cyan text-background hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
              }`}
            >
              <Activity size={18} /> {medSim.isRunning ? 'Running...' : 'Inject'}
            </button>
          </div>

          <AnimatePresence>
            {(medSim.isRunning || medSim.finalScore !== null) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
              >
                <h3 className="text-[10px] uppercase font-mono text-neon-cyan tracking-widest mb-4">Outcome Metric</h3>
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-1 font-mono uppercase">Initial</p>
                    <p className="text-2xl font-bold text-gray-300">{medSim.initialScore}</p>
                  </div>
                  <ChevronRight size={20} className="text-white/20" />
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted mb-1 font-mono uppercase">{medSim.isRunning ? 'Active' : 'Final'}</p>
                    <p className={`text-2xl font-bold shadow-glow-green drop-shadow-[0_0_5px_currentColor] ${healthScore > medSim.initialScore ? 'text-neon-green' : 'text-neon-cyan'}`}>
                      {medSim.isRunning ? healthScore : medSim.finalScore}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Visualizer & Timeline Tracker */}
        <motion.div 
          className="lg:col-span-8 xl:col-span-9 glass-panel flex flex-col justify-center items-center relative border-neon-cyan/20 min-h-[500px]"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          {/* SIMULATION ACTIVE HUD */}
          <AnimatePresence>
            {medSim.isRunning && (
               <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-6 w-3/4 z-30 flex flex-col gap-2"
               >
                 <div className="flex justify-between text-xs font-mono uppercase tracking-widest px-2">
                   <span className="text-neon-cyan animate-pulse">{formatStage(medSim.stage)}</span>
                   <span className="text-white">{medSim.progress}%</span>
                 </div>
                 <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                   <div 
                    className="h-full bg-neon-cyan shadow-[0_0_10px_#06b6d4] transition-all duration-100" 
                    style={{ width: `${medSim.progress}%` }} 
                   />
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* PHYSICAL PILL DROP ANIMATION */}
          <motion.div
            animate={{ 
              y: pillY, 
              opacity: pillOpacity,
              scale: medSim.progress > 15 ? 0.5 : 1
            }}
            transition={{ type: 'tween', duration: 0.1 }}
            className="absolute z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_#fff]">
              <Pill size={16} className="text-neon-cyan" />
            </div>
            <div className="mt-2 text-white font-mono text-[8px] tracking-widest font-bold px-2 rounded-full border border-white/20 whitespace-nowrap">
              {medSim.drug} {medSim.dosage}
            </div>
          </motion.div>

          {medSim.isRunning && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neon-cyan/5 pointer-events-none rounded-xl mix-blend-screen"
            />
          )}
          
          <BodyCanvas />
        </motion.div>
      </div>
    </div>
  );
}
