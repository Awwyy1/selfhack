import React from 'react';
import { NavTab, UserStats, Hack } from '../types';
import { ArrowLeft, CheckCircle2, LayoutGrid, TrendingUp, Flame, Activity, Shield, Cpu, Zap, History } from 'lucide-react';

interface StatDetailProps {
  tab: NavTab;
  stats: UserStats;
  hacks: Hack[];
  onBack: () => void;
}

const StatDetail: React.FC<StatDetailProps> = ({ tab, stats, hacks, onBack }) => {
  const getDetail = () => {
    switch (tab) {
      case NavTab.STAT_COMPLETED:
        return {
          title: 'Neural Completion Archive',
          label: 'Completed Hacks',
          value: stats.hacksCompleted,
          icon: <CheckCircle2 size={32} className="text-green-500" />,
          color: 'text-green-500',
          desc: 'Total successful reality rewrite protocols established in the local timeline.',
          metrics: [
            { label: 'Sync Success', value: '98.2%' },
            { label: 'Energy Retained', value: '4.2k' },
            { label: 'Rank Prestige', value: '+12%' }
          ]
        };
      case NavTab.STAT_ACTIVE:
        const activeCount = hacks.filter(h => h.status === 'active').length;
        return {
          title: 'Live Neural Load',
          label: 'Active Protocols',
          value: activeCount,
          icon: <LayoutGrid size={32} className="text-cyan-500" />,
          color: 'text-cyan-500',
          desc: 'Current cognitive load of running optimization algorithms.',
          metrics: [
            { label: 'CPU Usage', value: '42%' },
            { label: 'Memory Buff', value: 'Nominal' },
            { label: 'Risk Factor', value: 'Low' }
          ]
        };
      case NavTab.STAT_RATE:
        const avg = hacks.length > 0 
          ? Math.round(hacks.reduce((acc, h) => acc + h.progress, 0) / hacks.length) 
          : 0;
        return {
          title: 'Synchronization Rate',
          label: 'Overall Progress',
          value: `${avg}%`,
          icon: <TrendingUp size={32} className="text-fuchsia-500" />,
          color: 'text-fuchsia-500',
          desc: 'Real-time efficiency tracking across all neural optimization sectors.',
          metrics: [
            { label: 'Growth Delta', value: '+2.4%' },
            { label: 'Consistency', value: 'Stable' },
            { label: 'Flow State', value: 'Active' }
          ]
        };
      case NavTab.STAT_STREAK:
        return {
          title: 'Temporal Consistency',
          label: 'Daily Streak',
          value: `${stats.streak} Days`,
          icon: <Flame size={32} className="text-orange-500" />,
          color: 'text-orange-500',
          desc: 'Consecutive days of successful neural synchronization and reality alignment.',
          metrics: [
            { label: 'Next Bonus', value: '3 Days' },
            { label: 'Multiplier', value: 'x1.4' },
            { label: 'Stability', value: '94%' }
          ]
        };
      default:
        return null;
    }
  };

  const data = getDetail();
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
          System Diagnostics
        </h2>
      </div>

      <div className="glass rounded-[2rem] p-8 text-center space-y-4 border-cyan-500/10">
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 shadow-inner">
            {data.icon}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-orbitron font-black text-slate-900 dark:text-white italic uppercase tracking-tight">
            {data.value}
          </h3>
          <p className={`text-xs font-mono font-bold uppercase tracking-widest ${data.color}`}>
            {data.label}
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono leading-relaxed max-w-xs mx-auto uppercase">
          {data.desc}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {data.metrics.map((m, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center bg-white/40 dark:bg-white/[0.02]">
            <p className="text-[8px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest font-black mb-1">
              {m.label}
            </p>
            <p className="text-sm font-orbitron font-black text-slate-900 dark:text-white italic">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.3em] px-2 font-mono flex items-center gap-2">
          <History size={12} /> Recent Neural Logs
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center justify-between border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <Cpu size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-tight">Sync_Log_{Date.now() - i*100000}</p>
                  <p className="text-[8px] font-mono text-slate-400 dark:text-slate-600 uppercase">Operational Status: Nominal</p>
                </div>
              </div>
              <span className="text-[8px] font-mono text-green-500 font-black uppercase">Verified</span>
            </div>
          ))}
        </div>
      </section>

      <div className="p-6 glass rounded-2xl border-dashed border-cyan-500/20 bg-cyan-500/[0.02] flex flex-col items-center gap-3 text-center">
        <Shield size={24} className="text-cyan-600/40" />
        <p className="text-[9px] font-mono text-slate-400 dark:text-slate-600 uppercase font-black tracking-widest leading-relaxed">
          Neural data is encrypted using Protocol 0-X. Access is restricted to primary consciousness.
        </p>
      </div>
    </div>
  );
};

export default StatDetail;
