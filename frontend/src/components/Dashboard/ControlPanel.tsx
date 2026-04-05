import React from 'react';
import { useHealthStore } from '../../store/useHealthStore';

interface ControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  metricKey: keyof import('../../store/useHealthStore').HealthState;
  unit: string;
}

const ControlSlider: React.FC<ControlProps> = ({ label, value, min, max, metricKey, unit }) => {
  const updateMetric = useHealthStore((state) => state.updateMetric);
  const colorClass = 
    metricKey === 'weight' ? 'text-primary' :
    metricKey === 'activityLevel' ? 'text-secondary' :
    metricKey === 'sleepHours' ? 'text-tertiary' :
    metricKey === 'systolicBP' ? 'text-error' :
    'text-primary';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-technical uppercase text-on-surface-variant group-hover:text-primary transition-colors">{label}</label>
        <div className="text-right">
          <span className={`text-sm font-technical ${colorClass}`}>{value}</span>
          <span className="text-[10px] text-on-surface-variant font-technical ml-1">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => updateMetric(metricKey as any, parseFloat(e.target.value))}
        className="w-full custom-slider appearance-none bg-transparent"
        style={{
          // Forcing thumb color to match if we were doing deep CSS mapping, but custom-slider handles it mostly.
        }}
      />
    </div>
  );
};

export const ControlPanel: React.FC = () => {
  const { weight, activityLevel, sleepHours, systolicBP, glucose, isSimulatingImproved, toggleSimulation, xrayMode, toggleXrayMode } = useHealthStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Sliders Panel */}
      <div className="glass-panel p-6 rounded-lg relative overflow-hidden flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <span className="material-symbols-outlined text-6xl">tune</span>
        </div>
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-sm font-technical font-bold text-primary tracking-widest uppercase">Biological Variables</h3>
           <button 
              onClick={toggleXrayMode}
              className={`text-[10px] border px-2 py-1 rounded font-technical uppercase ${xrayMode ? 'border-primary text-primary shadow-glow-cyan' : 'border-outline-variant text-slate-500 hover:text-white'}`}
           >
              X-RAY
           </button>
        </div>
        <div className="space-y-6 relative z-10 flex-1 justify-center flex flex-col">
          <ControlSlider label="Body Mass" value={weight} min={40} max={150} metricKey="weight" unit="kg" />
          <ControlSlider label="Metabolic Activity" value={activityLevel} min={1} max={10} metricKey="activityLevel" unit="Lvl" />
          <ControlSlider label="Circadian Rest" value={sleepHours} min={2} max={12} metricKey="sleepHours" unit="Hrs" />
          <ControlSlider label="Systolic Pressure" value={systolicBP} min={90} max={200} metricKey="systolicBP" unit="mmHg" />
          <ControlSlider label="Glucose Load" value={glucose} min={60} max={250} metricKey="glucose" unit="mg/dL" />
        </div>
      </div>

      {/* Presets Panel */}
      <div className="glass-panel p-6 rounded-lg flex flex-col justify-center">
        <h3 className="text-sm font-technical font-bold text-primary mb-4 tracking-widest uppercase">System Overrides</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={toggleSimulation}
            className={`flex items-center justify-between p-3 bg-surface-container-highest border transition-all group ${isSimulatingImproved ? 'border-tertiary-dim' : 'border-outline-variant hover:border-tertiary-dim'}`}
          >
            <div className="text-left">
              <p className={`text-xs font-technical ${isSimulatingImproved ? 'text-tertiary-dim shadow-glow-green' : 'text-on-surface'}`}>RECOVERY OPTIMIZATION</p>
              <p className="text-[9px] text-on-surface-variant uppercase mt-1">Deep tissue & CNS repair algorithm</p>
            </div>
            <span className={`material-symbols-outlined ${isSimulatingImproved ? 'text-tertiary-dim animate-spin-slow' : 'text-tertiary-dim'}`} data-icon="refresh">refresh</span>
          </button>
          
          <button className="flex items-center justify-between p-3 bg-surface-container-highest border border-outline-variant hover:border-error-dim transition-all group opacity-60">
            <div className="text-left">
              <p className="text-xs font-technical text-on-surface">CRITICAL STRESS TEST</p>
              <p className="text-[9px] text-on-surface-variant uppercase mt-1">Max cortisol & cardiac load</p>
            </div>
            <span className="material-symbols-outlined text-error-dim" data-icon="bolt">bolt</span>
          </button>
          
          <button className="flex items-center justify-between p-3 bg-surface-container-highest border border-outline-variant transition-all hover:border-secondary-dim group opacity-60">
            <div className="text-left">
              <p className="text-xs font-technical text-on-surface">METABOLIC ACCEL</p>
              <p className="text-[9px] text-on-surface-variant uppercase mt-1">Fat oxidation & glucose spike</p>
            </div>
            <span className="material-symbols-outlined text-secondary-dim" data-icon="speed">speed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
