import { motion } from 'framer-motion';
import { useHealthStore } from '../store/useHealthStore';
import { BodyCanvas } from '../components/simulation/BodyCanvas';
import { ControlPanel } from '../components/Dashboard/ControlPanel';

export default function DashboardPage() {
  const { heartRate, activityLevel, sleepHours, systolicBP } = useHealthStore();
  const apiResponse = useHealthStore(s => s.apiResponse);
  
  // Calculate some derived dummy-ish values for the panels based on store state
  const oxygenSaturation = Math.min(100, Math.max(90, 98 - (systolicBP > 130 ? 2 : 0) + (activityLevel > 6 ? 1 : 0)));
  const steps = activityLevel * 1800 + Math.floor(Math.random() * 200);
  const calories = activityLevel * 450;
  
  return (
    <div className="w-full min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h3 className="text-3xl font-light text-on-surface font-technical uppercase">Real-time Biometrics</h3>
          <p className="text-on-surface-variant text-sm mt-1">
            Patient Subject: <span className="text-primary font-technical">DT-8821-B</span> (Sarah Jenkins)
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container-high rounded-lg border border-outline-variant/20 flex items-center gap-3">
            <span className="text-[10px] font-technical text-on-surface-variant uppercase tracking-widest">Signal</span>
            <div className="flex gap-1 items-end h-3">
              <div className="w-1 h-1 bg-secondary rounded-full"></div>
              <div className="w-1 h-2 bg-secondary rounded-full"></div>
              <div className="w-1 h-3 bg-secondary rounded-full"></div>
              <div className="w-1 h-2 bg-slate-700 rounded-full"></div>
            </div>
          </div>
          <div className="px-4 py-2 bg-surface-container-high rounded-lg border border-outline-variant/20 flex items-center gap-3">
            <span className="text-[10px] font-technical text-on-surface-variant uppercase tracking-widest">Battery</span>
            <span className="text-xs font-technical text-primary">82%</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout - Stitch Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-auto lg:auto-rows-[160px]">
        
        {/* Heart Rate Monitor (Primary) */}
        <motion.section 
          className="lg:col-span-8 lg:row-span-2 glass-panel p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex justify-between items-start mb-4 relative z-20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-error text-sm">favorite</span>
                <h4 className="text-xs font-technical text-on-surface-variant tracking-widest uppercase">Cardiac Rhythms</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold font-technical text-on-surface tracking-tighter">{heartRate}</span>
                <span className="text-xl text-on-surface-variant font-technical">BPM</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-tertiary font-technical uppercase tracking-widest">Stability: {heartRate > 90 ? 'Elevated' : 'Optimal'}</p>
              <p className="text-[10px] text-on-surface-variant font-technical uppercase tracking-widest">Variability: 42ms</p>
            </div>
          </div>
          
          {/* Heart Rate Graph Simulation Overlay */}
          <div className="absolute bottom-6 left-6 right-6 h-32 opacity-60 z-10">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <path className="opacity-50" d="M0 150 L50 150 L65 100 L75 190 L90 150 L140 150 L155 100 L165 190 L180 150 L230 150 L245 40 L260 195 L275 150 L325 150 L340 100 L350 190 L365 150 L415 150 L430 100 L440 190 L455 150 L505 150 L520 20 L535 195 L550 150 L600 150 L615 100 L625 190 L640 150 L690 150 L705 100 L715 190 L730 150 L800 150" fill="none" stroke="#a1faff" strokeWidth="2"></path>
              <path className="opacity-30" d="M0 150 L50 150 L65 100 L75 190 L90 150 L140 150 L155 100 L165 190 L180 150 L230 150 L245 40 L260 195 L275 150 L325 150 L340 100 L350 190 L365 150 L415 150 L430 100 L440 190 L455 150 L505 150 L520 20 L535 195 L550 150 L600 150 L615 100 L625 190 L640 150 L690 150 L705 100 L715 190 L730 150 L800 150" fill="none" filter="blur(8px)" stroke="#a1faff" strokeWidth="4"></path>
            </svg>
          </div>
        </motion.section>

        {/* Oxygen Levels (Side) */}
        <motion.section 
          className="lg:col-span-4 lg:row-span-1 glass-panel p-6 flex flex-col justify-between"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">air</span>
              <h4 className="text-xs font-technical text-on-surface-variant tracking-widest uppercase">Oxygen Saturation</h4>
            </div>
            <span className="text-2xl font-bold font-technical text-secondary">{oxygenSaturation}%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-secondary shadow-[0_0_10px_#57fae9]" style={{ width: `${oxygenSaturation}%` }}></div>
          </div>
        </motion.section>

        {/* Activity Tracking */}
        <motion.section 
          className="lg:col-span-4 lg:row-span-1 glass-panel p-6 flex flex-col justify-between border-tertiary/10"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm">directions_run</span>
              <h4 className="text-xs font-technical text-on-surface-variant tracking-widest uppercase">Activity</h4>
            </div>
            <span className="text-[10px] font-technical uppercase text-tertiary border border-tertiary/20 bg-tertiary/5 px-2 py-0.5 rounded">Level {activityLevel}</span>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[10px] text-on-surface-variant font-technical uppercase">Steps</p>
              <p className="text-2xl font-bold font-technical text-on-surface">{steps.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-on-surface-variant font-technical uppercase">Calories</p>
              <p className="text-2xl font-bold font-technical text-on-surface">{calories} <span className="text-xs font-light text-on-surface-variant">kcal</span></p>
            </div>
          </div>
        </motion.section>

        {/* Controls Overlay (Bottom Left) -> Adjusted to be inline */}
        <motion.section 
          className="lg:col-span-3 lg:row-span-3 h-auto min-h-[400px]"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.4, ease: "easeInOut" }}
        >
           <ControlPanel />
        </motion.section>

        {/* Anatomical Scan (Central Focus) */}
        <motion.section 
          className="lg:col-span-5 lg:row-span-3 glass-panel relative overflow-hidden flex items-center justify-center min-h-[500px]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,244,254,0.1),transparent_70%)]"></div>
          </div>
          
          <div className="relative z-10 w-full h-full p-4 flex items-center justify-center pt-8">
            <BodyCanvas />
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary shadow-glow-cyan animate-pulse"></div>
            <p className="text-[10px] font-technical text-primary tracking-widest">3D RENDERING ACTIVE</p>
          </div>
        </motion.section>

        {/* System Logs (Right Column) */}
        <motion.section 
          className="lg:col-span-4 lg:row-span-3 glass-panel p-6 flex flex-col"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
            <h4 className="text-xs font-technical text-on-surface-variant tracking-widest uppercase">System Diagnostics</h4>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {apiResponse?.ai_insight?.risk_vectors.map((finding: any, idx: number) => (
              <div key={idx} className={`border-l-2 ${finding.type === 'critical' ? 'border-error/50' : 'border-primary/30'} pl-3 py-1`}>
                <p className={`text-[10px] font-technical ${finding.type === 'critical' ? 'text-error' : 'text-primary'}`}>FINDING_{idx + 1}</p>
                <p className="text-xs text-on-surface/80 leading-relaxed font-sans">{finding.title}</p>
              </div>
            )) || (
              <>
                <div className="border-l-2 border-primary/30 pl-3 py-1">
                  <p className="text-[10px] font-technical text-primary">14:22:04</p>
                  <p className="text-xs text-on-surface/80 leading-relaxed font-sans">Neural sync completed. Latency: 12ms.</p>
                </div>
                <div className="border-l-2 border-tertiary/30 pl-3 py-1">
                  <p className="text-[10px] font-technical text-tertiary">14:21:58</p>
                  <p className="text-xs text-on-surface/80 leading-relaxed font-sans">Cortisol levels stabilizing post-simulation.</p>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-outline-variant/20">
            <div className="flex items-center justify-between text-[10px] font-technical text-slate-500">
              <span>CPU LOAD: 24%</span>
              <span className="text-primary">ENCRYPTED STREAM</span>
            </div>
          </div>
        </motion.section>

        {/* Environmental Data */}
        <motion.section 
          className="lg:col-span-4 lg:row-span-1 glass-panel p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">thermostat</span>
            <h4 className="text-xs font-technical text-on-surface-variant tracking-widest uppercase">Ambient / Vitals</h4>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-2xl font-bold font-technical text-on-surface">{systolicBP} mmHg</span>
            <span className="text-sm font-technical text-on-surface-variant">Sys BP</span>
          </div>
        </motion.section>

        {/* Sleep Analytics */}
        <motion.section 
          className="lg:col-span-8 lg:row-span-1 glass-panel p-6 flex items-center gap-4 border-primary/10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.4, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-lg">dark_mode</span>
          </div>
          <div>
            <h4 className="text-[10px] font-technical text-on-surface-variant tracking-widest uppercase">Deep Sleep Cycle</h4>
            <p className="text-xl font-bold font-technical text-on-surface">{sleepHours}h <span className="text-sm text-slate-500 font-normal">avg/night</span></p>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
