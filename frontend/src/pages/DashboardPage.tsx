import { ControlPanel } from '../components/Dashboard/ControlPanel';
import { BodyCanvas } from '../components/Dashboard/BodyCanvas';
import { RiskPanel } from '../components/Dashboard/RiskPanel';
import { GraphPanel } from '../components/Dashboard/GraphPanel';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Top Header */}
      <header className="flex justify-between items-end border-b border-panelBorder pb-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight">Main <span className="font-bold text-neon-cyan">Terminal</span></h1>
          <p className="text-text-muted text-xs md:text-sm mt-1">Live Biological Twin Simulation</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-neon-cyan font-mono flex items-center gap-2 justify-end">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            SYSTEM ONLINE
          </div>
          <div className="text-[10px] md:text-xs text-text-muted font-mono mt-1">SYNC_RATE: 144Hz</div>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Panel: Controls */}
        <motion.div 
          className="lg:col-span-3 flex flex-col h-[400px] lg:h-full lg:min-h-0"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        >
          <ControlPanel />
        </motion.div>

        {/* Center Panel: Human Body VIS */}
        <motion.div 
          className="lg:col-span-6 glass-panel flex flex-col items-center justify-center relative border-neon-cyan/20 h-[500px] lg:h-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        >
          {/* Decorative scanner lines */}
          <div className="absolute top-0 w-full h-[1px] bg-neon-cyan/50 animate-[translateY_4s_linear_infinite] shadow-[0_0_10px_#06b6d4]" />
          
          <div className="absolute top-4 left-4 font-mono text-[10px] text-neon-cyan/70 tracking-widest border border-neon-cyan/20 px-2 py-1 bg-neon-cyan/5">
            BIO_SCAN_ACTIVE
          </div>
          
          <BodyCanvas />
        </motion.div>

        {/* Right Panel: Metrics */}
        <motion.div 
          className="md:col-span-2 lg:col-span-3 flex flex-col h-[400px] lg:h-full lg:min-h-0"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
        >
          <RiskPanel />
        </motion.div>

        {/* Bottom Section: Graph Panel */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <GraphPanel />
        </motion.div>
      </div>

    </div>
  );
}
