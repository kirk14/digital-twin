import { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { useHealthStore } from '../store/useHealthStore';
import { BodyCanvas } from '../components/simulation/BodyCanvas';

const PRESET_DRUGS = [
  { name: 'Lisinopril', dosage: 10, note: 'ACE Inhibitor' },
  { name: 'Metformin', dosage: 500, note: 'Biguanide' },
  { name: 'Aspirin', dosage: 100, note: 'Antiplatelet' },
  { name: 'Atorvastatin', dosage: 20, note: 'Statin' },
];

export default function MedicationPage() {
  const [targetOrgan, setTargetOrgan] = useState('Myocardium (Left Ventricle)');
  const [drug, setDrug] = useState(PRESET_DRUGS[0].name);
  const [dosage, setDosage] = useState(PRESET_DRUGS[0].dosage);
  
  const { stage, progress, isRunning, initialScore, startSimulation, aiNote } = useSimulation();
  const healthScore = useHealthStore((s) => s.healthScore);

  const handleSimulate = () => {
    if (drug && dosage && !isRunning) startSimulation(drug, dosage.toString());
  };

  const getStageWidth = (s: string) => {
    if (!isRunning) return '0%';
    const stages = ['idle', 'ingestion', 'absorption', 'peak', 'recovery'];
    const cIdx = stages.indexOf(stage);
    const sIdx = stages.indexOf(s);
    if (sIdx < cIdx) return '100%';
    if (sIdx === cIdx) return `${progress}%`;
    return '0%';
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-4xl font-black text-on-surface font-technical uppercase tracking-tight">Treatment Planner</h2>
          <p className="text-on-surface-variant text-sm mt-2">Therapeutic trajectory mapping and efficacy projection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <span className="material-symbols-outlined text-8xl">science</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-technical uppercase tracking-widest text-secondary block mb-2">Target System</label>
                    <select 
                      className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface p-3 rounded font-technical appearance-none focus:outline-none focus:border-secondary transition-colors"
                      value={targetOrgan}
                      onChange={(e) => setTargetOrgan(e.target.value)}
                      disabled={isRunning}
                    >
                      <option>Myocardium (Left Ventricle)</option>
                      <option>Hepatic System (Liver)</option>
                      <option>Renal Cortex (Kidneys)</option>
                      <option>Neural Network</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-technical uppercase tracking-widest text-primary block mb-2">Primary Agent</label>
                    <select 
                      className="w-full bg-surface-container-highest border border-outline-variant/30 text-primary p-3 rounded font-technical font-bold appearance-none focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,244,254,0.2)] transition-all"
                      value={drug}
                      onChange={(e) => {
                        const d = PRESET_DRUGS.find(p => p.name === e.target.value);
                        if (d) { setDrug(d.name); setDosage(d.dosage); }
                      }}
                      disabled={isRunning}
                    >
                      {PRESET_DRUGS.map(p => <option key={p.name} value={p.name}>{p.name} ({p.note})</option>)}
                    </select>
                  </div>
               </div>

               <div className="space-y-8 flex flex-col justify-center">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-[10px] font-technical uppercase tracking-widest text-on-surface-variant">Dosage Titration</label>
                      <div>
                        <span className="text-xl font-bold font-technical text-on-surface">{dosage}</span>
                        <span className="text-[10px] font-technical text-on-surface-variant ml-1">mg</span>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="1000" 
                      step="5"
                      value={dosage} 
                      onChange={(e) => setDosage(parseInt(e.target.value))}
                      disabled={isRunning}
                      className="w-full custom-slider appearance-none bg-transparent"
                    />
                  </div>
                  <button 
                    className="w-full py-4 bg-primary/10 border border-primary text-primary font-technical font-bold text-xs uppercase tracking-widest rounded shadow-[inset_0_0_20px_rgba(0,244,254,0.1)] hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,244,254,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSimulate}
                    disabled={isRunning}
                  >
                    {isRunning ? 'SIMULATION IN PROGRESS' : 'CALCULATE TRAJECTORY'}
                  </button>
               </div>
             </div>
          </div>

          {/* Timeline Track */}
          <div className="glass-panel p-6">
            <h3 className="text-xs font-technical font-bold text-on-surface-variant tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">linear_scale</span> Pharmacokinetic Timeline
            </h3>

            <div className="relative mt-12 pb-4">
              <div className="absolute top-[8px] left-0 w-full h-[2px] bg-outline-variant/30"></div>
              
              <div className="relative flex justify-between z-10 w-full px-4">
                {/* Stage: Ingestion */}
                <div className="flex flex-col items-center group">
                  <div className={`w-4 h-4 rounded-full border-2 bg-surface mb-3 transition-colors ${['ingestion', 'absorption', 'peak', 'recovery'].includes(stage) ? 'border-primary' : 'border-outline-variant'}`}>
                    <div className={`w-full h-full bg-primary transition-all origin-left`} style={{transform: `scaleX(${getStageWidth('ingestion')})`}}></div>
                  </div>
                  <p className={`text-[10px] font-technical uppercase tracking-widest mb-1 ${stage === 'ingestion' ? 'text-primary' : 'text-slate-500'}`}>Ingestion</p>
                  <p className="text-[9px] text-slate-600 font-technical uppercase">T+0.5h</p>
                </div>
                
                {/* Stage: Absorption */}
                <div className="flex flex-col items-center group">
                  <div className={`w-4 h-4 rounded-full border-2 bg-surface mb-3 transition-colors ${['absorption', 'peak', 'recovery'].includes(stage) ? 'border-secondary' : 'border-outline-variant'}`}>
                     <div className={`w-full h-full bg-secondary transition-all origin-left`} style={{transform: `scaleX(${getStageWidth('absorption')})`}}></div>
                  </div>
                  <p className={`text-[10px] font-technical uppercase tracking-widest mb-1 ${stage === 'absorption' ? 'text-secondary' : 'text-slate-500'}`}>Absorption</p>
                  <p className="text-[9px] text-slate-600 font-technical uppercase">T+2.0h</p>
                </div>
                
                {/* Stage: Peak */}
                <div className="flex flex-col items-center group">
                  <div className={`w-4 h-4 rounded-full border-2 bg-surface mb-3 transition-colors ${['peak', 'recovery'].includes(stage) ? 'border-tertiary' : 'border-outline-variant'}`}>
                     <div className={`w-full h-full bg-tertiary transition-all origin-left`} style={{transform: `scaleX(${getStageWidth('peak')})`}}></div>
                  </div>
                  <p className={`text-[10px] font-technical uppercase tracking-widest mb-1 ${stage === 'peak' ? 'text-tertiary' : 'text-slate-500'}`}>Peak Effect</p>
                  <p className="text-[9px] text-slate-600 font-technical uppercase">T+4.5h</p>
                </div>
                
                {/* Stage: Recovery */}
                <div className="flex flex-col items-center group">
                  <div className={`w-4 h-4 rounded-full border-2 bg-surface mb-3 transition-colors ${['recovery'].includes(stage) ? 'border-purple-400' : 'border-outline-variant'}`}>
                     <div className={`w-full h-full bg-purple-400 transition-all origin-left`} style={{transform: `scaleX(${getStageWidth('recovery')})`}}></div>
                  </div>
                  <p className={`text-[10px] font-technical uppercase tracking-widest mb-1 ${stage === 'recovery' ? 'text-purple-400' : 'text-slate-500'}`}>Clearance</p>
                  <p className="text-[9px] text-slate-600 font-technical uppercase">T+12.0h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-highest/50 p-4 border-l-2 border-primary">
               <p className="text-[10px] text-on-surface-variant font-technical uppercase mb-1 tracking-widest">Active Sim Status</p>
               <p className="text-secondary text-sm font-technical uppercase">{isRunning ? `Processing: ${stage}` : 'Idle'}</p>
            </div>
            <div className="bg-surface-container-highest/50 p-4 border-l-2 border-tertiary">
               <p className="text-[10px] text-on-surface-variant font-technical uppercase mb-1 tracking-widest">Score Delta</p>
               <p className="text-tertiary text-sm font-technical uppercase">
                  {initialScore > 0 ? `${initialScore} -> ${healthScore} (${healthScore - initialScore > 0 ? '+' : ''}${healthScore - initialScore})` : 'Awaiting Input'}
               </p>
            </div>
          </div>
        </div>

        {/* Right Column: Efficacy Projections */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
            <h3 className="text-sm font-technical font-bold text-on-surface uppercase tracking-widest">Efficacy Projection</h3>
            <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[9px] font-technical uppercase tracking-[0.2em] border border-tertiary/20">High Confidence</span>
          </div>
          
          {aiNote && (
            <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary/30 rounded text-tertiary">
              <p className="text-[10px] font-technical uppercase tracking-widest mb-1">Causal AI Intel:</p>
              <p className="text-xs font-mono">{aiNote}</p>
            </div>
          )}

          <div className="relative h-[300px] w-full bg-surface-container-highest/30 rounded flex items-center justify-center mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,106,110,0.1)_0%,transparent_70%)]"></div>
            <BodyCanvas />
            
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#2ff801] animate-pulse"></span>
               <span className="text-[9px] font-technical text-tertiary tracking-widest uppercase">Bio-Mapping Active</span>
            </div>
          </div>

          <div className="flex-1">
             <h4 className="text-[10px] font-technical text-slate-500 uppercase tracking-widest mb-3">Risk Reduction Matrix</h4>
             <div className="grid grid-cols-2 gap-px bg-outline-variant/20 rounded overflow-hidden">
                <div className="bg-surface p-4">
                   <p className="text-xl font-bold font-technical text-tertiary">-18%</p>
                   <p className="text-[9px] text-on-surface-variant font-technical uppercase mt-1">Hypertension Event</p>
                </div>
                <div className="bg-surface p-4">
                   <p className="text-xl font-bold font-technical text-tertiary">-12%</p>
                   <p className="text-[9px] text-on-surface-variant font-technical uppercase mt-1">Myocardial Stress</p>
                </div>
                <div className="bg-surface p-4">
                   <p className="text-xl font-bold font-technical text-secondary">+8%</p>
                   <p className="text-[9px] text-on-surface-variant font-technical uppercase mt-1">Vascular Elasticity</p>
                </div>
                <div className="bg-surface p-4">
                   <p className="text-xl font-bold font-technical text-on-surface">Min</p>
                   <p className="text-[9px] text-on-surface-variant font-technical uppercase mt-1">Hepatic Load</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
