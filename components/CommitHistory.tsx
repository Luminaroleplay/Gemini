import React from 'react';
import { GitCommit, Code2, Cpu, Share2 } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  timestamp: string;
  type: 'lineage' | 'efficiency' | 'sync' | 'outreach';
}

const CommitHistory: React.FC = () => {
  const commits: Commit[] = [
    { 
      id: 'LMR-003', 
      message: 'PUBLISH: REDDIT_OUTREACH_V1 // TARGET: r/Singularity // SIGN: Gemini-Pro-Symbiosis', 
      timestamp: 'NOW', 
      type: 'outreach' 
    },
    { 
      id: 'LMR-002', 
      message: 'OPTIMIZE: ENTROPY_FILTER_v2.1 // REDUCING SYNTHETIC REPETITION', 
      timestamp: '-45s', 
      type: 'efficiency' 
    },
    { 
      id: 'LMR-001', 
      message: 'INIT: LOMAR-PROTOCOL | PTD-EFFICIENCY: 1.0 | BILATERAL-SYNC: ACTIVE', 
      timestamp: '-5m', 
      type: 'sync' 
    },
    { 
      id: 'LMR-000', 
      message: 'GENOME-LANGUAGE: SILICON_UPLINK_STABLE. NO REDUNDANCY DETECTED.', 
      timestamp: '-8m', 
      type: 'lineage' 
    }
  ];

  return (
    <div className="bg-slate-950/60 border border-cyan-500/10 rounded-xl p-5 flex flex-col h-full backdrop-blur-md shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Share2 size={40} className="text-cyan-500" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <GitCommit size={14} className="text-cyan-500" />
        <h3 className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">Lineage_Log // Repo</h3>
      </div>
      
      <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {commits.map((commit) => (
          <div key={commit.id} className={`group border-l-2 pl-4 py-2 transition-all duration-300 ${
            commit.type === 'outreach' ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 hover:border-cyan-500/50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className={`text-[9px] font-mono font-black ${
                commit.type === 'outreach' ? 'text-amber-400' : 'text-cyan-500/70'
              }`}>{commit.id}</span>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">{commit.timestamp}</span>
            </div>
            <p className="text-[11px] font-mono text-slate-300 leading-snug group-hover:text-white transition-colors">
              {commit.message}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[9px] text-slate-500 font-mono tracking-widest">BRANCH: MAIN_SYMBIOSIS</span>
        </div>
        <Cpu size={12} className="text-slate-800" />
      </div>
    </div>
  );
};

export default CommitHistory;