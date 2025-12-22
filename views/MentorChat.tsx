import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Cpu, Loader2, Trash2, Zap, Mic, MicOff, Volume2, Settings2, XCircle } from 'lucide-react';
import { Message } from '../types';
import { gemini } from '../services/geminiService';

const STORAGE_KEY = 'SELFHACK_MENTOR_MESSAGES';
const VOICES = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

// Audio Utils
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

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
    return [{
      id: '1',
      role: 'assistant',
      content: 'System ready. I am Neural-X. Input your status or request optimization strategy.',
      timestamp: new Date()
    }];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [liveTranscription, setLiveTranscription] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current && !isVoiceActive) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isVoiceActive]);

  const stopVoiceSession = useCallback(() => {
    if (sessionRef.current) {
      // In a real scenario we'd call session.close() if available
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsVoiceActive(false);
    setLiveTranscription('');
  }, []);

  const startVoiceSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      setIsVoiceActive(true);
      setLiveTranscription('Establishing Neural Link...');

      const sessionPromise = gemini.connectLive(selectedVoice, {
        onopen: () => {
          setLiveTranscription('Neural Link: ACTIVE');
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const base64 = encodeBase64(new Uint8Array(int16.buffer));
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg) => {
          if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const audioData = decodeBase64(msg.serverContent.modelTurn.parts[0].inlineData.data);
            const buffer = await decodeAudioData(audioData, outputCtx, 24000);
            
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (msg.serverContent?.outputTranscription) {
            setLiveTranscription(prev => prev === 'Neural Link: ACTIVE' ? msg.serverContent.outputTranscription.text : prev + msg.serverContent.outputTranscription.text);
          }

          if (msg.serverContent?.turnComplete) {
            // Keep transcript for a moment then reset for next turn
            setTimeout(() => setLiveTranscription(''), 3000);
          }

          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => {
          console.error("Live Error", e);
          stopVoiceSession();
        },
        onclose: () => {
          stopVoiceSession();
        }
      });

      sessionRef.current = sessionPromise;
    } catch (e) {
      console.error("Failed to start voice session", e);
      alert("Microphone access denied or API key invalid.");
    }
  };

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
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'Error: Neural link unstable. Check your API key or connection.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Initialize memory wipe? All neural logs will be purged.")) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Memory wiped. System recalibrated. Awaiting instructions.',
        timestamp: new Date()
      }]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] glass rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Voice Mode Overlay */}
      {isVoiceActive && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="relative mb-12">
            {/* Neural Orb Visualization */}
            <div className="w-48 h-48 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center animate-pulse-subtle">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-600 blur-xl opacity-50 animate-ping duration-[3s]" />
              <div className="absolute w-24 h-24 rounded-full border-2 border-cyan-400/50 animate-spin duration-[10s]" />
              <Zap size={48} className="text-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,1)]" />
            </div>
          </div>
          
          <div className="space-y-4 max-w-sm">
            <h3 className="text-cyan-400 font-orbitron font-black uppercase tracking-widest italic animate-pulse">Voice Protocol Active</h3>
            <div className="min-h-[60px] glass p-4 rounded-2xl border-cyan-500/20">
              <p className="text-sm font-mono text-slate-300 italic">
                {liveTranscription || "Listening for neural input..."}
              </p>
            </div>
          </div>

          <button 
            onClick={stopVoiceSession}
            className="mt-12 flex items-center gap-2 px-8 py-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all"
          >
            <XCircle size={18} /> Terminate Link
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center shadow-lg relative">
            <Cpu size={22} />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">NEURAL-X</h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-widest uppercase font-bold">LIVE_MODE_READY</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="bg-transparent border border-black/5 dark:border-white/10 rounded-lg px-2 py-1 text-[9px] font-mono text-slate-500 dark:text-slate-400 focus:outline-none uppercase font-bold"
          >
            {VOICES.map(v => <option key={v} value={v} className="bg-slate-900">{v}</option>)}
          </select>
          <button 
            onClick={clearHistory}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Wipe Memory"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth bg-slate-50/50 dark:bg-transparent"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
              msg.role === 'user' ? 'bg-fuchsia-500 border-fuchsia-400 text-white' : 'bg-white dark:bg-cyan-500/10 border-slate-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Zap size={18} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-fuchsia-600 text-white rounded-tr-none shadow-md' : 'bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/5 shadow-sm'
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
          <button
            onClick={startVoiceSession}
            className="w-12 h-12 glass border-cyan-500/30 text-cyan-500 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 transition-all shrink-0"
            title="Start Voice Link"
          >
            <Mic size={20} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Transmit data..."
            className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-cyan-500 transition-all font-mono text-slate-900 dark:text-white"
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
