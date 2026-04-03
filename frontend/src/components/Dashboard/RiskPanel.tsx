import React from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';

export const RiskPanel: React.FC = () => {
  const score = useHealthStore((state) => state.healthScore);
  const risks = useHealthStore((state) => state.risks);

  const riskData = [
    { label: 'Diabetes', value: risks.diabetes, color: 'bg-neon-cyan', glow: 'shadow-glow-cyan' },
    { label: 'Heart Disease', value: risks.heartDisease, color: 'bg-red-500', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.6)]' },
    { label: 'Hypertension', value: risks.hypertension, color: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.6)]' },
  ];

  const getColor = () => {
    if (score >= 80) return 'text-neon-green shadow-glow-green border-neon-green/30';
    if (score >= 60) return 'text-neon-cyan shadow-glow-cyan border-neon-cyan/30';
    if (score >= 40) return 'text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-500/30';
    return 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/30';
  };

  const ringColor = () => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#06b6d4';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col gap-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      
      {/* Health Score Section */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-[220px]">
        <div className="text-xs tracking-widest text-text-muted uppercase font-mono w-full text-left mb-2">System Integrity</div>
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke={ringColor()} 
              strokeWidth="8" 
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 283' }}
              animate={{ strokeDasharray: `${(score / 100) * 283} 283` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ filter: `drop-shadow(0 0 8px ${ringColor()})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-black ${getColor().split(' ')[0]} drop-shadow-[0_0_10px_currentColor]`}
            >
              {score}
            </motion.span>
            <span className="text-[10px] text-text-muted mt-1">% OPTIMAL</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-panelBorder"></div>

      {/* Risk Probability Section */}
      <div className="flex-1">
        <h3 className="text-xs tracking-widest text-text-muted uppercase font-mono mb-4">Risk Probability</h3>
        <div className="space-y-4">
          {riskData.map((risk) => (
            <div key={risk.label}>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-gray-300">{risk.label}</span>
                <span className="text-white">{risk.value}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                <motion.div 
                  className={`h-full ${risk.color} ${risk.glow}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
