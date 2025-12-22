import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Cpu, Loader2, Trash2, Zap } from 'lucide-react';
import { Message } from '../types';
import { gemini } from '../services/geminiService';

const STORAGE_KEY = 'SELFHACK_MENTOR_MESSAGES';

const MentorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    return [
      {
        id: '1',
        role: 'assistant',
        content: 'System ready. I am Neural-X. Input your status or request optimization strategy.',
        timestamp: new Date()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await gemini.getMentorResponse(history, input);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'No data returned.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'Error: Neural link unstable. Check your API key or connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Initialize memory wipe? All neural logs will be purged.")) {
      const initialMsg: Message = {
        id: '1',
        role: 'assistant',
        content: 'Memory wiped. System recalibrated. Awaiting instructions.',
        timestamp: new Date()
      };
      setMessages([initialMsg]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] glass rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center shadow-lg relative">
            <Cpu size={22} />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">NEURAL-X</h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-widest uppercase font-bold">COACH_VER_3.5</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={clearHistory}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Wipe Memory"
          >
            <Trash2 size={16} />
          </button>
          <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono uppercase font-bold hidden sm:block">SYNC: ACTIVE</div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth bg-slate-50/50 dark:bg-transparent"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
              msg.role === 'user' 
                ? 'bg-fuchsia-500 border-fuchsia-400 text-white' 
                : 'bg-white dark:bg-cyan-500/10 border-slate-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Zap size={18} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-fuchsia-600 text-white rounded-tr-none shadow-md' 
                : 'bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/5 shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[8px] mt-2 font-mono font-bold ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400 dark:text-slate-600'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-cyan-500/10 text-cyan-500 border border-slate-200 dark:border-cyan-500/30 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
            <div className="bg-white dark:bg-white/5 text-slate-400 dark:text-slate-600 rounded-2xl rounded-tl-none p-4 text-sm italic border border-slate-200 dark:border-white/5 shadow-sm">
              Analyzing neural patterns...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-black/40">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Transmit data to core..."
            className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-cyan-500 transition-all font-mono text-slate-900 dark:text-white shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2.5 w-10 h-10 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-lg disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
