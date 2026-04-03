import { BodyCanvas } from '../components/Dashboard/BodyCanvas';
import { useHealthStore } from '../store/useHealthStore';
import { motion } from 'framer-motion';

export default function ComparePage() {
  const store = useHealthStore();

  return (
    <div className="w-full flex flex-col gap-6 h-full pb-8">
      <header className="border-b border-panelBorder pb-4 shrink-0">
        <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight">Scenario <span className="font-bold text-neon-cyan">Comparison</span></h1>
        <p className="text-text-muted text-xs md:text-sm mt-1">Side-by-side impact analysis</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
        
        {/* Baseline Scenario */}
        <motion.div 
          className="glass-panel p-6 flex flex-col h-full min-h-[500px]"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-2 mb-4 text-center">Baseline State</h2>
          <div className="flex-1 flex items-center justify-center filter grayscale-[30%] pointer-events-none relative overflow-hidden">
            <BodyCanvas />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 font-mono text-sm uppercase">Current Trajectory</div>
          </div>
        </motion.div>

        {/* Projected Optimized Scenario */}
        <motion.div 
          className="glass-panel p-6 flex flex-col h-full min-h-[500px]"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-bold text-neon-green border-b border-neon-green/30 pb-2 mb-4 text-center">Optimized Projection</h2>
          <div className="flex-1 flex items-center justify-center filter hue-rotate-[-30deg] brightness-125 pointer-events-none relative overflow-hidden">
            <BodyCanvas />
            
            {/* Projected Stats Layout */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur border border-neon-green/30 p-4 rounded-lg">
              <div className="text-xs text-neon-green font-mono mb-2">PROJECTED GAINS</div>
              <div className="text-white text-sm">Health Score: <span className="text-neon-green font-bold">+{Math.round((100 - store.healthScore) * 0.4)}</span></div>
              <div className="text-white text-sm">Heart Risk: <span className="text-neon-cyan font-bold">-{Math.round(store.risks.heartDisease * 0.3)}%</span></div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
