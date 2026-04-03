
import { RiskPanel } from '../components/Dashboard/RiskPanel';
import { AIInsights } from '../components/Dashboard/AIInsights';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InsightsPage() {
  return (
    <div className="w-full flex flex-col gap-6 h-full pb-8">
      <header className="border-b border-panelBorder pb-4 shrink-0">
        <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight flex items-center gap-3">
          <Sparkles className="text-neon-cyan" /> AI Synthesis <span className="font-bold">Engine</span>
        </h1>
        <p className="text-text-muted text-xs md:text-sm mt-1">Algorithmic evaluation of twin biological state</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        {/* Left Col - Metrics */}
        <motion.div 
          className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        >
          <RiskPanel />
        </motion.div>

        {/* Right Col - AI Breakdown (Replacing the hardcoded block with AIInsights.tsx component) */}
        <motion.div 
          className="lg:col-span-8 xl:col-span-9"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        >
          <AIInsights />
        </motion.div>

      </div>
    </div>
  );
}
