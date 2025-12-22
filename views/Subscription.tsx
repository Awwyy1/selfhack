
import React from 'react';
import { Zap, Shield, Crown, Check, ArrowLeft } from 'lucide-react';

interface SubscriptionProps {
  onBack: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onBack }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE PLAN */}
        <div className="glass rounded-[2rem] p-8 flex flex-col border-slate-200 dark:border-white/5 bg-white dark:bg-black/40 shadow-xl dark:shadow-none">
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

          <button className="mt-10 w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
            Initialize Free
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="glass rounded-[2rem] p-8 flex flex-col border-fuchsia-500/50 bg-white dark:bg-black/40 relative shadow-2xl dark:shadow-[0_0_50px_rgba(217,70,239,0.1)] ring-2 ring-fuchsia-500/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full shadow-lg shadow-fuchsia-500/30">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Recommended</span>
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

          <button className="mt-10 w-full py-4 bg-white dark:bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
            Initialize Premium
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="glass rounded-[2rem] p-8 flex flex-col border-amber-500/50 bg-white dark:bg-black/40 shadow-xl dark:shadow-none ring-1 ring-amber-500/10">
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

          <button className="mt-10 w-full py-4 border-2 border-amber-500/30 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs hover:bg-amber-500/10 transition-all">
            Initialize Pro
          </button>
        </div>
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
