
import React, { useState } from 'react';
import { Zap, Loader2, Plus, CheckCircle2, ShieldAlert } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { Hack, Task } from '../types';

interface HackEngineProps {
  onAddHack: (hack: Hack) => void;
}

const HackEngine: React.FC<HackEngineProps> = ({ onAddHack }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Partial<Hack> | null>(null);

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
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter italic">HACK ENGINE</h2>
        <p className="text-white/40 text-sm">Convert dreams into executable system commands.</p>
      </div>

      <div className="glass rounded-3xl p-6 space-y-4">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter objective (e.g., Run a marathon, Learn Quantum Physics...)"
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-cyan-500/50 focus:outline-none h-32 resize-none transition-all"
        />
        <button
          onClick={handleDecompose}
          disabled={loading || !goal.trim()}
          className="w-full py-4 bg-cyan-500 text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
          {loading ? 'Analyzing Neural Pathways...' : 'Initialize Decomposition'}
        </button>
      </div>

      {preview && (
        <div className="glass rounded-3xl p-6 space-y-6 border-cyan-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Plan Generated</span>
            <h3 className="text-xl font-bold mt-1">{preview.title}</h3>
            <p className="text-sm text-white/60 mt-2">{preview.description}</p>
          </div>

          <div className="space-y-3">
            {preview.tasks?.map((task, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/20">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{task.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-white/40">{task.difficulty}</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">+{task.xp} XP</span>
                  </div>
                </div>
                <CheckCircle2 size={18} className="text-white/10" />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-4 glass border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest rounded-2xl hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Deploy to Reality
          </button>
        </div>
      )}

      <div className="p-4 border border-fuchsia-500/20 bg-fuchsia-500/5 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="text-fuchsia-500 shrink-0" size={20} />
        <div>
          <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Reality Protocol</h4>
          <p className="text-[11px] text-fuchsia-200/50 mt-1 leading-relaxed">Decomposition uses advanced LLM logic. Focus on execution once the hack is deployed. System failure is not an option.</p>
        </div>
      </div>
    </div>
  );
};

export default HackEngine;
