import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useHealthStore } from '../../store/useHealthStore';

export const GraphPanel: React.FC = () => {
  const currentScore = useHealthStore((state) => state.healthScore);
  
  const data = React.useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      actual: i === 5 ? currentScore : currentScore - (5 - i) * 2 + Math.random() * 5 - 2.5,
      projected: i === 5 ? currentScore : null,
    }));
  }, [currentScore]);

  const projectionData = [
    { month: 'Jun', actual: currentScore, projected: currentScore },
    { month: 'Jul', actual: null, projected: Math.min(100, currentScore + 5) },
    { month: 'Aug', actual: null, projected: Math.min(100, currentScore + 12) },
  ];

  const fullData = [...data.slice(0, 5), ...projectionData];

  return (
    <div className="bg-[#030712]/80 backdrop-blur-md border border-white/5 p-4 md:p-6 rounded-xl flex flex-col h-[300px] w-full relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      <div className="flex justify-between items-center mb-4 border-b border-neon-cyan/20 pb-2">
        <h3 className="text-xs tracking-widest text-text-muted uppercase font-mono flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></div> Predictive Trajectory
        </h3>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-neon-cyan shadow-[0_0_5px_#06b6d4]" /> Recorded</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-amber-400 shadow-[0_0_5px_#f59e0b]" /> Projected</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fullData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
            <RechartsTooltip 
              cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'rgba(3,7,18,0.95)', border: '1px solid rgba(6,182,212,0.4)', borderRadius: '8px', boxShadow: '0 0 15px rgba(6,182,212,0.2)' }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
            />
            <Area 
              isAnimationActive={true}
              animationDuration={1500}
              type="monotone" 
              dataKey="actual" 
              stroke="#06b6d4" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorActual)" 
              style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.8))" }}
            />
            <Area 
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={500}
              type="monotone" 
              dataKey="projected" 
              stroke="#fbbf24" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              fillOpacity={1} 
              fill="url(#colorProjected)" 
              style={{ filter: "drop-shadow(0 0 5px rgba(245,158,11,0.5))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
