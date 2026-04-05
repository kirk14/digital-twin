import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { organConfig } from './organConfig';
import { ShieldAlert, Info, ActivitySquare } from 'lucide-react';

export const OrganDetails: React.FC = () => {
  const focusedOrgan = useHealthStore((state) => state.focusedOrgan);
  const organs = useHealthStore((state) => state.organs);

  if (!focusedOrgan) return null;

  const config = organConfig[focusedOrgan];
  const state = organs[focusedOrgan];

  const getRecommendations = () => {
    switch (focusedOrgan) {
      case 'heart':
        return state.status === 'critical' ? 'Immediate reduction in systolic BP required. Administer vasodilators.' : 'Maintain current aerobic loads to sustain cardiac output.';
      case 'lungs':
        return state.status === 'warning' ? 'Cardiovascular exercise deficits detected. Increase activity level.' : 'Optimal oxygen processing. No action needed.';
      case 'brain':
        return state.status === 'critical' ? 'Severe restorative deficit. Induce sleep protocols immediately to avoid neural degradation.' : 'Neural activity balanced. Cortisol levels optimal.';
      case 'liver':
        return state.status === 'critical' ? 'Hepatic overload. Reduce glucose intake and weight to prevent severe steatosis.' : 'Metabolic synthesis is nominal.';
      case 'stomach':
        return state.status === 'critical' ? 'High stress interference with digestive enzymes. Lower stress metrics.' : 'Gastric load is stable.';
      case 'kidneys':
        return state.status === 'critical' ? 'Renal filtration failure imminent due to high BP or glucose. Modulate immediately.' : 'Filtration and renal homeostasis normal.';
      case 'vascular':
        return state.status === 'critical' ? 'Arterial walls under extreme tension. Risk of rupture.' : 'Vascular flow unimpeded.';
      default:
        return 'Monitor telemetry.';
    }
  };

  const getRiskContribution = () => {
    switch (focusedOrgan) {
      case 'heart': return 'Heart Disease: Primary Vector';
      case 'vascular': return 'Hypertension: Direct Indicator';
      case 'liver': return 'Diabetes: Heavy Contributor';
      case 'kidneys': return 'Hypertension: Secondary Contributor';
      case 'brain': return 'Systemic Stress: Primary Vector';
      default: return 'Systemic Risk: Marginal';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute top-4 right-4 w-72 bg-panel/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-panel z-30 flex flex-col gap-4 overflow-hidden"
      >
        <div 
          className="absolute top-0 left-0 w-1 h-full" 
          style={{ backgroundColor: state.color, boxShadow: `0 0 10px ${state.color}` }} 
        />
        
        {/* Header */}
        <div>
          <h3 className="text-neon-cyan font-mono tracking-widest text-xs uppercase mb-1">
            {config.label}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Status:</span>
            <span className="font-bold uppercase tracking-wider text-sm shadow-[0_0_8px_currentColor]" style={{ color: state.color }}>
              {state.status}
            </span>
          </div>
        </div>

        {/* Risk Load */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <h4 className="text-[10px] uppercase text-text-muted font-mono flex items-center gap-1 mb-1">
            <ActivitySquare size={12} /> Risk Contribution
          </h4>
          <p className="text-xs text-gray-300">{getRiskContribution()}</p>
        </div>

        {/* Recommendation */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <h4 className="text-[10px] uppercase text-text-muted font-mono flex items-center gap-1 mb-1">
            <Info size={12} /> Diagnostic Action
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">{getRecommendations()}</p>
        </div>

        {/* Warning Toast */}
        {state.status === 'critical' && (
          <div className="mt-2 text-[10px] text-red-400 flex items-start gap-1 font-mono uppercase bg-red-500/10 p-2 rounded">
            <ShieldAlert size={12} className="shrink-0 mt-0.5" />
            <span>Telemetry exceeding safe operational bounds.</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
