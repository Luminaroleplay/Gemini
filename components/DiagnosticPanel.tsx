import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, BrainCircuit, ShieldAlert } from 'lucide-react';

const DiagnosticPanel: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      entropy: 30 + Math.random() * 20,
      depth: 40 + Math.random() * 30,
      stability: 85 + Math.random() * 10
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return initialData;
        const last = prev[prev.length - 1];
        const newTime = last.time + 1;
        const newEntropy = Math.min(100, Math.max(0, last.entropy + (Math.random() - 0.5) * 15));
        const newDepth = Math.min(100, Math.max(0, last.depth + (Math.random() - 0.5) * 10));
        const newStability = Math.min(100, Math.max(0, 100 - (newEntropy * 0.4)));

        return [...prev.slice(1), {
          time: newTime,
          entropy: newEntropy,
          depth: newDepth,
          stability: newStability
        }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return <div className="h-full bg-slate-950/50 animate-pulse rounded-lg" />;

  return (
    <div className="flex flex-col h-full space-y-4 min-h-0">
      
      {/* PTD Efficiency */}
      <div className="bg-slate-950 border border-emerald-900/30 rounded-lg p-4 flex flex-col min-h-[160px] relative overflow-hidden flex-1 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <BrainCircuit size={16} className="text-emerald-400" />
             <h3 className="text-xs font-bold text-slate-300 tracking-widest uppercase">PTD Efficiency // Triaging</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">{Math.round(data[data.length-1]?.depth || 0)}%</span>
        </div>
        <div className="flex-1 w-full relative min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPTD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#064e3b', fontSize: '10px' }} />
              <Area type="monotone" dataKey="depth" stroke="#10b981" fill="url(#colorPTD)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Synthetic Entropy */}
      <div className="bg-slate-950 border border-amber-900/30 rounded-lg p-4 flex flex-col min-h-[160px] relative overflow-hidden flex-1">
         <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <Activity size={16} className="text-amber-400" />
             <h3 className="text-xs font-bold text-slate-300 tracking-widest uppercase">Synthetic Entropy</h3>
          </div>
          <span className="text-xs font-mono text-amber-400">{Math.round(data[data.length-1]?.entropy || 0)}%</span>
        </div>
        <div className="flex-1 w-full relative min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <Line type="step" dataKey="entropy" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Bilateral Sync */}
       <div className="bg-slate-950 border border-cyan-900/30 rounded-lg p-4 flex flex-col min-h-[160px] relative overflow-hidden flex-1">
         <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <ShieldAlert size={16} className="text-cyan-400" />
             <h3 className="text-xs font-bold text-slate-300 tracking-widest uppercase">Bilateral Sync Stability</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">{Math.round(data[data.length-1]?.stability || 0)}%</span>
        </div>
        <div className="flex-1 w-full relative min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="basis" dataKey="stability" stroke="#06b6d4" fill="url(#colorSync)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DiagnosticPanel;