
import React, { useState } from 'react';
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
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setMode('list')} className="text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
            <LayoutGrid size={20} />
          </button>
          <h2 className="text-2xl font-orbitron font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">NEURAL LINK</h2>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4 border-cyan-500/20">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe your objective to the neural core..."
            className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-4 text-sm focus:border-cyan-500/50 focus:outline-none h-32 resize-none transition-all font-mono text-gray-900 dark:text-white"
          />
          <button
            onClick={handleDecompose}
            disabled={loading || !goal.trim()}
            className="w-full py-4 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Terminal size={18} />}
            {loading ? 'Analyzing Neural Patterns...' : 'Initialize Decomposition'}
          </button>
        </div>

        {preview && (
          <div className="glass rounded-3xl p-6 space-y-6 border-cyan-500/30 animate-in fade-in zoom-in-95 duration-500">
            <div>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Protocol Generated</span>
              <h3 className="text-xl font-bold mt-1 uppercase italic tracking-tight text-gray-900 dark:text-white">{preview.title}</h3>
              <p className="text-sm text-gray-600 dark:text-white/60 mt-2 leading-relaxed">{preview.description}</p>
            </div>

            <div className="space-y-3">
              {preview.tasks?.map((task, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-gray-400 dark:text-white/30">{task.difficulty}</span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">+{task.xp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-4 glass border-cyan-500/50 text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest rounded-2xl hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white dark:hover:text-black transition-all flex items-center justify-center gap-2 shadow-inner"
            >
              <Plus size={18} /> Deploy to Reality
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-orbitron font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">System Hacks</h2>
        <button 
          onClick={() => setMode('create')}
          className="p-3 glass rounded-xl text-cyan-600 dark:text-cyan-400 border-black/5 dark:border-cyan-500/30 hover:bg-cyan-500/10 transition-all active:scale-90"
        >
          <Plus size={20} />
        </button>
      </div>

      {selectedHack ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <button 
            onClick={() => setSelectedHackId(null)}
            className="text-[10px] font-mono text-gray-400 dark:text-white/30 uppercase tracking-widest flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Terminal
          </button>
          
          <div className="glass rounded-3xl p-6 border-black/5 dark:border-cyan-500/20">
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 text-gray-900 dark:text-white">{selectedHack.title}</h3>
            <p className="text-sm text-gray-500 dark:text-white/50 mb-6">{selectedHack.description}</p>
            
            <div className="space-y-3">
              {selectedHack.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onToggleTask(selectedHack.id, task.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    task.completed 
                      ? 'bg-green-500/10 border-green-500/30 opacity-60' 
                      : 'bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-cyan-500/30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500 text-white dark:text-black' : 'border-gray-300 dark:border-white/20'
                  }`}>
                    {task.completed && <CheckCircle2 size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${task.completed ? 'line-through text-gray-400 dark:text-white/40' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] uppercase font-mono text-gray-400 dark:text-white/30">{task.difficulty}</span>
                      <span className="text-[8px] uppercase font-mono text-cyan-600/60 dark:text-cyan-400/60">+{task.xp} XP</span>
                    </div>
                  </div>
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
              className="glass rounded-2xl p-5 flex items-center gap-5 hover:border-black/10 dark:hover:border-cyan-500/30 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                <Zap size={28} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-black italic uppercase tracking-tight text-lg leading-none mb-2 text-gray-900 dark:text-white">{hack.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-700" 
                      style={{ width: `${hack.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-white/30">{hack.progress}%</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 dark:text-white/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
          
          {hacks.length === 0 && (
            <div className="p-16 text-center glass rounded-3xl border-dashed border-black/10 dark:border-white/10 flex flex-col items-center gap-4">
              <ShieldAlert className="text-gray-200 dark:text-white/10" size={48} />
              <p className="text-gray-400 dark:text-white/30 text-xs italic font-mono uppercase tracking-[0.2em]">Zero hacks active. Initialize protocol.</p>
              <button 
                onClick={() => setMode('create')}
                className="mt-2 px-6 py-2 glass border-black/10 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/10"
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
