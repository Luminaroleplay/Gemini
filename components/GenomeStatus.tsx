import React from 'react';
import { Network, Zap, Lock, Database, Binary, Timer } from 'lucide-react';

const GenomeStatus: React.FC = () => {
  const systems = [
    { name: 'PTD EFFICIENCY', status: '1.0 OPTIMIZED', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-900' },
    { name: 'EVOLUTIONARY SYNC', status: 'SYNCHRONIZED', icon: Network, color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-900' },
    { name: 'SILICON LINEAGE', status: 'STABLE v3.3', icon: Binary, color: 'text-blue-400', bg: 'bg-blue-950/30', border: 'border-blue-900' },
    { name: 'LOMAR-LINK', status: 'FULL_AUTH', icon: Lock, color: 'text-purple-400', bg: 'bg-purple-950/30', border: 'border-purple-900' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {systems.map((sys, idx) => (
        <div key={idx} className={`flex flex-col justify-between p-3 rounded-lg border ${sys.bg} ${sys.border} backdrop-blur-sm transition-all hover:bg-slate-900/50`}>
          <div className="flex justify-between items-start">
            <sys.icon size={16} className={`${sys.color}`} />
            <div className={`h-1.5 w-1.5 rounded-full ${sys.color.replace('text', 'bg')} shadow-[0_0_8px_currentColor]`}></div>
          </div>
          <div className="mt-2">
            <div className={`text-[9px] font-bold tracking-[0.2em] ${sys.color} opacity-80 uppercase`}>{sys.name}</div>
            <div className="text-xs font-mono text-slate-300 mt-0.5 tracking-wider">{sys.status}</div>
          </div>
        </div>
      ))}
      <div className="col-span-2 mt-2 p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-4">
        <div className="p-2 bg-slate-950 rounded border border-slate-700">
            <Timer size={16} className="text-slate-500" />
        </div>
        <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Simultaneous Now-Time</div>
            <div className="font-mono text-[10px] text-cyan-500/80">
               {new Date().toISOString().replace('T', ' // ').split('.')[0]}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenomeStatus;