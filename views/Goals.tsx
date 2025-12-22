import React, { useState, useMemo } from 'react';
import { Goal } from '../types';
import { Target, Calendar, Plus, Trash2, CheckCircle, Clock, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const analyzedGoals = useMemo(() => {
    return goals.map(g => {
      const daysLeft = getDaysLeft(g.deadline);
      let status: 'stable' | 'urgent' | 'critical' = 'stable';
      if (!g.completed) {
        if (daysLeft < 0) status = 'critical';
        else if (daysLeft <= 1) status = 'urgent';
      }
      return { ...g, daysLeft, status };
    }).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const statusWeight = { critical: 0, urgent: 1, stable: 2 };
      return statusWeight[a.status] - statusWeight[b.status];
    });
  }, [goals]);

  const criticalCount = analyzedGoals.filter(g => !g.completed && g.status === 'critical').length;
  const urgentCount = analyzedGoals.filter(g => !g.completed && g.status === 'urgent').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white neon-glow">GOALS</h2>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-mono tracking-[0.2em] uppercase">Sector Management & Priority Alignment</p>
      </div>

      {/* Neural Alerts Banner */}
      {(criticalCount > 0 || urgentCount > 0) && (
        <div className={`glass rounded-2xl p-4 border-l-4 relative overflow-hidden ${
          criticalCount > 0 ? 'border-l-red-500 bg-red-500/5' : 'border-l-amber-500 bg-amber-500/5'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert size={64} className={criticalCount > 0 ? 'text-red-500' : 'text-amber-500'} />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center animate-pulse ${
              criticalCount > 0 ? 'bg-red-500/20 text-red-600 dark:text-red-500' : 'bg-amber-500/20 text-amber-600 dark:text-amber-500'
            }`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className={`text-xs font-black uppercase tracking-widest ${
                criticalCount > 0 ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                {criticalCount > 0 ? 'Critical System Failure' : 'Neural Desync Imminent'}
              </h4>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold">
                {criticalCount > 0 && `${criticalCount} objectives overdue.`} {urgentCount > 0 && `${urgentCount} sectors require immediate sync.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Toggle */}
      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-4 glass border-dashed border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          Initialize New Objective
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 space-y-4 animate-in zoom-in-95 duration-300 border-cyan-500/40 bg-white/80 dark:bg-transparent">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Objective Name</label>
            <input 
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input target parameters..."
              className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Target Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={16} />
              <input 
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 appearance-none text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              Abort
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
            >
              Set Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {analyzedGoals.length === 0 ? (
          <div className="p-16 text-center glass rounded-3xl border-dashed">
            <Target className="mx-auto text-slate-200 dark:text-white/5 mb-4" size={48} />
            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-mono uppercase tracking-[0.3em]">No objectives active in local sector.</p>
          </div>
        ) : (
          analyzedGoals.map((goal) => {
            const isCritical = goal.status === 'critical';
            const isUrgent = goal.status === 'urgent';
            
            return (
              <div 
                key={goal.id}
                className={`glass rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group border-l-4 ${
                  goal.completed 
                    ? 'border-l-green-500 opacity-60' 
                    : isCritical 
                      ? 'border-l-red-500 bg-red-500/[0.02]' 
                      : isUrgent
                        ? 'border-l-amber-500 bg-amber-500/[0.02]'
                        : 'border-l-cyan-500'
                }`}
              >
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <button 
                    onClick={() => onToggleGoal(goal.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      goal.completed 
                        ? 'bg-green-500 border-green-500 text-white dark:text-black shadow-lg' 
                        : isCritical
                          ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-600 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                  >
                    <CheckCircle size={24} className={goal.completed ? 'scale-110' : 'scale-90 transition-transform group-hover:scale-100'} />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className={`font-black uppercase tracking-tight text-base ${goal.completed ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                        {goal.title}
                      </h3>
                      {!goal.completed && isCritical && (
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-red-600 text-white font-black uppercase">Overdue</span>
                      )}
                      {!goal.completed && isUrgent && (
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-amber-500 text-black font-black uppercase">Urgent</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-[9px] font-mono">
                      <div className={`flex items-center gap-1.5 ${isCritical ? 'text-red-600 dark:text-red-400' : isUrgent ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        <Clock size={12} />
                        <span className="uppercase tracking-widest font-bold">
                          {goal.completed ? 'SECURED' : isCritical ? 'OVERDUE' : `${goal.daysLeft}d REMAINING`}
                        </span>
                      </div>
                      <div className="text-slate-300 dark:text-white/10">|</div>
                      <div className="text-slate-400 dark:text-slate-500 uppercase">
                        {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tip Box */}
      <div className="p-4 glass rounded-2xl bg-cyan-500/[0.04] border-cyan-500/10 flex items-start gap-4">
        <div className="p-2 bg-cyan-100 dark:bg-cyan-500/10 rounded-lg text-cyan-600 dark:text-cyan-400">
          <Zap size={18} />
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-widest">Neural Tip</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1 font-mono uppercase font-bold">
            Unfinished goals impact your <span className="text-red-600 dark:text-red-400">XP stability</span>. Synchronize sectors daily to maintain progress flow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Goals;
