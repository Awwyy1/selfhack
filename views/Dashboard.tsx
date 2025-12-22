
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Profile Overview */}
      <section className="glass rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px] rounded-full" />
        <div className="relative z-10 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter leading-none text-gray-900 dark:text-white">Level {stats.level}</h2>
              <p className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase mt-1">{stats.rank}</p>
            </div>
            <div className="flex gap-2">
              <StatBadge icon={<Flame size={14} className="text-orange-500" />} value={stats.streak} />
              <StatBadge icon={<Trophy size={14} className="text-yellow-500" />} value={stats.hacksCompleted} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-white/40 uppercase tracking-widest">
              <span>Neural Progress: {stats.xp} / {stats.xpToNextLevel}</span>
              <span>{Math.round((stats.xp / stats.xpToNextLevel) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden p-[1px] border border-black/5 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-1000 rounded-full" 
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activity Chart */}
      <section className="glass rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={14} className="text-cyan-600/60 dark:text-cyan-400/60" />
          <h3 className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-[0.2em]">Neural Performance</h3>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="xp" stroke={accentColor} fillOpacity={1} fill="url(#colorXp)" strokeWidth={2} isAnimationActive={true} />
              <Tooltip 
                contentStyle={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '10px', color: theme === 'dark' ? '#fff' : '#000' }}
                itemStyle={{ color: accentColor }}
                cursor={{ stroke: theme === 'dark' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(8, 145, 178, 0.2)', strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Active Hacks List */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-[0.2em]">Active System Hacks</h3>
          <button className="text-[9px] text-cyan-600/60 dark:text-cyan-400/60 font-black uppercase tracking-widest hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">View All</button>
        </div>
        {hacks.length > 0 ? (
          hacks.map(hack => (
            <div key={hack.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-black/10 dark:hover:border-white/10 transition-all cursor-pointer group active:scale-[0.98]">
              <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                <Zap size={20} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight mb-2 tracking-tight text-gray-900 dark:text-white">{hack.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-600 dark:bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                      style={{ width: `${hack.progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 dark:text-white/30">{hack.progress}%</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-white/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))
        ) : (
          <div className="p-10 text-center glass rounded-3xl border-dashed border-black/5 dark:border-white/5">
            <p className="text-gray-400 dark:text-white/20 text-xs italic font-mono uppercase tracking-widest">No active hacks found.</p>
          </div>
        )}
      </section>

      {/* XP Mechanics */}
      <section className="p-5 glass rounded-2xl border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-gray-400 dark:opacity-40"><Info size={16} /></div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-[0.2em]">XP Mechanics</h4>
            <p className="text-[11px] text-gray-500 dark:text-white/30 leading-relaxed font-mono">
              Execute hacks to gain XP: <br/>
              <span className="text-gray-700 dark:text-white/50">Tasks: +20 | +50 | +100</span> <br/>
              <span className="text-cyan-700 dark:text-cyan-400/50 italic">System optimization yields exponential rewards.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatBadge: React.FC<{ icon: React.ReactNode, value: number }> = ({ icon, value }) => (
  <div className="flex flex-col items-center glass min-w-[44px] py-1.5 rounded-xl border-black/5 dark:border-white/5">
    {icon}
    <span className="text-[11px] font-black font-orbitron mt-0.5 text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default Dashboard;
