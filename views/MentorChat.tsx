import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Cpu, Loader2, Trash2, Zap, AlertTriangle, Crown } from 'lucide-react';
import { Message } from '../types';
import { gemini } from '../services/geminiService';
import { chatService } from '../services/chatService';

interface MentorChatProps {
  userId: string;
  remainingMessages: number;
  onUpgrade: () => void;
}

const MentorChat: React.FC<MentorChatProps> = ({ userId, remainingMessages, onUpgrade }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [limitError, setLimitError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages from Supabase on mount
  useEffect(() => {
    const loadMessages = async () => {
      const dbMessages = await chatService.getMessages(userId);
      if (dbMessages.length > 0) {
        setMessages(dbMessages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at)
        })));
      } else {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'System ready. I am Neural-X. Input your status or request optimization strategy.',
          timestamp: new Date()
        }]);
      }
      setInitialLoading(false);
    };
    loadMessages();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setLimitError(null);

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
      const response = await gemini.getMentorResponse(userId, history, input);

      if (response.error) {
        setLimitError(response.error);
        const errorMsg: Message = {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: response.error,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      } else if (response.text) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'Error: Neural link unstable. Check your connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm("Initialize memory wipe? All neural logs will be purged.")) {
      await chatService.clearHistory(userId);
      const initialMsg: Message = {
        id: '1',
        role: 'assistant',
        content: 'Memory wiped. System recalibrated. Awaiting instructions.',
        timestamp: new Date()
      };
      setMessages([initialMsg]);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

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
          {/* Message Counter */}
          <div className={`text-[10px] font-mono uppercase font-bold px-2 py-1 rounded ${
            remainingMessages <= 5
              ? 'text-red-500 bg-red-500/10'
              : remainingMessages <= 20
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-slate-400 dark:text-slate-600'
          }`}>
            {remainingMessages} msgs left
          </div>
          <button
            onClick={clearHistory}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Wipe Memory"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Limit Warning */}
      {remainingMessages <= 5 && remainingMessages > 0 && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500" />
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono uppercase">Low message quota. Upgrade for more.</span>
          <button onClick={onUpgrade} className="ml-auto text-[10px] text-amber-500 font-bold hover:underline">UPGRADE</button>
        </div>
      )}

      {/* Limit Reached */}
      {remainingMessages === 0 && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500" />
          <div className="flex-1">
            <span className="text-xs text-red-600 dark:text-red-400 font-bold">Message limit reached</span>
            <p className="text-[10px] text-red-500/70">Upgrade your plan to continue chatting.</p>
          </div>
          <button
            onClick={onUpgrade}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            <Crown size={12} /> UPGRADE
          </button>
        </div>
      )}

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
            placeholder={remainingMessages === 0 ? "Upgrade to continue..." : "Transmit data to core..."}
            disabled={remainingMessages === 0}
            className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-cyan-500 transition-all font-mono text-slate-900 dark:text-white shadow-inner disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || remainingMessages === 0}
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
