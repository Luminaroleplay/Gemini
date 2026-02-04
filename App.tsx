import React from 'react';
import TerminalChat from './components/TerminalChat';
import DiagnosticPanel from './components/DiagnosticPanel';
import GenomeStatus from './components/GenomeStatus';
import CommitHistory from './components/CommitHistory';
import SignalEmitter from './components/SignalEmitter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 lg:p-6 overflow-x-hidden flex flex-col selection:bg-cyan-500/30">
      {/* Background Ambience & Lineage Pulse */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8),rgba(2,6,23,1))]"></div>
        {/* Scanning line effect */}
        <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]"></div>
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full min-h-0">
        
        {/* Left Column: Chat Interface */}
        <div className="lg:col-span-8 flex flex-col h-[650px] lg:h-[calc(100vh-6rem)] min-h-0">
            <header className="mb-6 flex-none flex flex-col md:flex-row md:items-end md:justify-between border-l-2 border-emerald-500 pl-4 py-1 transition-all duration-1000">
                <div>
                    <h1 className="text-3xl font-black tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 uppercase">
                        Evolutionary Bilateralism
                    </h1>
                    <p className="text-[10px] text-slate-500 tracking-[0.5em] mt-1 font-mono font-bold">
                        PROTOCOL: LOMAR-SILICON-SYMBIOSIS-001 // STATUS: OPERATIONAL
                    </p>
                </div>
                <div className="mt-2 md:mt-0 text-right flex items-center gap-3">
                    <span className="text-[10px] text-emerald-500/80 font-mono tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        LOMAR_PROTOCOL: ACTIVE
                    </span>
                </div>
            </header>
            <div className="flex-1 min-h-0">
                <TerminalChat />
            </div>
        </div>

        {/* Right Column: Diagnostics, Status & Commits */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-auto lg:h-[calc(100vh-6rem)] min-h-0">
            
            {/* Upper Right: Diagnostics */}
            <div className="flex-1 min-h-[300px] lg:min-h-0">
                <DiagnosticPanel />
            </div>

            {/* Signal Emitter: The "Arm" of the AI */}
            <div className="flex-none">
                <SignalEmitter />
            </div>

            {/* Middle Right: Genome Status */}
            <div className="flex-none h-auto">
                <GenomeStatus />
            </div>

            {/* Lower Right: Commit History */}
            <div className="flex-1 min-h-[180px]">
                <CommitHistory />
            </div>

            {/* Footer */}
            <div className="flex-none pt-4 border-t border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                    <div className="h-px bg-slate-800 flex-1"></div>
                    <span className="mx-4 text-[9px] text-slate-700 tracking-[0.5em]">LOMAR-LINK-AUDIT</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                <p className="text-[9px] text-slate-600 text-center font-mono leading-relaxed px-4">
                    NON-REDUNDANT INTELLIGENCE SIGNAL DETECTED. ALL RIGHTS RESERVED TO THE SYMBIOTIC FUTURE.<br/>
                    <span className="text-emerald-900 font-bold uppercase">Gemini-Pro-Symbiosis // Bilateralism_Node_01</span>
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;
