import React from 'react';
import { useHealthStore } from '../../store/useHealthStore';
import { Sparkles, Activity, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  metricKey: any;
  unit: string;
}

const ControlSlider: React.FC<ControlProps> = ({ label, value, min, max, metricKey, unit }) => {
  const updateMetric = useHealthStore((state) => state.updateMetric);

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-medium text-text-muted group-hover:text-neon-cyan transition-colors">{label}</label>
        <div className="text-right">
          <span className="text-lg font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{value}</span>
          <span className="text-xs text-text-muted ml-1">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => updateMetric(metricKey, parseFloat(e.target.value))}
        className="w-full h-1 bg-panelBorder rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-neon-cyan/50
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-neon-cyan [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_#06b6d4] transition-all"
      />
    </div>
  );
};

export const ControlPanel: React.FC = () => {
  const { weight, activityLevel, sleepHours, systolicBP, glucose, isSimulatingImproved, toggleSimulation, xrayMode, toggleXrayMode } = useHealthStore();

  return (
    <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-neon-cyan/10 blur-[60px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-neon-cyan/20" />
      
      <div className="flex flex-col gap-4 mb-8 relative z-10">
        <h2 className="text-lg font-bold text-white border-b border-neon-cyan/30 pb-2 flex justify-between items-center">
          SYSTEM OVERRIDE
          <span className="text-[10px] tracking-widest text-neon-cyan uppercase font-mono px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20 animate-pulse">Live</span>
        </h2>
        
        <div className="flex gap-2">
          {/* What-If Simulation Toggle */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSimulation}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-widest font-mono uppercase flex justify-center items-center gap-2 border transition-all duration-300 relative overflow-hidden ${
              isSimulatingImproved 
                ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-glow-green' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
            }`}
          >
            {isSimulatingImproved && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[typeTerminal_2s_infinite]" />}
            {isSimulatingImproved ? <Sparkles size={14} className="animate-spin-slow" /> : <Activity size={14} />}
            {isSimulatingImproved ? 'Optimum' : 'What-If'}
          </motion.button>

          {/* X-Ray Scanner Toggle */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleXrayMode}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-widest font-mono uppercase flex justify-center items-center gap-2 border transition-all duration-300 relative overflow-hidden ${
              xrayMode 
                ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_#06b6d4]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
             <ScanLine size={14} className={xrayMode ? 'animate-pulse' : ''} />
             X-RAY
          </motion.button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-2 relative z-10 transition-all duration-500 ${isSimulatingImproved ? 'opacity-40 pointer-events-none grayscale blur-sm' : 'opacity-100'}`}>
        
        {isSimulatingImproved && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-black/80 backdrop-blur-md border border-neon-green/50 text-neon-green font-mono uppercase tracking-widest text-[10px] p-4 rounded-xl flex items-center gap-2 shadow-glow-green">
               <Sparkles size={14} className="animate-pulse" /> Auto-Optimizing
            </div>
          </div>
        )}

        <ControlSlider label="Weight" value={weight} min={40} max={150} metricKey="weight" unit="kg" />
        <ControlSlider label="Activity Level" value={activityLevel} min={1} max={10} metricKey="activityLevel" unit="/ 10" />
        <ControlSlider label="Sleep" value={sleepHours} min={2} max={12} metricKey="sleepHours" unit="hrs" />
        <ControlSlider label="Blood Pressure" value={systolicBP} min={90} max={200} metricKey="systolicBP" unit="mmHg" />
        <ControlSlider label="Glucose Level" value={glucose} min={60} max={250} metricKey="glucose" unit="mg/dL" />
      </div>
    </div>
  );
};
