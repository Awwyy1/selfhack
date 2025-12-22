
import React, { useState, useCallback } from 'react';
import { Zap, Loader2, Plus, CheckCircle2, ShieldAlert, ChevronRight, LayoutGrid, Terminal } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { Hack, Task } from '../types';

interface HackEngineProps {
  hacks: Hack[];
  onAddHack: (hack: Hack) => void;
  onToggleTask: (hackId: string, taskId: string) => void;
}

const HackEngine: React.FC<HackEngineProps> = ({ hacks, onAddHack, onToggleTask }) => {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Partial<Hack> | null>(null);
  const [selectedHackId, setSelectedHackId] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  // Synthesize a clean, high-tech success chime
  const playSuccessSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Quick frequency slide for that "achievement" feel
      osc.frequency.setValueAtTime(880, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context might be blocked by browser policy until user interaction
      console.debug("Audio feedback suppressed", e);
    }
  }, []);

  const handleToggle = (hackId: string, taskId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      // Trigger satisfaction effects only when completing
      setCompletingTaskId(taskId);
      playSuccessSound();
      // Remove animation class after it finishes
      setTimeout(() => setCompletingTaskId(null), 600);
    }
    onToggleTask(hackId, taskId);
  };

  const handleDecompose = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setPreview(null);
    try {
      const result = await gemini.decomposeGoal(goal);
      setPreview(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!preview) return;
    const newHack: Hack = {
      id: Math.random().toString(36).substr(2, 9),
      title: preview.title || 'Unknown Hack',
      description: preview.description || '',
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      tasks: (preview.tasks || []).map((t: any) => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9),
        completed: false
      }))
    };
    onAddHack(newHack);
    setPreview(null);
    setGoal('');
    setMode('list');
  };

  const selectedHack = hacks.find(h => h.id === selectedHackId);

  if (mode === 'create') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setMode('list')} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border-black/5 dark:border-white/10">
            <LayoutGrid size={20} />
          </button>
          <h2 className="text-2xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">NEURAL LINK</h2>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4 border-cyan-500/20 bg-white dark:bg-transparent">
          <textarea
            autoFocus
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe your objective to the neural core..."
            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-sm focus:border-cyan-500 focus:outline-none h-40 resize-none transition-all font-mono text-slate-900 dark:text-white"
          />
          <button
            onClick={handleDecompose}
            disabled={loading || !goal.trim()}
            className="w-full py-5 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Terminal size={20} />}
            {loading ? 'Analyzing Neural Patterns...' : 'Initialize Decomposition'}
          </button>
        </div>

        {preview && (
          <div className="glass rounded-3xl p-6 space-y-6 border-cyan-500/30 animate-in zoom-in-95 duration-500 shadow-2xl bg-white/90 dark:bg-transparent">
            <div>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-black">Protocol Generated</span>
              <h3 className="text-xl font-bold mt-1 uppercase italic tracking-tight text-slate-900 dark:text-white">{preview.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{preview.description}</p>
            </div>

            <div className="space-y-3">
              {preview.tasks?.map((task, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-xs font-black text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{task.title}</p>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-bold">{task.difficulty}</span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-black">+{task.xp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-5 glass border-cyan-500/50 text-cyan-700 dark:text-cyan-400 font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus size={20} /> Deploy Protocol
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white neon-glow">HACK ENGINE</h2>
        <button 
          onClick={() => setMode('create')}
          className="w-12 h-12 glass rounded-xl text-cyan-600 dark:text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 transition-all active:scale-90 flex items-center justify-center shadow-lg shadow-cyan-500/10"
        >
          <Plus size={24} />
        </button>
      </div>

      {selectedHack ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          <button 
            onClick={() => setSelectedHackId(null)}
            className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors font-black"
          >
            ← TERMINAL_ROOT
          </button>
          
          <div className="glass rounded-3xl p-6 border-cyan-500/20 shadow-2xl bg-white dark:bg-transparent">
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 text-slate-900 dark:text-white">{selectedHack.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">{selectedHack.description}</p>
            
            <div className="space-y-3">
              {selectedHack.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleToggle(selectedHack.id, task.id, task.completed)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left shadow-sm relative overflow-hidden group ${
                    task.completed 
                      ? 'bg-green-500/5 border-green-500/30 opacity-70' 
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-cyan-500/30'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all relative z-10 ${
                    task.completed ? 'bg-green-500 border-green-500 text-white dark:text-black shadow-inner' : 'border-slate-300 dark:border-white/20 bg-white dark:bg-transparent'
                  }`}>
                    {task.completed && <CheckCircle2 size={18} />}
                    {/* Visual Pulse Effect */}
                    {completingTaskId === task.id && (
                      <div className="absolute inset-0 rounded-lg border-4 border-green-400 animate-ping opacity-75" />
                    )}
                  </div>
                  <div className="flex-1 relative z-10">
                    <p className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>{task.title}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-400 dark:text-slate-600">{task.difficulty}</span>
                      <span className="text-[9px] uppercase font-mono font-black text-cyan-600 dark:text-cyan-400/60">+{task.xp} XP</span>
                    </div>
                  </div>
                  
                  {/* Subtle Success Glow Background */}
                  {task.completed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {hacks.map(hack => (
            <div 
              key={hack.id}
              onClick={() => setSelectedHackId(hack.id)}
              className="glass rounded-2xl p-5 flex items-center gap-5 hover:border-cyan-500/50 transition-all cursor-pointer group active:scale-[0.98] bg-white/40 dark:bg-transparent"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-cyan-500/10 transition-all shadow-sm">
                <Zap size={32} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-black italic uppercase tracking-tight text-xl leading-none mb-3 text-slate-900 dark:text-white">{hack.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-md" 
                      style={{ width: `${hack.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{hack.progress}%</span>
                </div>
              </div>
              <ChevronRight size={22} className="text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
          
          {hacks.length === 0 && (
            <div className="p-20 text-center glass rounded-3xl border-dashed flex flex-col items-center gap-5">
              <ShieldAlert className="text-slate-200 dark:text-white/10" size={56} />
              <div className="space-y-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs italic font-mono uppercase tracking-[0.3em] font-black">Zero hacks detected.</p>
                <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase font-mono">Initialize neural link to proceed.</p>
              </div>
              <button 
                onClick={() => setMode('create')}
                className="mt-4 px-8 py-3 glass border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-[11px] font-black uppercase tracking-widest hover:bg-cyan-500/10 shadow-lg"
              >
                Launch Neural Link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HackEngine;
