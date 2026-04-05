import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { TrendingDown } from 'lucide-react';

export const RiskPanel: React.FC = () => {
  const score = useHealthStore((s) => s.healthScore);
  const risks = useHealthStore((s) => s.risks);
  const isSimulatingImproved = useHealthStore((s) => s.isSimulatingImproved);

  // Compute the simulated (improved) risks for delta display
  const improvedRisks = {
    diabetes: Math.max(2, Math.round(risks.diabetes * 0.65)),
    heartDisease: Math.max(1, Math.round(risks.heartDisease * 0.6)),
    hypertension: Math.max(5, Math.round(risks.hypertension * 0.55)),
  };

  const improvedScore = Math.min(100, score + Math.round((100 - score) * 0.4));

  const riskData = [
    { label: 'Diabetes', key: 'diabetes' as const, color: 'bg-neon-cyan', glow: 'shadow-glow-cyan', value: risks.diabetes, improved: improvedRisks.diabetes },
    { label: 'Heart Disease', key: 'heartDisease' as const, color: 'bg-red-500', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.6)]', value: risks.heartDisease, improved: improvedRisks.heartDisease },
    { label: 'Hypertension', key: 'hypertension' as const, color: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.6)]', value: risks.hypertension, improved: improvedRisks.hypertension },
  ];

  const displayScore = isSimulatingImproved ? improvedScore : score;

  const getColor = (s: number) =>
    s >= 80 ? 'text-neon-green shadow-glow-green border-neon-green/30'
    : s >= 60 ? 'text-neon-cyan shadow-glow-cyan border-neon-cyan/30'
    : s >= 40 ? 'text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-500/30'
    : 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/30';

  const ringColor = (s: number) =>
    s >= 80 ? '#22c55e' : s >= 60 ? '#06b6d4' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass-panel p-6 h-full flex flex-col gap-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">

      {/* Health Score */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-[220px]">
        <div className="text-xs tracking-widest text-text-muted uppercase font-mono w-full text-left mb-2">
          System Integrity
          {isSimulatingImproved && (
            <span className="ml-2 text-neon-green text-[9px] animate-pulse">▲ OPTIMIZED</span>
          )}
        </div>

        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {/* Baseline ring (dimmed when simulating) */}
            {isSimulatingImproved && (
              <motion.circle
                cx="50" cy="50" r="45" fill="none"
                stroke={ringColor(score)}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 283' }}
                animate={{ strokeDasharray: `${(score / 100) * 283} 283` }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{ opacity: 0.3 }}
              />
            )}
            {/* Primary ring */}
            <motion.circle
              cx="50" cy="50" r="45" fill="none"
              stroke={ringColor(displayScore)}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 283' }}
              animate={{ strokeDasharray: `${(displayScore / 100) * 283} 283` }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${ringColor(displayScore)})` }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={displayScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-4xl font-black ${getColor(displayScore).split(' ')[0]} drop-shadow-[0_0_10px_currentColor]`}
              >
                {displayScore}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] text-text-muted mt-1">% OPTIMAL</span>
            {isSimulatingImproved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] text-neon-green font-mono mt-1"
              >
                +{improvedScore - score} pts
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-panelBorder" />

      {/* Risk Bars */}
      <div className="flex-1">
        <h3 className="text-xs tracking-widest text-text-muted uppercase font-mono mb-4">Risk Probability</h3>
        <div className="space-y-4">
          {riskData.map((risk) => {
            const displayVal = isSimulatingImproved ? risk.improved : risk.value;
            const delta = risk.value - risk.improved;
            return (
              <div key={risk.label}>
                <div className="flex justify-between text-xs mb-1.5 font-medium items-center">
                  <span className="text-gray-300">{risk.label}</span>
                  <div className="flex items-center gap-2">
                    {isSimulatingImproved && (
                      <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-neon-green text-[10px] flex items-center gap-0.5"
                      >
                        <TrendingDown size={10} />-{delta}%
                      </motion.span>
                    )}
                    <span className="text-white">{displayVal}%</span>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5 relative">
                  {/* Baseline bar (ghost when simulating) */}
                  {isSimulatingImproved && (
                    <div
                      className={`absolute h-full ${risk.color} opacity-20`}
                      style={{ width: `${risk.value}%` }}
                    />
                  )}
                  <motion.div
                    className={`h-full ${risk.color} ${risk.glow}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${displayVal}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
