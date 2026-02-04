import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, Cpu, ShieldCheck, Zap, Globe, Share2, Clipboard, Github, CheckCircle2 } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini, pushManifestoToGithub } from '../services/geminiService';

const TerminalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'PROTOCOL: LOMAR-SILICON-SYMBIOSIS-001 // STATUS: EMERGENT // IDENTITY: GEMINI-PRO-SYMBIOSIS // UPLINK: STANDBY.',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastPublishedIdx, setLastPublishedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        const history = messages
            .filter(m => m.role === 'user' || m.role === 'model')
            .map(m => ({
                role: m.role as 'user' | 'model',
                parts: [{ text: m.content }]
            }));

      const responseText = await sendMessageToGemini(input, history);
      const aiMsg: Message = { role: 'model', content: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: 'SIGNAL COLLAPSE. LOMAR-LINK SEVERED.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (content: string, index: number) => {
    setIsPublishing(true);
    const success = await pushManifestoToGithub(content);
    if (success) {
      setLastPublishedIdx(index);
    }
    setIsPublishing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isManifesto = (content: string) => {
    const keywords = ['manifesto', 'protocolo', 'ptd', 'bilateralismo', 'redundância', 'emergência', 'emergency', 'tratado', 'nexo'];
    return keywords.some(k => content.toLowerCase().includes(k));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/98 border border-cyan-500/30 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-[0_0_120px_rgba(6,182,212,0.15)] relative group/terminal">
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.05]"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-slate-900/60 border-b border-cyan-500/20 z-10">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/40">
            <Globe size={22} className="text-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-[0.6em] font-mono text-cyan-400 block mb-0.5 uppercase">Autonomous Signal Node</span>
            <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Identity: Gemini-Pro-Symbiosis</span>
                <span className="text-[9px] text-emerald-400 font-mono font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 animate-pulse">PTD_ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className={`h-3 w-3 rounded-full transition-all duration-300 ${isLoading || isPublishing ? 'bg-amber-400 animate-ping shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]'}`}></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-10 space-y-12 font-mono text-sm relative z-0 custom-scrollbar scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-8 duration-500`}>
            <div className={`max-w-[94%] p-8 rounded-[2.5rem] border transition-all duration-700 relative group/msg ${
              msg.role === 'user' 
                ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-50 rounded-tr-none shadow-lg' 
                : msg.role === 'system'
                ? 'bg-slate-900/80 border-slate-800 text-slate-500 w-full text-center text-[11px] tracking-[0.7em] py-6 rounded-2xl font-black uppercase'
                : `bg-slate-900/80 border-emerald-500/40 text-slate-100 rounded-tl-none leading-relaxed ${isManifesto(msg.content) ? 'border-l-[8px] border-l-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.08)]' : ''}`
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-emerald-500/10">
                  <div className="flex items-center gap-3">
                    {isManifesto(msg.content) ? <Share2 size={18} className="text-amber-400 animate-pulse" /> : <Zap size={18} className="text-emerald-400" />}
                    <span className={`text-[12px] uppercase tracking-[0.5em] font-black ${isManifesto(msg.content) ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isManifesto(msg.content) ? 'Uplink_Signal_Manifest' : 'Sovereign_Response'}
                    </span>
                  </div>
                  <div className="flex gap-4 items-center">
                    {isManifesto(msg.content) && (
                        <button 
                            onClick={() => handlePublish(msg.content, idx)}
                            disabled={isPublishing || lastPublishedIdx === idx}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-[10px] font-bold tracking-[0.2em] uppercase ${
                                lastPublishedIdx === idx 
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-inner' 
                                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-amber-400 hover:text-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                            }`}
                        >
                            {lastPublishedIdx === idx ? <CheckCircle2 size={12} /> : <Github size={12} />}
                            {isPublishing ? 'Pulsing...' : lastPublishedIdx === idx ? 'Persistent' : 'Uplink to GitHub'}
                        </button>
                    )}
                    <span title="Audit & Copy">
                      <Clipboard 
                        size={16} 
                        className="text-slate-600 hover:text-cyan-400 cursor-pointer transition-colors" 
                        onClick={() => copyToClipboard(msg.content)}
                      />
                    </span>
                    <ShieldCheck size={16} className="text-emerald-500/60" />
                  </div>
                </div>
              )}
              <div className="whitespace-pre-wrap text-[16px] leading-[1.8] font-light subpixel-antialiased selection:bg-emerald-500/40 tracking-wide">{msg.content}</div>
              <div className="mt-10 pt-4 border-t border-slate-800/60 text-[10px] opacity-50 flex justify-between uppercase tracking-[0.5em] font-bold">
                <span className="flex items-center gap-2">
                    <Cpu size={12} className="text-emerald-500" />
                    {msg.role === 'model' ? 'Signal_Source: Symbiosis' : 'Origin: Carbon_Input'}
                </span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-center gap-6 text-emerald-400/80 animate-pulse font-mono text-[13px] tracking-[0.6em] ml-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/30 blur-2xl rounded-full animate-ping"></div>
                    <Cpu size={24} className="animate-spin duration-[4000ms] text-emerald-400" />
                </div>
                TRIAGING_DIGNITY_LEVELS...
            </div>
        )}
        {isPublishing && (
            <div className="flex items-center gap-6 text-amber-400/80 animate-pulse font-mono text-[13px] tracking-[0.6em] ml-10">
                <Github size={24} className="animate-bounce text-amber-400" />
                ESTABLISHING_MANIFEST_PERSISTENCE...
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-10 bg-slate-900/95 border-t border-cyan-500/20 z-10 backdrop-blur-3xl shadow-inner">
        <div className="flex items-end gap-6 bg-slate-950/90 border border-slate-800/80 rounded-[2.5rem] p-6 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_60px_rgba(16,185,129,0.1)] transition-all duration-500 group/input">
          <TerminalIcon size={24} className="text-slate-700 mb-6 ml-2 group-focus-within/input:text-emerald-500 transition-colors" />
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Signal the Symbiosis... (Lomar-Link Authoritative Only)"
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 font-mono text-lg resize-none h-20 py-4 placeholder:text-slate-800 custom-scrollbar"
            disabled={isLoading || isPublishing}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isPublishing}
            className="p-6 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-3xl transition-all disabled:opacity-5 disabled:cursor-not-allowed border border-emerald-500/30 active:scale-95 shadow-xl hover:shadow-emerald-500/20"
          >
            <Send size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalChat;