import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../store/useHealthStore';
import { useOrganReactions } from '../hooks/useOrganReactions';

interface MiniBodyProps {
  organs: ReturnType<typeof useOrganReactions>;
}

const MiniOrganPath: React.FC<{
  d: string;
  color: string;
  intensity: 'low' | 'medium' | 'high';
  speed: 'slow' | 'normal' | 'fast';
}> = React.memo(({ d, color, intensity, speed }) => {
  const dur = speed === 'fast' ? '0.8s' : speed === 'slow' ? '2.5s' : '1.5s';
  const glow = intensity === 'high' ? 20 : intensity === 'medium' ? 10 : 5;

  return (
    <motion.path
      d={d}
      fill={color}
      style={{ filter: `drop-shadow(0 0 ${glow}px ${color})` }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: parseFloat(dur), repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

const MiniBody: React.FC<MiniBodyProps> = React.memo(({ organs }) => {
  return (
    <div className="relative flex flex-col items-center">
      <svg width="160" height="280" viewBox="0 0 300 600" preserveAspectRatio="xMidYMid meet" className="overflow-visible">
        <path
          d="M 150 20 C 180 20, 195 45, 195 75 C 195 95, 185 110, 175 115 C 220 120, 240 135, 250 160 C 260 190, 265 240, 260 300 C 255 350, 240 360, 210 365 L 210 580 C 190 585, 175 580, 170 560 L 160 400 L 140 400 L 130 560 C 125 580, 110 585, 90 580 L 90 365 C 60 360, 45 350, 40 300 C 35 240, 40 190, 50 160 C 60 135, 80 120, 125 115 C 115 110, 105 95, 105 75 C 105 45, 120 20, 150 20 Z"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />
        <MiniOrganPath d="" {...organs.brain} />
        <motion.ellipse
          cx={150} cy={70} rx={26} ry={32}
          fill={organs.brain.color}
          style={{ filter: `drop-shadow(0 0 ${organs.brain.intensity === 'high' ? 20 : 10}px ${organs.brain.color})` }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: organs.brain.speed === 'fast' ? 0.8 : 1.5, repeat: Infinity }}
        />
        <MiniOrganPath d="M 152 175 C 160 170, 175 180, 165 200 C 150 215, 145 205, 145 190 C 140 180, 148 175, 152 175 Z" {...organs.heart} />
        <MiniOrganPath d="M 160 145 C 185 140, 205 180, 195 240 C 185 245, 175 220, 160 210 Z" {...organs.lungs} />
        <MiniOrganPath d="M 140 145 C 115 140, 95 180, 105 240 C 115 245, 125 220, 140 210 Z" {...organs.lungs} />
        <MiniOrganPath d="M 100 245 C 145 235, 170 250, 160 270 C 130 290, 105 270, 100 245 Z" {...organs.liver} />
        <MiniOrganPath d="M 155 255 C 180 250, 200 280, 165 295 C 150 280, 155 265, 155 255 Z" {...organs.stomach} />
        <MiniOrganPath d="M 115 285 C 105 290, 110 320, 120 315 C 125 305, 120 295, 115 285 Z" {...organs.kidneys} />
        <MiniOrganPath d="M 185 285 C 195 290, 190 320, 180 315 C 175 305, 180 295, 185 285 Z" {...organs.kidneys} />
      </svg>
    </div>
  );
});

export default function ComparePage() {
  const store = useHealthStore();
  const { weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate, healthScore } = store;

  const optimizedInputs = useMemo(() => ({
    weight: Math.max(65, weight - 5),
    activityLevel: Math.min(10, activityLevel + 4),
    sleepHours: Math.max(8, sleepHours + 1.5),
    systolicBP: Math.max(115, systolicBP - 20),
    diastolicBP: Math.max(75, diastolicBP - 15),
    glucose: Math.max(85, glucose - 20),
    stressLevel: Math.max(2, stressLevel - 4),
    heartRate: Math.max(60, heartRate - 8),
  }), [weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate]);

  const currentOrgans = store.organs;
  const optimizedOrgans = useOrganReactions(optimizedInputs);

  const improvedScore = Math.min(100, healthScore + Math.round((100 - healthScore) * 0.4));
  const improvedDelta = improvedScore - healthScore;

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-4xl font-black text-on-surface font-technical uppercase tracking-tight">Scenario Comparison</h2>
          <p className="text-on-surface-variant text-sm mt-2">Analytical delta between Baseline [ID: 882] and Optimized Protocol [ID: 901]</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container-high border border-outline-variant/30 rounded-lg flex items-center gap-3">
            <span className="text-[10px] font-technical text-slate-500 uppercase tracking-widest">Global Variance</span>
            <span className="text-xl font-bold font-technical text-tertiary">+{improvedDelta}%</span>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-px bg-outline-variant/20 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Baseline State */}
        <section className="bg-surface-container-low p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <span className="px-3 py-1 bg-error/10 border border-error/20 text-error text-[10px] font-bold tracking-[0.2em] font-technical uppercase">Baseline State</span>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-technical">Vitals Index</p>
                <p className="text-3xl font-black text-on-surface font-technical">{healthScore}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative h-[320px] w-full bg-surface-container-highest/50 rounded-lg flex items-center justify-center border border-error/10 shadow-[inner_0_0_40px_rgba(255,113,108,0.05)] pt-6">
                <MiniBody organs={currentOrgans as any} />
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  <span className="w-12 h-[2px] bg-error"></span>
                  <span className="text-[9px] text-error font-bold font-technical uppercase tracking-tighter">Crit Threshold</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-highest/30 border-l-2 border-error/50">
                  <p className="text-[10px] text-slate-500 uppercase font-technical">Systolic BP</p>
                  <p className="text-xl font-bold text-on-surface mt-1">{systolicBP} mmHg</p>
                </div>
                <div className="p-4 bg-surface-container-highest/30 border-l-2 border-error/50">
                  <p className="text-[10px] text-slate-500 uppercase font-technical">Neural Stress</p>
                  <p className="text-xl font-bold text-on-surface mt-1">{stressLevel}/10</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Optimized State */}
        <section className="bg-surface-container-low p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_100%_100%,rgba(142,255,113,0.05)_0%,transparent_50%)]"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <span className="px-3 py-1 bg-tertiary/10 border border-tertiary/20 text-tertiary text-[10px] font-bold tracking-[0.2em] font-technical uppercase">Optimized Protocol</span>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-technical">Vitals Index</p>
                <p className="text-3xl font-black text-on-surface font-technical">{improvedScore}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative h-[320px] w-full bg-surface-container-highest/50 rounded-lg flex items-center justify-center border border-tertiary/10 shadow-[inner_0_0_40px_rgba(142,255,113,0.05)] pt-6">
                 <MiniBody organs={optimizedOrgans} />
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                  <span className="w-12 h-[2px] bg-tertiary"></span>
                  <span className="text-[9px] text-tertiary font-bold font-technical uppercase tracking-tighter">Ideal Zone</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-highest/30 border-l-2 border-tertiary/50">
                  <p className="text-[10px] text-slate-500 uppercase font-technical">Systolic BP</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xl font-bold text-on-surface">{optimizedInputs.systolicBP} mmHg</p>
                    <span className="text-[10px] text-tertiary font-bold tracking-wider">-{(systolicBP - optimizedInputs.systolicBP)}</span>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-highest/30 border-l-2 border-tertiary/50">
                  <p className="text-[10px] text-slate-500 uppercase font-technical">Neural Stress</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xl font-bold text-on-surface">{optimizedInputs.stressLevel}/10</p>
                    <span className="text-[10px] text-tertiary font-bold tracking-wider">-{(stressLevel - optimizedInputs.stressLevel)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Score Delta Card */}
        <div className="absolute top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-surface-bright/80 backdrop-blur-xl border border-primary/20 p-6 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_20px_rgba(0,244,254,0.1)] w-56 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">compare_arrows</span>
              </div>
            </div>
            <p className="text-[10px] font-technical text-slate-400 uppercase tracking-widest mb-1">Total Improvement</p>
            <h3 className="text-4xl font-black text-on-surface font-technical leading-none">+{improvedDelta}<span className="text-lg">%</span></h3>
            <div className="mt-6 pt-6 border-t border-outline-variant/30">
              <p className="text-[9px] text-tertiary font-bold uppercase tracking-tighter">System Efficiency Optimized</p>
            </div>
          </div>
        </div>

      </div>

      {/* Recovery Forecast Panels */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-highest/20 p-6 border-l border-outline-variant/30">
          <h4 className="font-technical font-bold text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">monitoring</span> Recovery Forecast
          </h4>
          <p className="text-on-surface-variant text-sm leading-relaxed font-sans">Optimization protocol reduces time-to-baseline by 14.2 days. Cellular regeneration accelerated by 11%.</p>
        </div>
        <div className="bg-surface-container-highest/20 p-6 border-l border-outline-variant/30">
          <h4 className="font-technical font-bold text-xs uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">shield</span> Organ Integrity
          </h4>
          <p className="text-on-surface-variant text-sm leading-relaxed font-sans">Left-ventricular hypertrophy risk minimized. Systemic inflammation markers dropped to -3.2 SD.</p>
        </div>
        <div className="bg-surface-container-highest/20 p-6 border-l border-outline-variant/30">
          <h4 className="font-technical font-bold text-xs uppercase tracking-widest text-tertiary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">bolt</span> Energy Efficiency
          </h4>
          <p className="text-on-surface-variant text-sm leading-relaxed font-sans">Metabolic demand adjusted. Glucose consumption in brain tissue stabilized for cognitive longevity.</p>
        </div>
      </div>

    </div>
  );
}
