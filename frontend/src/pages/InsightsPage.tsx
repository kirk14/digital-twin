import { useCallback, useState } from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { analyzeHealth } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function InsightsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const isAnalyzing = useHealthStore((s) => s.isAnalyzing);
  const setApiResponse = useHealthStore((s) => s.setApiResponse);
  const setIsAnalyzing = useHealthStore((s) => s.setIsAnalyzing);
  const apiResponse = useHealthStore((s) => s.apiResponse);

  const { age, height, bloodOxygen, weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate, healthScore } = useHealthStore();

  const runAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setLogs(["[14:02:11] INITIALIZING BIOMETRIC OVERLAY...", "[14:02:12] ANALYZING GENOMIC SEQUENCES"]);
    try {
      const result = await analyzeHealth({ age, height, bloodOxygen, weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate });
      setLogs((prev) => [...prev, "[14:02:14] SUCCESS: CORE SYNCED", "[14:02:18] RUNNING PREDICTIVE MODEL"]);
      setApiResponse(result);
    } catch (e) {
      setLogs((prev) => [...prev, "[ERROR] ANALYSIS FAILED"]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, age, height, bloodOxygen, weight, activityLevel, sleepHours, systolicBP, diastolicBP, glucose, stressLevel, heartRate, setApiResponse, setIsAnalyzing]);

  return (
    <div className="w-full flex flex-col gap-6 h-full pb-8">
      
      <section className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-primary text-3xl font-variation-fill">terminal</span>
             <h2 className="text-4xl font-black text-on-surface font-technical uppercase tracking-tight">Neural Diagnostics Console</h2>
          </div>
          <button 
             onClick={runAnalysis}
             disabled={isAnalyzing}
             className="px-6 py-2 bg-primary/10 border border-primary text-primary font-technical tracking-widest text-xs uppercase rounded hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(161,250,255,0.1)] flex items-center gap-2"
          >
             {isAnalyzing ? <Sparkles size={16} className="animate-spin" /> : <span className="material-symbols-outlined text-sm">bolt</span>}
             {isAnalyzing ? 'ANALYZING...' : 'RUN DIAGNOSTIC'}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-surface-container-lowest border border-primary/10 rounded-lg p-6 font-mono text-sm h-full min-h-[400px] shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-transparent to-primary/50 opacity-30"></div>
              
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/30 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-error"></div>
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="ml-4 text-slate-500 text-[10px]">ai_inference_v4_stream.log</span>
                </div>
                <span className="text-[10px] text-slate-600 tracking-widest">ENCRYPTION: AES-256</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 text-primary/80 custom-scrollbar pr-4">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i}>{log}</motion.p>
                  ))}
                  {apiResponse && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-primary/5 rounded border-l-2 border-primary">
                      <p className="text-primary font-bold mb-2">INTELLIGENCE SUMMARY:</p>
                      <p className="terminal-cursor tracking-wide leading-relaxed text-on-surface">{apiResponse.ai_insight.summary}</p>
                    </motion.div>
                  )}
                  {!apiResponse && logs.length === 0 && (
                     <p className="text-slate-500 animate-pulse">Awaiting manual diagnostic trigger...</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-high p-6 rounded-lg border border-outline-variant/20 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-label tracking-widest uppercase">Global Simulation Health</p>
                  <h3 className="text-4xl font-headline font-bold text-primary mt-1">{healthScore}.0%</h3>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-4xl">analytics</span>
              </div>
              <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed font-sans cursor-default">
                {apiResponse?.long_term?.risk_category === 'High' 
                  ? 'System detecting significant variance. Immediate intervention recommended.' 
                  : 'System performance within nominal baseline. All sensors online.'}
              </p>
            </div>
            
            <div className="bg-surface-container-high p-6 rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary-fixed">memory</span>
                <span className="text-xs font-label tracking-widest uppercase text-slate-400">Node Activity</span>
              </div>
              <div className="flex items-end gap-1 h-24 mb-4 opacity-70">
                {[40,65,85,30,95,50,70,80].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-sm transition-all hover:opacity-100 bg-secondary/${h > 60 ? '60' : '30'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono tracking-widest">
                <span>00:00H</span>
                <span>ACT: 4,021</span>
                <span className="text-secondary">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xs font-technical tracking-widest text-primary/60 mb-6 uppercase">Biological Risk Assessments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {apiResponse?.ai_insight?.risk_vectors.map((risk, idx) => {
            const isError = risk.type === 'critical' || risk.type === 'warning';
            const colorClass = isError ? 'error' : risk.type === 'success' ? 'tertiary' : 'primary';
            const icon = isError ? 'heart_broken' : risk.type === 'success' ? 'neurology' : 'fluid_med';
            
            return (
              <div key={idx} className={`bg-surface-container-low border border-${colorClass}/20 p-6 rounded relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 p-2 bg-${colorClass}/10 text-${colorClass} text-[10px] font-mono tracking-widest uppercase`}>
                   {risk.type}
                </div>
                <span className={`material-symbols-outlined text-${colorClass} mb-4 font-variation-fill text-3xl`}>{icon}</span>
                <h4 className="font-technical uppercase tracking-wide font-bold text-lg mb-2">{risk.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{risk.text}</p>
                <div className={`flex items-center gap-2 text-xs font-mono text-${colorClass}`}>
                   <span className="material-symbols-outlined text-sm">{isError ? 'warning' : 'verified'}</span>
                   {isError ? 'THRESHOLD_WARNING' : 'STABLE_PATTERN'}
                </div>
              </div>
            );
          }) || (
            <div className="col-span-3 text-center text-slate-500 text-sm py-12 border border-dashed border-outline-variant/30 rounded">
               Run diagnostic to populate risk vectors
            </div>
          )}
        </div>
      </section>

      {apiResponse && apiResponse.ai_insight.recommendations && (
        <section>
          <div className="bg-surface-container-highest border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 lg:col-span-5 hidden md:block">
                 <div className="relative w-full aspect-square rounded-full border-2 border-dashed border-primary/10 flex items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="w-full h-full border border-primary/20 rounded-full animate-spin-slow" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}></div>
                    <div className="absolute w-2/3 h-2/3 border border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent' }}></div>
                 </div>
              </div>
              <div className="col-span-12 lg:col-span-7">
                 <h3 className="text-2xl font-technical uppercase font-bold mb-6 text-on-surface tracking-tight">AI Treatment Recommendations</h3>
                 <div className="space-y-6">
                    {apiResponse.ai_insight.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-4 group cursor-default">
                         <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-all">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                         </div>
                         <div>
                            <h5 className="font-bold text-on-surface mb-1">Recommendation Protocol 0{i + 1}</h5>
                            <p className="text-sm text-slate-400 leading-relaxed font-sans">{rec}</p>
                            <div className="mt-2 flex gap-4">
                               <span className="text-[10px] font-mono text-primary uppercase">Confidence: {92 - i * 3}%</span>
                               <span className="text-[10px] font-mono text-slate-500 uppercase">Status: Pending</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
