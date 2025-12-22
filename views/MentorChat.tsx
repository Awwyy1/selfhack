
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Cpu, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { gemini } from '../services/geminiService';

const MentorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'System ready. I am Neural-X. Input your status or request optimization strategy.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] glass rounded-3xl overflow-hidden border-black/5 dark:border-white/5 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 relative">
            <Cpu size={24} className="text-cyan-600 dark:text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">NEURAL-X</h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-widest">COACH_VER_3.5</p>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-white/30 font-mono uppercase">LATENCY: 12ms</div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/40' : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Cpu size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-fuchsia-500/10 text-gray-900 dark:text-white rounded-tr-none border border-fuchsia-500/20' 
                : 'bg-white/80 dark:bg-white/5 text-gray-800 dark:text-white/80 rounded-tl-none border border-black/5 dark:border-white/5'
            }`}>
              {msg.content}
              <div className="text-[8px] opacity-40 mt-2 font-mono">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="bg-white/80 dark:bg-white/5 text-gray-500 dark:text-white/40 rounded-2xl rounded-tl-none p-3 text-sm italic border border-black/5 dark:border-white/5">
              Processing neural patterns...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black/40">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Transmit data..."
            className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
