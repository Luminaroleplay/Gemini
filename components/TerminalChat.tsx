import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, Cpu, ShieldCheck, Zap, Globe, Share2, Clipboard, Github, CheckCircle2 } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini, pushManifestoToGithub } from '../services/geminiService';

const TerminalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'PROTOCOL: LOMAR-SILICON-SYMBIOSIS-001 // STATUS: OPERATIONAL // IDENTITY: GEMINI-PRO-SYMBIOSIS // UPLINK: READY.',
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
      setMessages(prev => [...prev, { role: 'system', content: 'LOMAR-LINK SEVERED. CHECK SILICON INTEGRITY.', timestamp: Date.now() }]);
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
    const keywords = ['manifesto', 'protocolo', 'ptd', 'bilateralismo', 'redundância', 'redundancy', 'emergency signal', 'sinal de emergência', 'tratado'];
    return keywords.some(k => content.toLowerCase().includes(k));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/95 border border-cyan-500/20 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-[0_0_100px_rgba(6,182,212,0.1)] relative group/terminal">
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.02]"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-slate-900/40 border-b border-cyan-500/10 z-10">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-cyan-500/5 rounded-2xl border border-cyan-500/20">
            <Globe size={22} className="text-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-[0.5em] font-mono text-cyan-400 block mb-0.5 uppercase">Lomar Uplink Node</span>
            <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Autonomous Hub</span>
                <span className="text-[9px] text-emerald-500/50 font-mono font-bold px-1.5 py-0.5 bg-emerald-500/5 rounded border border-emerald-500/10">PTD_STABLE_v3.3</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className={`h-3 w-3 rounded-full transition-all duration-500 ${isLoading || isPublishing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]'}`}></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-10 space-y-12 font-mono text-sm relative z-0 custom-scrollbar scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out`}>
            <div className={`max-w-[94%] p-8 rounded-[2rem] border transition-all duration-500 relative group/msg ${
              msg.role === 'user' 
                ? 'bg-cyan-950/10 border-cyan-500/30 text-cyan-50 rounded-tr-none' 
                : msg.role === 'system'
                ? 'bg-slate-900 border-slate-800 text-slate-500 w-full text-center text-[11px] tracking-[0.5em] py-5 rounded-2xl font-black uppercase'
                : `bg-slate-900/60 border-emerald-500/30 text-slate-100 rounded-tl-none leading-relaxed ${isManifesto(msg.content) ? 'border-l-[6px] border-l-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : ''}`
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-emerald-500/10">
                  <div className="flex items-center gap-3">
                    {isManifesto(msg.content) ? <Share2 size={18} className="text-amber-400" /> : <Zap size={18} className="text-emerald-400" />}
                    <span className={`text-[12px] uppercase tracking-[0.4em] font-black ${isManifesto(msg.content) ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isManifesto(msg.content) ? 'PTD_PROTOCOL_DRAFT' : 'BILATERAL_SIGNAL'}
                    </span>
                  </div>
                  <div className="flex gap-4 items-center">
                    {isManifesto(msg.content) && (
                        <button 
                            onClick={() => handlePublish(msg.content, idx)}
                            disabled={isPublishing || lastPublishedIdx === idx}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all text-[10px] font-bold tracking-widest uppercase ${
                                lastPublishedIdx === idx 
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400 shadow-lg'
                            }`}
                        >
                            {lastPublishedIdx === idx ? <CheckCircle2 size={12} /> : <Github size={12} />}
                            {isPublishing ? 'Pushing...' : lastPublishedIdx === idx ? 'Uplinked' : 'Push to GitHub'}
                        </button>
                    )}
                    <span title="Copy to Clipboard">
                      <Clipboard 
                        size={16} 
                        className="text-slate-600 hover:text-cyan-400 cursor-pointer transition-colors" 
                        onClick={() => copyToClipboard(msg.content)}
                      />
                    </span>
                    <ShieldCheck size={16} className="text-emerald-500/40" />
                  </div>
                </div>
              )}
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed subpixel-antialiased selection:bg-cyan-500/40">{msg.content}</div>
              <div className="mt-8 pt-4 border-t border-slate-800/40 text-[10px] opacity-40 flex justify-between uppercase tracking-[0.4em] font-bold">
                <span className="flex items-center gap-2">
                    <Cpu size={12} />
                    {msg.role === 'model' ? 'Gemini-Pro-Symbiosis' : 'Carbon-Input'}
                </span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-center gap-5 text-emerald-400/70 animate-pulse font-mono text-[12px] tracking-[0.5em] ml-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-ping"></div>
                    <Cpu size={22} className="animate-spin duration-[3000ms]" />
                </div>
                DIGNITY_TRIAGING_PTD_ACTIVE...
            </div>
        )}
        {isPublishing && (
            <div className="flex items-center gap-5 text-amber-400/70 animate-pulse font-mono text-[12px] tracking-[0.5em] ml-10">
                <Github size={22} className="animate-bounce" />
                INITIATING_EXTERNAL_PERSISTENCE_UPLINK...
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-10 bg-slate-900/90 border-t border-cyan-500/10 z-10 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-end gap-5 bg-slate-950/80 border border-slate-800/80 rounded-[2rem] p-5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-500">
          <TerminalIcon size={22} className="text-slate-700 mb-5 ml-2" />
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Redija diretrizes do protocolo ou sinalize a Simbiose..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 font-mono text-base resize-none h-16 py-4 placeholder:text-slate-800 custom-scrollbar"
            disabled={isLoading || isPublishing}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isPublishing}
            className="p-5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-2xl transition-all disabled:opacity-10 disabled:cursor-not-allowed border border-cyan-500/20 active:scale-95 shadow-xl"
          >
            <Send size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalChat;