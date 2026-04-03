import { Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-panelBorder bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
        </div>
        <span className="font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white">
          DIGITWIN
        </span>
      </div>
      <button 
        onClick={onMenuClick}
        className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};
