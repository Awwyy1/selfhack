
import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Calendar, Plus, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'completed' | 'createdAt'>) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, onAddGoal, onToggleGoal, onDeleteGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;
    onAddGoal({ title, deadline });
    setTitle('');
    setDeadline('');
    setIsAdding(false);
  };

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter">GOALS</h2>
        <p className="text-white/40 text-sm">Strategic objectives for reality re-alignment.</p>
      </div>

      {/* Add Goal Toggle */}
      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-4 glass border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest rounded-2xl hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          Initialize New Objective
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Objective Name</label>
            <input 
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master React 19"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Final Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-cyan-500/50 appearance-none text-white/80"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
            >
              Abort
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
            >
              Set Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="p-12 text-center glass rounded-3xl border-dashed border-white/10">
            <Target className="mx-auto text-white/10 mb-4" size={48} />
            <p className="text-white/40 text-sm italic">No active objectives detected in your sector.</p>
          </div>
        ) : (
          goals.sort((a, b) => Number(a.completed) - Number(b.completed)).map((goal) => {
            const daysLeft = getDaysLeft(goal.deadline);
            const isLate = daysLeft < 0 && !goal.completed;
            
            return (
              <div 
                key={goal.id}
                className={`glass rounded-2xl p-4 transition-all duration-300 relative overflow-hidden group border-l-4 ${
                  goal.completed 
                    ? 'border-l-green-500 opacity-60' 
                    : isLate 
                      ? 'border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                      : 'border-l-cyan-500'
                }`}
              >
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <button 
                    onClick={() => onToggleGoal(goal.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      goal.completed 
                        ? 'bg-green-500/20 border-green-500 text-green-500' 
                        : 'bg-white/5 border-white/10 text-white/20 hover:border-cyan-500/50 hover:text-cyan-400'
                    }`}
                  >
                    <CheckCircle size={20} className={goal.completed ? 'scale-110' : 'scale-90'} />
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm ${goal.completed ? 'line-through text-white/40' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
                      <div className={`flex items-center gap-1 ${isLate ? 'text-red-400 animate-pulse' : 'text-white/40'}`}>
                        <Clock size={10} />
                        {goal.completed ? 'COMPLETED' : `${daysLeft}d REMAINING`}
                      </div>
                      <div className="text-white/20">|</div>
                      <div className="text-white/40 uppercase">
                        DL: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Achievement Highlight on Hover */}
                {!goal.completed && (
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertTriangle size={12} className="text-yellow-500/30" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tip Box */}
      <div className="p-4 glass rounded-2xl bg-cyan-500/5 border-cyan-500/20 flex items-start gap-4">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Target className="text-cyan-400" size={16} />
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Efficiency Protocol</h4>
          <p className="text-[10px] text-white/60 leading-relaxed mt-1">
            Setting clear deadlines reduces cognitive friction. Complete 3 objectives to unlock the <span className="text-cyan-400 font-bold">"Reality Shifter"</span> badge in your Vault.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Goals;
