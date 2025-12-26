import React from 'react';
import { Award, Shield, Zap, Lock, Star, ArrowUpCircle, Clock } from 'lucide-react';
import { Profile } from '../services/supabase';
import { profileService } from '../services/profileService';

interface InventoryProps {
  onUpgrade: () => void;
  profile?: Profile | null;
}

const achievements = [
  { id: 1, key: 'early_adopter', title: 'Early Adopter', desc: 'Join the SelfHack revolution.', rarity: 'Common' },
  { id: 2, key: 'deep_work_aura', title: 'Deep Work Aura', desc: 'Complete 5 hacks in one week.', rarity: 'Epic' },
  { id: 3, key: 'reality_shifter', title: 'Reality Shifter', desc: 'Sustain 3 major long-term goals to completion.', rarity: 'Legendary' },
  { id: 4, key: 'reality_glitch', title: 'Reality Glitch', desc: 'Break a 30-day productivity streak.', rarity: 'Legendary' },
  { id: 5, key: 'system_architect', title: 'System Architect', desc: 'Design 10 custom hacks.', rarity: 'Rare' },
  { id: 6, key: 'ghost_in_shell', title: 'Ghost in the Shell', desc: 'Complete a hack without any failures.', rarity: 'Epic' },
  { id: 7, key: 'neural_overdrive', title: 'Neural Overdrive', desc: 'Earn 5000 XP in a single day.', rarity: 'Legendary' },
];

const Inventory: React.FC<InventoryProps> = ({ onUpgrade, profile }) => {
  const rank = profile?.rank || 'INITIATE';
  const prestigeLevel = profile ? Math.floor(profile.level / 25) + 1 : 1;

  // For now, just unlock early_adopter by default
  const unlockedAchievements = ['early_adopter'];
  if (profile && profile.hacks_completed >= 5) unlockedAchievements.push('deep_work_aura');

  const getPlanExpiry = () => {
    if (!profile || profile.plan === 'free' || !profile.plan_expires_at) return null;
    const expiry = new Date(profile.plan_expires_at);
    const now = new Date();
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return null;
    return daysLeft;
  };

  const planDaysLeft = getPlanExpiry();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white neon-glow">VAULT</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm uppercase font-mono tracking-widest font-bold">Stored assets and achievement protocols.</p>
      </div>

      {/* Plan Status */}
      {profile && profile.plan !== 'free' && planDaysLeft && (
        <div className={`glass rounded-2xl p-4 flex items-center gap-4 ${
          profile.plan === 'pro' ? 'border-amber-500/30 bg-amber-500/5' : 'border-fuchsia-500/30 bg-fuchsia-500/5'
        }`}>
          <Clock size={20} className={profile.plan === 'pro' ? 'text-amber-500' : 'text-fuchsia-500'} />
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{profile.plan} Plan Active</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{planDaysLeft} days remaining</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-sm bg-white dark:bg-transparent">
          <Shield className="text-cyan-600 dark:text-cyan-400 mb-1" size={36} />
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 font-mono tracking-[0.2em]">Rank</h4>
            <p className="font-orbitron text-sm text-slate-900 dark:text-white italic font-black">{rank}</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-sm bg-white dark:bg-transparent">
          <Star className="text-fuchsia-600 dark:text-fuchsia-400 mb-1" size={36} />
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 font-mono tracking-[0.2em]">Prestige</h4>
            <p className="font-orbitron text-lg text-slate-900 dark:text-white italic font-black">Lvl {prestigeLevel}</p>
          </div>
        </div>
      </div>

      {/* Upgrade Call */}
      <button
        onClick={onUpgrade}
        className="w-full glass rounded-2xl p-5 flex items-center gap-4 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20 group hover:scale-[1.01] transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white text-cyan-600 flex items-center justify-center shadow-lg">
          <ArrowUpCircle size={24} />
        </div>
        <div className="text-left">
          <h4 className="font-orbitron text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Ascend Protocol</h4>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mt-0.5">Upgrade plan for prestige bonus</p>
        </div>
      </button>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] px-2 font-mono">Unlockable Protocols</h3>
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((item) => {
            const isUnlocked = unlockedAchievements.includes(item.key);
            return (
              <div
                key={item.id}
                className={`glass rounded-2xl p-5 flex items-center gap-5 transition-all shadow-sm ${
                  isUnlocked
                    ? 'border-cyan-500/20 opacity-100 bg-white dark:bg-white/5'
                    : 'opacity-40 grayscale bg-slate-50 dark:bg-transparent'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                  isUnlocked
                  ? 'bg-cyan-100 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-300 dark:text-slate-700'
                }`}>
                  {isUnlocked ? <Award size={28} /> : <Lock size={22} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-black text-sm uppercase tracking-tight italic ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{item.title}</h4>
                    <span className={`text-[8px] px-2 py-0.5 rounded border uppercase font-mono font-black ${
                      item.rarity === 'Legendary' ? 'border-yellow-500/50 text-yellow-700 dark:text-yellow-500 bg-yellow-100/50 dark:bg-yellow-500/10 shadow-yellow-500/10 shadow-md' :
                      item.rarity === 'Epic' ? 'border-fuchsia-500/50 text-fuchsia-700 dark:text-fuchsia-400 bg-fuchsia-100/50 dark:bg-fuchsia-500/10' :
                      item.rarity === 'Rare' ? 'border-cyan-500/50 text-cyan-700 dark:text-cyan-500 bg-cyan-100/50 dark:bg-cyan-500/10' :
                      'border-slate-200 text-slate-500 bg-slate-100 dark:border-white/10 dark:text-slate-500 dark:bg-white/5'
                    }`}>
                      {item.rarity}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed font-bold ${isUnlocked ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'}`}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="glass rounded-3xl p-8 border-dashed border-cyan-500/30 flex flex-col items-center gap-5 text-center bg-cyan-500/[0.02]">
        <div className="w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/10">
          <Zap size={36} className="text-cyan-600 dark:text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-lg">Legacy Protocol</h4>
          <p className="text-xs text-slate-500 dark:text-slate-500 max-w-[240px] font-mono leading-relaxed font-bold uppercase">Prestige unlock available at Level 50. Neural refinement required.</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
