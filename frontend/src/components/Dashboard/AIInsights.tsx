import React, { useState, useEffect } from 'react';
import { useHealthStore } from '../../store/useHealthStore';
import { AlertTriangle, ShieldCheck, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export const AIInsights: React.FC = () => {
  const { healthScore, risks } = useHealthStore();

  const getStatusColor = () => {
    if (healthScore > 80) return "text-neon-green shadow-glow-green";
    if (healthScore > 60) return "text-neon-cyan shadow-[0_0_10px_#06b6d4]";
    return "text-amber-500 shadow-[0_0_10px_#f59e0b]";
  };

  const statusColor = getStatusColor();

  return (
    <div className="glass-panel p-6 h-full flex flex-col border border-white/5 relative overflow-hidden group">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      <div className="absolute top-0 left-[-100%] w-[50%] h-[2px] bg-neon-cyan/80 blur-[2px] animate-[typeTerminal_3s_infinite_linear]" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <TerminalSquare className={statusColor.split(' ')[0]} />
          <h3 className="text-lg font-bold text-white tracking-wide font-mono">D.T. DIAGNOSTIC</h3>
        </div>
        <div className="flex gap-1 text-[8px] text-neon-cyan font-mono animate-pulse">
          <div className="w-2 h-4 bg-neon-cyan/80"></div>
          <div className="w-2 h-4 bg-neon-cyan/60"></div>
          <div className="w-2 h-4 bg-neon-cyan/40"></div>
          <div className="w-2 h-4 bg-neon-cyan/20"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        
        <section>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-mono flex-1">System Load</h4>
            <span className="text-[8px] font-mono text-white/40">RUNNING...</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-lg border border-white/10 font-mono relative">
            <span className={`w-1.5 h-1.5 inline-block rounded-full ${statusColor.split(' ')[0]} mr-2 animate-pulse`} />
            <TypewriterText 
              text={`Twin operating at ${healthScore}% integrity. ${healthScore < 70 ? 'Significant stress loads detected. Vital signs indicate non-optimal organ functioning requiring intervention.' : 'System is stable. Vitals are within acceptable parameters with no immediate structural distress.'}`} 
            />
          </p>
        </section>

        <section>
          <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-mono flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <TypewriterText text="Risk Vectors" delay={500} />
          </h4>
          <ul className="space-y-2 font-mono text-xs">
            {risks.hypertension > 20 && (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="bg-amber-500/10 text-amber-500 px-3 py-2 rounded border border-amber-500/30">
                <span className="animate-[blinkCursor_1s_infinite] border-r-2 border-amber-500 mr-2"></span>
                Elevated Blood Pressure increases vascular load.
              </motion.li>
            )}
            {risks.diabetes > 15 && (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="bg-red-500/10 text-red-400 px-3 py-2 rounded border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="animate-[blinkCursor_1s_infinite] border-r-2 border-red-400 mr-2"></span>
                Glucose saturation posing severe load on Hepatic and Renal systems.
              </motion.li>
            )}
            {risks.hypertension <= 20 && risks.diabetes <= 15 && (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-neon-green/80">
                <span className="text-neon-green mr-2">&gt;</span> All primary markers sub-threshold.
              </motion.li>
            )}
          </ul>
        </section>

        <section>
          <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-mono flex items-center gap-2">
            <ShieldCheck size={14} className="text-neon-green" />
            <TypewriterText text="Suggested Route" delay={1200} />
          </h4>
          <ul className="list-none space-y-2 text-xs text-gray-300 font-mono pl-0">
            {healthScore < 75 && (
              <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="flex gap-2">
                <span className="text-neon-cyan">01 //</span> Decrease stress metrics to offload cardiac pressure.
              </motion.li>
            )}
            {healthScore < 60 && (
              <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }} className="flex gap-2 text-red-300">
                <span className="text-red-500">02 //</span> Initiate rapid medication protocol to stabilize vital parameters.
              </motion.li>
            )}
            {healthScore >= 75 && (
              <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="flex gap-2">
                <span className="text-neon-green">01 //</span> Maintain current physiological homeostasis.
              </motion.li>
            )}
          </ul>
        </section>

      </div>
    </div>
  );
};
