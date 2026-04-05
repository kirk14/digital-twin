import { Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  return (
    <header className="sticky top-0 w-full h-16 bg-background/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none flex justify-between items-center px-4 md:px-8 z-40">
      
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Brand / Status */}
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,244,254,0.8)] animate-pulse hidden md:block"></span>
        <span className="text-lg font-black text-cyan-400 uppercase tracking-tighter font-headline">
          {window.innerWidth < 768 ? 'HealthCore' : 'HealthCore Simulation'}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <span className="material-symbols-outlined text-slate-500 hover:text-cyan-400 transition-all cursor-pointer" data-icon="notifications_active">notifications_active</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
        </div>
        <span className="material-symbols-outlined text-slate-500 hover:text-cyan-400 transition-all cursor-pointer hidden sm:block" data-icon="sensors">sensors</span>
        <span className="material-symbols-outlined text-slate-500 hover:text-cyan-400 transition-all cursor-pointer hidden sm:block" data-icon="settings">settings</span>
      </div>
      
    </header>
  );
};
