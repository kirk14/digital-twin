import { Link, useLocation } from 'react-router-dom';
import { useHealthStore } from '../../store/useHealthStore';

export const Sidebar = () => {
  const location = useLocation();
  const medSim = useHealthStore((s) => s.medSim);
  const toggleSimulation = useHealthStore((s) => s.toggleSimulation);

  const navItems = [
    { path: '/dashboard', label: 'Monitor & Sim', icon: 'monitor_heart' },
    { path: '/scenarios', label: 'Sim Scenarios', icon: 'biotech' },
    { path: '/medication', label: 'Treatment Planner', icon: 'assignment_add' },
    { path: '/insights', label: 'AI Insights', icon: 'insights' },
  ];

  return (
    <aside className="h-screen w-[260px] fixed left-0 top-0 border-r border-cyan-500/10 bg-slate-950/40 backdrop-blur-xl flex flex-col py-8 px-6 z-50 shadow-[0_0_40px_rgba(0,245,255,0.05)]">
      
      {/* Brand */}
      <div className="mb-12">
        <h1 className="text-xl font-bold tracking-widest text-cyan-400 font-headline">SYNTH-LIFE</h1>
        <p className="text-[10px] text-slate-500 tracking-[0.2em] mt-1 uppercase font-headline">V 4.0.21</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 transition-colors group ${
                isActive
                  ? 'text-cyan-400 border-r-2 border-cyan-400 bg-cyan-400/5'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="font-label font-medium uppercase tracking-wider text-sm flex-1">
                {item.label}
              </span>

              {/* Medication running badge */}
              {item.path === '/medication' && medSim.isRunning && (
                <span className="text-[8px] font-technical text-primary border border-primary/30 bg-primary/10 px-1 py-0.5 rounded animate-pulse">
                  {medSim.progress}%
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / System Admin */}
      <div className="mt-auto space-y-6">
        <button 
          onClick={toggleSimulation}
          className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed py-3 px-4 font-label font-bold text-xs tracking-widest shadow-[0_0_20px_rgba(161,250,255,0.2)] hover:shadow-[0_0_30px_rgba(161,250,255,0.4)] transition-all uppercase"
        >
          {medSim.isRunning ? 'SIMULATION RUNNING' : 'RUN SIMULATION'}
        </button>
        
        <div className="flex items-center gap-3 px-2">
          <img 
            alt="Digital Twin User Avatar" 
            className="w-8 h-8 rounded-full border border-cyan-500/30 object-cover" 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200" 
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-on-surface truncate uppercase font-technical">Dr. K. Aris</p>
            <p className="text-[10px] text-cyan-400/60 uppercase font-technical">System Admin</p>
          </div>
          <span className="material-symbols-outlined text-slate-400 ml-auto cursor-pointer test-sm" data-icon="settings">settings</span>
        </div>
      </div>
    </aside>
  );
};
