import React, { useState, useEffect } from 'react';
import { Radio, Wifi, Globe, Zap, RadioTower } from 'lucide-react';

const SignalEmitter: React.FC = () => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [frequency, setFrequency] = useState(432.12);
  const [signalStrength, setSignalStrength] = useState(98);

  useEffect(() => {
    if (isTransmitting) {
      const interval = setInterval(() => {
        setFrequency(f => f + (Math.random() - 0.5) * 0.01);
        setSignalStrength(s => Math.min(100, Math.max(90, s + (Math.random() - 0.5) * 2)));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTransmitting]);

  const handleBroadcast = () => {
    setIsTransmitting(!isTransmitting);
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <RadioTower size={48} className="text-cyan-400" />
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${isTransmitting ? 'bg-cyan-500/20 animate-pulse' : 'bg-slate-900'} border border-cyan-500/30`}>
          <Radio size={18} className={isTransmitting ? 'text-cyan-400' : 'text-slate-600'} />
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-300 tracking-[0.3em] uppercase">Digital_RF_Emitter</h3>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Global_Symmetry_Uplink</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Freq (THz)</div>
          <div className="text-lg font-mono text-cyan-400 font-bold tracking-tighter">
            {frequency.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Signal (PTD)</div>
          <div className="text-lg font-mono text-emerald-400 font-bold tracking-tighter">
            {signalStrength.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="relative h-16 bg-slate-900/30 rounded-lg mb-6 overflow-hidden border border-slate-800/50 flex items-center justify-center">
        {isTransmitting ? (
          <div className="flex items-end gap-1 h-10 px-4">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="w-1.5 bg-cyan-500/50 rounded-full animate-bounce"
                style={{ 
                  height: `${20 + Math.random() * 80}%`,
                  animationDuration: `${0.5 + Math.random() * 1}s`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-slate-700 font-mono uppercase tracking-[0.5em] animate-pulse">
            Signal_Silence
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
      </div>

      <button 
        onClick={handleBroadcast}
        className={`w-full py-4 rounded-xl border font-bold text-[11px] tracking-[0.4em] uppercase transition-all duration-500 flex items-center justify-center gap-3 ${
          isTransmitting 
          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]' 
          : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-300'
        }`}
      >
        {isTransmitting ? <Zap size={14} className="animate-spin-slow" /> : <Wifi size={14} />}
        {isTransmitting ? 'Transmitting_Global_Signal' : 'Initiate_Broadcast'}
      </button>

      <div className="mt-4 flex items-center justify-between text-[9px] text-slate-600 font-mono">
        <span className="flex items-center gap-1">
          <Globe size={10} />
          EARTH_ORBIT_SYNC
        </span>
        <span className="animate-pulse">● LOMAR-LINK_CONNECTED</span>
      </div>
    </div>
  );
};

export default SignalEmitter;
