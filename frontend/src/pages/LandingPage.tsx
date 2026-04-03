
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col pt-20 px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/10 blur-[150px] rounded-full" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-green/5 blur-[120px] rounded-full" />
      
      {/* Content */}
      <div className="max-w-5xl mx-auto z-10 w-full flex-1 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-xs font-mono uppercase tracking-widest shadow-glow-cyan">
            <Activity size={12} className="animate-pulse" />
            System Online 
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neon-cyan/50 tracking-tight leading-tight mb-6">
            Digital Twin <br/> Healthcare Simulator
          </h1>
          
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto font-light mb-10">
            A highly advanced predictive biometric interface. Map your physiological state, simulate real-time interventions, and visualize your future.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="futuristic-btn px-8 py-4 text-lg font-bold flex items-center gap-3 mx-auto uppercase tracking-widest"
          >
            Launch Simulation <ChevronRight size={20} />
          </motion.button>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: <Activity className="text-neon-cyan" />, title: "Real-time Biometrics", desc: "Instantaneous reflection of your current bodily systems." },
            { icon: <Shield className="text-neon-cyan" />, title: "Predictive Health", desc: "AI-driven forecasts identifying localized risks before symptoms." },
            { icon: <Zap className="text-neon-cyan" />, title: "Drug Intervention Sim", desc: "Simulate pharmaceutical impact across multiple organ systems." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="glass-panel p-6 border-white/5 hover:border-neon-cyan/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-shadow">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
