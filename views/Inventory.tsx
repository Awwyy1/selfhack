
import React from 'react';
import { Award, Shield, Zap, Lock, Star } from 'lucide-react';

const achievements = [
  { id: 1, title: 'Early Adopter', desc: 'Join the SelfHack revolution.', unlocked: true, rarity: 'Common' },
  { id: 2, title: 'Deep Work Aura', desc: 'Complete 5 hacks in one week.', unlocked: true, rarity: 'Epic' },
  { id: 7, title: 'Reality Shifter', desc: 'Sustain 3 major long-term goals to completion.', unlocked: false, rarity: 'Legendary' },
  { id: 3, title: 'Reality Glitch', desc: 'Break a 30-day productivity streak.', unlocked: false, rarity: 'Legendary' },
  { id: 4, title: 'System Architect', desc: 'Design 10 custom hacks.', unlocked: false, rarity: 'Rare' },
  { id: 5, title: 'Ghost in the Shell', desc: 'Complete a hack without any failures.', unlocked: false, rarity: 'Epic' },
  { id: 6, title: 'Neural Overdrive', desc: 'Earn 5000 XP in a single day.', unlocked: false, rarity: 'Legendary' },
];

const Inventory: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter italic">VAULT</h2>
        <p className="text-white/40 text-sm">Stored assets and achievement protocols.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-2">
          <Shield className="text-cyan-400 mb-2" size={32} />
          <h4 className="text-xs font-bold uppercase text-white/40">Rank</h4>
          <p className="font-orbitron text-xl">ELITE_HACKER</p>
        </div>
        <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-2">
          <Star className="text-fuchsia-400 mb-2" size={32} />
          <h4 className="text-xs font-bold uppercase text-white/40">Prestige</h4>
          <p className="font-orbitron text-xl">Lvl 2</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Unlockable Protocols</h3>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((item) => (
            <div 
              key={item.id} 
              className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all ${item.unlocked ? 'border-cyan-500/20 opacity-100' : 'opacity-40 grayscale'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                item.unlocked 
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/20'
              }`}>
                {item.unlocked ? <Award size={24} /> : <Lock size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase font-mono ${
                    item.rarity === 'Legendary' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                    item.rarity === 'Epic' ? 'border-fuchsia-500/50 text-fuchsia-500 bg-fuchsia-500/10' :
                    item.rarity === 'Rare' ? 'border-cyan-500/50 text-cyan-500 bg-cyan-500/10' :
                    'border-white/20 text-white/40 bg-white/5'
                  }`}>
                    {item.rarity}
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass rounded-3xl p-6 border-dashed border-cyan-500/30 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Zap size={32} className="text-cyan-400 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold">LEGACY PROTOCOL</h4>
          <p className="text-xs text-white/40 mt-1 max-w-[200px]">Prestige becomes available after reaching Level 50. Keep hacking.</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
