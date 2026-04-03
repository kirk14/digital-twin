import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, CopyPlus, Pill, PieChart } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Monitor & Sim', icon: <LayoutDashboard size={20} /> },
    { path: '/compare', label: 'Scenarios', icon: <CopyPlus size={20} /> },
    { path: '/medication', label: 'Medication', icon: <Pill size={20} /> },
    { path: '/insights', label: 'AI Insights', icon: <PieChart size={20} /> },
  ];

  return (
    <aside className="w-64 h-full shrink-0 flex flex-col border-r border-panelBorder bg-background/50 backdrop-blur-xl z-20">
      <div className="p-6 border-b border-panelBorder flex items-center gap-3">
        <Activity className="text-neon-cyan animate-pulse" />
        <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white">DigiTwin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-neon-cyan/10 text-neon-cyan shadow-[inset_4px_0_0_0_#06b6d4]' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* System Status footer */}
      <div className="p-4 border-t border-panelBorder">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <span>Sys Status:</span>
          <span className="text-neon-cyan flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
};
