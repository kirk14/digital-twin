import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { useHealthStore } from '../../store/useHealthStore';

export const GraphPanel: React.FC = () => {
  const currentScore = useHealthStore((s) => s.healthScore);
  const isSimulatingImproved = useHealthStore((s) => s.isSimulatingImproved);
  const apiTimeline = useHealthStore((s) => s.apiResponse?.timeline);

  // Build chart data — prefer API timeline when available
  const data = useMemo(() => {
    if (apiTimeline && apiTimeline.length > 0) {
      return apiTimeline.map((pt) => ({
        month: pt.month,
        actual: pt.actual !== null ? Math.round(pt.actual) : undefined,
        projected: pt.projected !== null ? Math.round(pt.projected) : undefined,
        simulated: (isSimulatingImproved && pt.simulated !== null) ? Math.round(pt.simulated) : undefined,
      }));
    }

    // Fallback: computed from current score
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    return months.map((month, i) => ({
      month,
      actual: i <= 5 ? Math.max(0, Math.min(100, currentScore - (5 - i) * 2)) : undefined,
      projected: i >= 5 ? Math.min(100, currentScore + (i - 5) * 5) : undefined,
      simulated: isSimulatingImproved && i >= 4
        ? Math.min(100, currentScore + (i - 4) * 8)
        : undefined,
    }));
  }, [currentScore, isSimulatingImproved, apiTimeline]);

  return (
    <div className="bg-[#030712]/80 backdrop-blur-md border border-white/5 p-4 md:p-6 rounded-xl flex flex-col h-[300px] w-full relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      <div className="flex justify-between items-center mb-4 border-b border-neon-cyan/20 pb-2">
        <h3 className="text-xs tracking-widest text-text-muted uppercase font-mono flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" /> Predictive Trajectory
        </h3>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-neon-cyan shadow-[0_0_5px_#06b6d4]" /> Recorded
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-amber-400 shadow-[0_0_5px_#f59e0b]" /> Projected
          </span>
          {isSimulatingImproved && (
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-0.5 bg-neon-green shadow-[0_0_5px_#22c55e]" /> Optimized
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
              isAnimationActive
              animationDuration={1200}
              type="monotone"
              dataKey="actual"
              name="Recorded"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActual)"
              style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' }}
              connectNulls={false}
            />
            <Area
              isAnimationActive
              animationDuration={1200}
              animationBegin={400}
              type="monotone"
              dataKey="projected"
              name="Projected"
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorProjected)"
              style={{ filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.5))' }}
              connectNulls={false}
            />
            {isSimulatingImproved && (
              <Area
                isAnimationActive
                animationDuration={1200}
                animationBegin={600}
                type="monotone"
                dataKey="simulated"
                name="Optimized"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="8 3"
                fillOpacity={1}
                fill="url(#colorSimulated)"
                style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.7))' }}
                connectNulls={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
