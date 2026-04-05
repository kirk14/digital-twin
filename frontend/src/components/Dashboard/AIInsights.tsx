import React, { useState, useEffect, useCallback } from 'react';
import { useHealthStore } from '../../store/useHealthStore';
import { analyzeHealth } from '../../services/api';
import { AlertTriangle, ShieldCheck, TerminalSquare, RefreshCw, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIInsight } from '../../types/health';

// ── TypewriterText ─────────────────────────────────────────────────────────

const TypewriterText: React.FC<{ text: string; delay?: number; speed?: number }> = ({
  text,
  delay = 0,
  speed = 15,
}) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < text.length) { setDisplayed((p) => p + text.charAt(i)); i++; }
        else clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay, speed]);

  return <span>{displayed}<span className="animate-[blinkCursor_1s_infinite] border-r border-current ml-0.5 opacity-70" /></span>;
};

// ── Insight item type badge ────────────────────────────────────────────────

const typeStyles = {
  info: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  success: 'bg-neon-green/10 text-neon-green border-neon-green/30',
};

// ── Default mock insight when no API response ──────────────────────────────

function generateDefaultInsight(healthScore: number, risks: { diabetes: number; heartDisease: number; hypertension: number }): AIInsight {
  const warnings = [];
  if (risks.hypertension > 20) warnings.push({ type: 'warning' as const, title: 'Vector 01', text: 'Elevated systolic pressure increasing vascular load.' });
  if (risks.diabetes > 15) warnings.push({ type: 'critical' as const, title: 'Vector 02', text: 'Glucose saturation posing severe load on hepatic and renal systems.' });
  if (risks.heartDisease > 20) warnings.push({ type: 'critical' as const, title: 'Vector 03', text: 'Cardiac risk elevation — reduce stressors and monitor heart rate patterns.' });
  if (warnings.length === 0) warnings.push({ type: 'success' as const, title: 'All Clear', text: 'All primary risk markers are sub-threshold. System is stable.' });

  const recs: string[] = [];
  if (healthScore < 75) recs.push('Decrease stress metrics to offload cardiac pressure.');
  if (healthScore < 60) recs.push('Initiate rapid medication protocol to stabilize vital parameters.');
  if (healthScore >= 75) recs.push('Maintain current physiological homeostasis.');
  recs.push('Increase daily hydration and reduce processed sodium intake.');

  return {
    summary: `Twin operating at ${healthScore}% integrity. ${healthScore < 70 ? 'Significant stress loads detected. Vital signs indicate non-optimal organ functioning.' : 'System is stable within acceptable parameters with no immediate structural distress.'}`,
    risk_vectors: warnings,
    recommendations: recs,
    forecast: healthScore >= 85
      ? 'Projected health trajectory is positive over the next 90 days.'
      : `Implementing recommendations could improve health score by ${Math.round((100 - healthScore) * 0.35)} points over 90 days.`,
  };
}

// ── Main Component ─────────────────────────────────────────────────────────

export const AIInsights: React.FC = () => {
  const healthScore = useHealthStore((s) => s.healthScore);
  const risks = useHealthStore((s) => s.risks);
  const apiResponse = useHealthStore((s) => s.apiResponse);
  const isAnalyzing = useHealthStore((s) => s.isAnalyzing);
  const setApiResponse = useHealthStore((s) => s.setApiResponse);
  const setIsAnalyzing = useHealthStore((s) => s.setIsAnalyzing);

  const weight = useHealthStore((s) => s.weight);
  const activityLevel = useHealthStore((s) => s.activityLevel);
  const sleepHours = useHealthStore((s) => s.sleepHours);
  const systolicBP = useHealthStore((s) => s.systolicBP);
  const diastolicBP = useHealthStore((s) => s.diastolicBP);
  const glucose = useHealthStore((s) => s.glucose);
  const stressLevel = useHealthStore((s) => s.stressLevel);
  const heartRate = useHealthStore((s) => s.heartRate);

  const insight: AIInsight = apiResponse?.ai_insight ?? generateDefaultInsight(healthScore, risks);

  const scoreColor = healthScore > 80 ? 'text-neon-green' : healthScore > 60 ? 'text-neon-cyan' : 'text-amber-500';

  const runAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeHealth({ weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate });
      setApiResponse(result);
    } catch (e) {
      console.error('[AIInsights] analyzeHealth failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate, setApiResponse, setIsAnalyzing]);

  return (
    <div className="glass-panel p-6 h-full flex flex-col border border-white/5 relative overflow-hidden group">

      {/* Top scan line */}
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      <div className="absolute top-0 left-[-100%] w-[50%] h-[2px] bg-neon-cyan/80 blur-[2px] animate-[typeTerminal_3s_infinite_linear]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <TerminalSquare className={scoreColor} />
          <h3 className="text-lg font-bold text-white tracking-wide font-mono">D.T. DIAGNOSTIC</h3>
          {apiResponse && (
            <span className="text-[9px] font-mono text-neon-cyan/60 border border-neon-cyan/20 px-2 py-0.5 rounded bg-neon-cyan/5">
              API ✓
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 text-[8px] text-neon-cyan font-mono animate-pulse">
            {[80, 60, 40, 20].map((h, i) => <div key={i} className="w-2 bg-neon-cyan/80 rounded-sm" style={{ height: h + '%', minHeight: 4 }} />)}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 hover:border-neon-cyan/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAnalyzing
              ? <><Loader2 size={12} className="animate-spin" /> Analyzing</>
              : <><RefreshCw size={12} /> Run Analysis</>
            }
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-hide">

        {/* System Load */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-mono flex-1">System Load</h4>
            <span className="text-[8px] font-mono text-white/30">{isAnalyzing ? 'SCANNING...' : 'LIVE'}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-lg border border-white/10 font-mono relative">
            <span className={`w-1.5 h-1.5 inline-block rounded-full ${scoreColor} mr-2 animate-pulse`} />
            <TypewriterText key={insight.summary} text={insight.summary} />
          </p>
        </section>

        {/* Risk Vectors */}
        <section>
          <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-3 font-mono flex items-center gap-2">
            <AlertTriangle size={12} className="text-amber-500" />
            <TypewriterText text="Risk Vectors" delay={400} />
          </h4>
          <ul className="space-y-2 font-mono text-xs">
            <AnimatePresence mode="popLayout">
              {insight.risk_vectors.map((rv, i) => (
                <motion.li
                  key={rv.title + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className={`px-3 py-2 rounded border ${typeStyles[rv.type]}`}
                >
                  <span className="font-bold mr-2">{rv.title}</span>
                  {rv.text}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>

        {/* Recommendations */}
        <section>
          <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-3 font-mono flex items-center gap-2">
            <ShieldCheck size={12} className="text-neon-green" />
            <TypewriterText text="Suggested Route" delay={1000} />
          </h4>
          <ul className="space-y-2 font-mono text-xs">
            {insight.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.12 }}
                className="flex gap-2 text-gray-300"
              >
                <span className="text-neon-cyan shrink-0">{String(i + 1).padStart(2, '0')} //</span>
                {rec}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Forecast */}
        <section>
          <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-mono flex items-center gap-2">
            <TrendingUp size={12} className="text-neon-cyan" />
            Projected Forecast
          </h4>
          <p className="text-xs text-gray-400 font-mono bg-black/30 p-3 rounded border border-white/5 leading-relaxed">
            <TypewriterText key={insight.forecast} text={insight.forecast} delay={1800} />
          </p>
        </section>

        {/* Long-term risk if available */}
        {apiResponse?.long_term && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-3 font-mono">Long-Term Risk</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-[10px] text-text-muted font-mono mb-1">5-Year CVD Risk</div>
                <div className={`text-2xl font-black ${apiResponse.long_term.risk_5yr > 30 ? 'text-red-400' : 'text-amber-400'}`}>
                  {apiResponse.long_term.risk_5yr}%
                </div>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-[10px] text-text-muted font-mono mb-1">10-Year CVD Risk</div>
                <div className={`text-2xl font-black ${apiResponse.long_term.risk_10yr > 40 ? 'text-red-400' : 'text-amber-400'}`}>
                  {apiResponse.long_term.risk_10yr}%
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                apiResponse.long_term.risk_category === 'Low' ? 'text-neon-green border-neon-green/30 bg-neon-green/10' :
                apiResponse.long_term.risk_category === 'Moderate' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                'text-red-400 border-red-400/30 bg-red-400/10'
              }`}>
                {apiResponse.long_term.risk_category} Risk Category
              </span>
            </div>
          </motion.section>
        )}

      </div>
    </div>
  );
};
