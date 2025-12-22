import React from 'react';
import { UserStats, Hack } from '../types';
import { Trophy, Flame, Target, ChevronRight, Zap, Info, ArrowUpCircle, CheckCircle2, LayoutGrid, Star, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const chartData = [
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
  
  // Dynamic calculations
  const activeHacksCount = hacks.filter(h => h.status === 'active').length;
  const avgProgress = hacks.length > 0 
    ? Math.round(hacks.reduce((acc, h) => acc + h.progress, 0) / hacks.length) 
    : 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-700">
      
      {/* --- HEADER SECTION (REDUCED BY 20%) --- */}
      <div className="space-y-3">
        
        {/* Profile Identity Card - Compact Version */}
        <section className="glass rounded-[2rem] p-4 flex items-center gap-5 relative overflow-hidden border-cyan-500/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[40px] rounded-full" />
          
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 p-[2px] shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <div className="w-full h-full rounded-[calc(1rem+2px)] bg-slate-900 flex items-center justify-center overflow-hidden relative">
                <Zap size={24} className="text-cyan-400 fill-cyan-400/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
              </div>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-fuchsia-600 border-[3px] border-slate-50 dark:border-[#020202] flex items-center justify-center text-[10px] font-black text-white shadow-lg">
              {stats.level}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-orbitron font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none italic">
              {stats.rank.replace('_', ' ')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-[9px] tracking-[0.2em] uppercase mt-1.5 font-bold opacity-70">
              Level {stats.level} Explorer
            </p>
          </div>
        </section>

        {/* Experience Section - Compact & Full Width */}
        <div className="glass rounded-[1.75rem] p-4 flex flex-col justify-between bg-white/30 dark:bg-white/[0.02]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-cyan-500/10 rounded-lg text-cyan-500">
                <Star size={14} className="fill-current" />
              </div>
              <span className="text-[9px] font-orbitron font-black text-slate-800 dark:text-white uppercase tracking-widest">Experience</span>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-black text-slate-900 dark:text-white">{stats.xp} /</span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 ml-1">{stats.xpToNextLevel} XP</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden p-[1px] border border-black/5 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-1000 rounded-full" 
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
            <p className="text-[8px] font-mono text-center text-slate-400 dark:text-slate-600 uppercase tracking-widest font-bold">
              {stats.xpToNextLevel - stats.xp} XP to Level {stats.level + 1}
            </p>
          </div>
        </div>

        {/* Mini Metrics Row - Streak Integrated here */}
        <div className="grid grid-cols-4 gap-3">
          <MiniStat icon={<CheckCircle2 size={16} />} color="text-green-500" value={stats.hacksCompleted} label="Completed" />
          <MiniStat icon={<LayoutGrid size={16} />} color="text-cyan-500" value={activeHacksCount} label="Active" />
          <MiniStat icon={<TrendingUp size={16} />} color="text-fuchsia-500" value={`${avgProgress}%`} label="Rate" />
          <MiniStat icon={<Flame size={16} className="fill-current" />} color="text-orange-500" value={stats.streak} label="Streak" />
        </div>

      </div>
      {/* --- END HEADER SECTION --- */}

      {/* Upgrade CTA */}
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
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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

const MiniStat: React.FC<{ icon: React.ReactNode, color: string, value: string | number, label: string }> = ({ icon, color, value, label }) => (
  <div className="glass rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 bg-white/40 dark:bg-white/[0.02]">
    <div className={`${color} opacity-80 mb-1`}>{icon}</div>
    <div className="text-sm font-orbitron font-black text-slate-900 dark:text-white leading-none">
      {value}
    </div>
    <div className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
      {label}
    </div>
  </div>
);

export default Dashboard;
