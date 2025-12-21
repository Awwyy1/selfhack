
import React from 'react';
import { UserStats, Hack } from '../types';
import { Trophy, Flame, Target, ChevronRight, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
}

const Dashboard: React.FC<DashboardProps> = ({ stats, hacks }) => {
  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <section className="glass rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[60px] rounded-full group-hover:bg-cyan-500/30 transition-all" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-orbitron font-black uppercase italic tracking-tighter">Level {stats.level}</h2>
              <p className="text-cyan-400 font-mono text-sm tracking-widest">{stats.rank}</p>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center glass px-3 py-1 rounded-lg border-orange-500/20">
                <Flame className="text-orange-500 fill-orange-500/20" size={18} />
                <span className="text-xs font-bold">{stats.streak}</span>
              </div>
              <div className="flex flex-col items-center glass px-3 py-1 rounded-lg border-yellow-500/20">
                <Trophy className="text-yellow-500 fill-yellow-500/20" size={18} />
                <span className="text-xs font-bold">{stats.hacksCompleted}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>XP: {stats.xp} / {stats.xpToNextLevel}</span>
              <span>{Math.round((stats.xp / stats.xpToNextLevel) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000" 
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activity Chart */}
      <section className="glass rounded-3xl p-6 h-48">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Target size={14} /> Neural Performance
        </h3>
        <div className="h-full w-full -ml-6">
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="xp" stroke="#22d3ee" fillOpacity={1} fill="url(#colorXp)" strokeWidth={3} />
              <Tooltip 
                contentStyle={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Active Hacks List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Active System Hacks</h3>
          <button className="text-[10px] text-cyan-400 font-bold hover:underline">View All</button>
        </div>
        {hacks.length > 0 ? (
          hacks.map(hack => (
            <div key={hack.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all">
                {/* Fixed: Zap icon now correctly imported */}
                <Zap size={24} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight mb-1">{hack.title}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500" 
                      style={{ width: `${hack.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{hack.progress}%</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))
        ) : (
          <div className="p-8 text-center glass rounded-3xl border-dashed">
            <p className="text-white/40 text-sm italic">No active hacks detected. Initialize via Engine.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
