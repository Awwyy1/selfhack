import React from 'react';
import { Zap, Shield, Crown, Check, ArrowLeft, Ticket, CheckCircle } from 'lucide-react';
import { Profile, PLAN_LIMITS } from '../services/supabase';
import { profileService } from '../services/profileService';

interface SubscriptionProps {
  onBack: () => void;
  profile?: Profile | null;
  onRedeemPromo?: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onBack, profile, onRedeemPromo }) => {
  const currentPlan = profile ? profileService.getEffectivePlan(profile) : 'free';

  const getPlanExpiry = () => {
    if (!profile || profile.plan === 'free' || !profile.plan_expires_at) return null;
    const expiry = new Date(profile.plan_expires_at);
    return expiry.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">UPGRADE_CORE</h2>
      </div>

      {/* Current Plan Status */}
      {currentPlan !== 'free' && profile && (
        <div className={`glass rounded-2xl p-4 flex items-center gap-4 ${
          currentPlan === 'pro' ? 'border-amber-500/30 bg-amber-500/5' : 'border-fuchsia-500/30 bg-fuchsia-500/5'
        }`}>
          <CheckCircle size={24} className={currentPlan === 'pro' ? 'text-amber-500' : 'text-fuchsia-500'} />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{currentPlan} Plan Active</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Expires: {getPlanExpiry()} • {PLAN_LIMITS[currentPlan].messages - (profile?.messages_used || 0)} messages remaining
            </p>
          </div>
        </div>
      )}

      {/* Promo Code Button */}
      {onRedeemPromo && (
        <button
          onClick={onRedeemPromo}
          className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-3 border-fuchsia-500/30 hover:bg-fuchsia-500/10 transition-all group"
        >
          <Ticket size={20} className="text-fuchsia-500 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest">Redeem Promo Code</span>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE PLAN */}
        <div className={`glass rounded-[2rem] p-8 flex flex-col bg-white dark:bg-black/40 shadow-xl dark:shadow-none ${
          currentPlan === 'free' ? 'border-cyan-500/50 ring-2 ring-cyan-500/20' : 'border-slate-200 dark:border-white/5'
        }`}>
          {currentPlan === 'free' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 rounded-full">
              <span className="text-[9px] font-black text-black uppercase tracking-widest">Current</span>
            </div>
          )}
          <Zap className="text-cyan-500 mb-6" size={32} />
          <h3 className="text-3xl font-orbitron font-black text-slate-900 dark:text-white italic">FREE</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
            <span className="text-slate-500 dark:text-slate-500 font-mono text-sm uppercase">/mo</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 font-bold uppercase tracking-tight">Basic reality interface</p>

          <ul className="mt-8 space-y-4 flex-1">
            <FeatureItem text="50 messages lifetime" />
            <FeatureItem text="1 coach style" />
            <FeatureItem text="7 days history" />
            <FeatureItem text="Check-ins & Goals" />
          </ul>

          <button
            disabled={currentPlan === 'free'}
            className="mt-10 w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className={`glass rounded-[2rem] p-8 flex flex-col bg-white dark:bg-black/40 relative shadow-2xl dark:shadow-[0_0_50px_rgba(217,70,239,0.1)] ${
          currentPlan === 'premium' ? 'border-fuchsia-500 ring-2 ring-fuchsia-500/30' : 'border-fuchsia-500/50 ring-2 ring-fuchsia-500/20'
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full shadow-lg shadow-fuchsia-500/30">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              {currentPlan === 'premium' ? 'Current' : 'Recommended'}
            </span>
          </div>

          <Shield className="text-fuchsia-500 mb-6" size={32} />
          <h3 className="text-3xl font-orbitron font-black text-slate-900 dark:text-white italic">PREMIUM</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white">$10.99</span>
            <span className="text-slate-500 dark:text-slate-500 font-mono text-sm uppercase">/mo</span>
          </div>
          <p className="text-fuchsia-600 dark:text-fuchsia-400 text-sm mt-4 font-bold uppercase tracking-tight">Focused optimization</p>

          <ul className="mt-8 space-y-4 flex-1">
            <FeatureItem text="400 messages/mo" checked />
            <FeatureItem text="Focused mode" checked />
            <FeatureItem text="30 days history" checked />
            <FeatureItem text="Priority support" checked />
            <FeatureItem text="AI Personalization" checked />
          </ul>

          <button
            disabled={currentPlan === 'premium'}
            className="mt-10 w-full py-4 bg-fuchsia-500 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
          </button>
        </div>

        {/* PRO PLAN */}
        <div className={`glass rounded-[2rem] p-8 flex flex-col bg-white dark:bg-black/40 shadow-xl dark:shadow-none ${
          currentPlan === 'pro' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-amber-500/50 ring-1 ring-amber-500/10'
        }`}>
          {currentPlan === 'pro' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 rounded-full">
              <span className="text-[9px] font-black text-black uppercase tracking-widest">Current</span>
            </div>
          )}
          <Crown className="text-amber-500 mb-6" size={32} />
          <h3 className="text-3xl font-orbitron font-black text-slate-900 dark:text-white italic">PRO</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white">$19.99</span>
            <span className="text-slate-500 dark:text-slate-500 font-mono text-sm uppercase">/mo</span>
          </div>
          <p className="text-amber-600 dark:text-amber-500 text-sm mt-4 font-bold uppercase tracking-tight">Full reality sovereignty</p>

          <ul className="mt-8 space-y-4 flex-1">
            <FeatureItem text="1000 messages/mo" checked />
            <FeatureItem text="Mood Score tracking" checked />
            <FeatureItem text="AI Portrait: Identity Code" checked />
            <FeatureItem text="Goal Sharing & Declaration" checked />
            <FeatureItem text="Advanced Analytics" checked />
          </ul>

          <button
            disabled={currentPlan === 'pro'}
            className="mt-10 w-full py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      {/* Payment note */}
      <div className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-mono uppercase tracking-widest">
        Payment integration coming soon. Use promo codes to unlock plans.
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string; checked?: boolean }> = ({ text, checked = true }) => (
  <li className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${checked ? 'text-green-500' : 'text-slate-300 dark:text-slate-700'}`}>
      <Check size={14} strokeWidth={3} />
    </div>
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{text}</span>
  </li>
);

export default Subscription;
