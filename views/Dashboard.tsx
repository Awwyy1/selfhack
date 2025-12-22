
import React from 'react';
import { UserStats, Hack, NavTab } from '../types';
import { Trophy, Flame, Target, ChevronRight, Zap, Info, ArrowUpCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: '01', xp: 400 },
  { name: '02', xp: 300 },
  { name: '03', xp: 600 },
  { name: '04', xp: 500 },
  { name: '05', xp: 800 },
  { name: '06', xp: 700 },
  { name: '07', xp: 1100 },
];

interface DashboardProps {
  stats: UserStats;
  hacks: Hack[];
  onUpgrade: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, hacks, onUpgrade }) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Profile Overview */}
      <section className="glass rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/5 blur-[80px] rounded-full" />
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter leading-none text-slate-900 dark:text-white">Level {stats.level}</h2>
              <p className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase mt-1">{stats.rank}</p>
            </div>
            <div className="flex gap-2">
              <StatBadge icon={<Flame size={14} className="text-orange-500" />} value={stats.streak} />
              <StatBadge icon={<Trophy size={14} className="text-yellow-500" />} value={stats.hacksCompleted} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <span>Neural Progress: {stats.xp} / {stats.xpToNextLevel}</span>
              <span>{Math.round((stats.xp / stats.xpToNextLevel) * 100)}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden p-[1px] border border-black/5 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-1000 rounded-full" 
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade CTA (Variant A) */}
      <button 
        onClick={onUpgrade}
        className="w-full glass rounded-2xl p-4 flex items-center justify-between group hover:border-fuchsia-500/30 transition-all bg-gradient-to-r from-fuchsia-500/5 to-transparent border-fuchsia-500/10 shadow-sm"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500">
            <ArrowUpCircle size={24} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Upgrade Plan</h4>
            <p className="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-400 opacity-80">Unlock 1000+ Neural Transmissions</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-fuchsia-500 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Activity Chart */}
      <section className="glass rounded-3xl p-5 bg-white/40 dark:bg-black/20">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 rounded bg-cyan-500/10 flex items-center justify-center">
            <Target size={12} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] font-mono">Neural Performance</h3>
        </div>
        <div className="h-44 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#0891b2" 
                fillOpacity={1} 
                fill="url(#colorXp)" 
                strokeWidth={3} 
                className="drop-shadow-lg"
                isAnimationActive={true} 
                animationDuration={1500}
              />
              <Tooltip 
                contentStyle={{ 
                  background: isDark ? '#111' : '#fff', 
                  border: `1px solid ${isDark ? '#222' : '#eee'}`, 
                  borderRadius: '12px', 
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono',
                  color: isDark ? '#fff' : '#000'
                }}
                itemStyle={{ color: '#0891b2' }}
                cursor={{ stroke: '#22d3ee', strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Active Hacks List */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">Active System Hacks</h3>
          <button className="text-[9px] text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-widest hover:underline transition-all">View All</button>
        </div>
        {hacks.length > 0 ? (
          hacks.map(hack => (
            <div key={hack.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-cyan-500/30 transition-all cursor-pointer group active:scale-[0.98]">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:bg-cyan-500/10 transition-all">
                <Zap size={22} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight mb-2 tracking-tight uppercase italic text-slate-900 dark:text-white">{hack.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 shadow-md" 
                      style={{ width: `${hack.progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">{hack.progress}%</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-all" />
            </div>
          ))
        ) : (
          <div className="p-10 text-center glass rounded-3xl border-dashed">
            <p className="text-slate-400 dark:text-slate-600 text-xs italic font-mono uppercase tracking-widest">No active hacks found.</p>
          </div>
        )}
      </section>

      {/* XP Mechanics */}
      <section className="p-5 glass rounded-2xl bg-slate-50 dark:bg-white/[0.01]">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-slate-400 dark:text-slate-600"><Info size={18} /></div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">System Intel</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              Execute objectives to gain XP. High-intensity tasks yield <span className="text-cyan-600 dark:text-cyan-400 font-bold">Superior rewards</span>. Maintaining streaks preserves neural stability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatBadge: React.FC<{ icon: React.ReactNode, value: number }> = ({ icon, value }) => (
  <div className="flex flex-col items-center glass min-w-[48px] py-2 rounded-xl bg-white dark:bg-white/5">
    {icon}
    <span className="text-[11px] font-black font-orbitron mt-0.5 text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default Dashboard;
