
import React from 'react';
import { UserStats, Hack } from '../types';
import { Trophy, Flame, Target, ChevronRight, Zap, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 700 },
  { name: 'Wed', xp: 500 },
  { name: 'Thu', xp: 1200 },
  { name: 'Fri', xp: 900 },
  { name: 'Sat', xp: 1500 },
  { name: 'Sun', xp: 2100 },
];

interface DashboardProps {
  stats: UserStats;
  hacks: Hack[];
  theme: 'dark' | 'light';
}

const Dashboard: React.FC<DashboardProps> = ({ stats, hacks, theme }) => {
  const accentColor = theme === 'dark' ? '#22d3ee' : '#0891b2';
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Profile Overview */}
      <section className="glass rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full dark:bg-cyan-500/5" />
        <div className="relative z-10 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter leading-none text-slate-900 dark:text-white">Level {stats.level}</h2>
              <p className="text-cyan-700 dark:text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase mt-1">{stats.rank}</p>
            </div>
            <div className="flex gap-2">
              <StatBadge theme={theme} icon={<Flame size={14} className="text-orange-500" />} value={stats.streak} />
              <StatBadge theme={theme} icon={<Trophy size={14} className="text-yellow-600 dark:text-yellow-500" />} value={stats.hacksCompleted} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase tracking-widest">
              <span>Progress: {stats.xp} / {stats.xpToNextLevel}</span>
              <span>{Math.round((stats.xp / stats.xpToNextLevel) * 100)}%</span>
            </div>
            <div className="h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden p-[1px] border border-black/5 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-md transition-all duration-1000 rounded-full" 
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Active Hacks */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Active Protocols</h3>
          <button className="text-[9px] text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-widest hover:underline">Full Access</button>
        </div>
        {hacks.length > 0 ? (
          hacks.map(hack => (
            <div key={hack.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:translate-x-1 transition-all cursor-pointer group">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 dark:bg-white/5 flex items-center justify-center border border-cyan-500/20 dark:border-white/5 transition-all">
                <Zap size={20} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight text-slate-800 dark:text-white">{hack.title}</h4>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-600 dark:bg-cyan-500" 
                      style={{ width: `${hack.progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-white/30">{hack.progress}%</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 dark:text-white/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
            </div>
          ))
        ) : (
          <div className="p-10 text-center glass rounded-3xl border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-400 dark:text-white/20 text-xs italic font-mono uppercase">System idle. No hacks detected.</p>
          </div>
        )}
      </section>

      {/* Insight Module */}
      <section className="p-5 glass rounded-2xl bg-cyan-600/5 dark:bg-white/[0.02]">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-cyan-700 dark:text-white/40 uppercase tracking-widest">Neural Link Update</h4>
            <p className="text-[11px] text-slate-600 dark:text-white/30 leading-relaxed font-mono">
              Complete your "Dopamine Detox" protocol to earn +500 XP and unlock the next prestige rank.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatBadge: React.FC<{ icon: React.ReactNode, value: number, theme: string }> = ({ icon, value, theme }) => (
  <div className="flex flex-col items-center glass min-w-[44px] py-1.5 rounded-xl border-black/5 dark:border-white/5">
    {icon}
    <span className="text-[11px] font-black font-orbitron mt-0.5 text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default Dashboard;
