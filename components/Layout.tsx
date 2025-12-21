
import React, { ReactNode } from 'react';
import { NavTab } from '../types';
import { LayoutDashboard, Zap, MessageSquare, Briefcase, User, Target } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col selection:bg-cyan-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <Zap size={18} className="text-black fill-current" />
          </div>
          <span className="font-orbitron font-black text-xl tracking-tighter neon-glow">SELFHACK</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">Status</span>
            <span className="text-xs font-mono text-green-400">ONLINE_CORE</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 glass overflow-hidden flex items-center justify-center">
            <User size={20} className="text-white/60" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-28 px-4 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg">
        <div className="glass rounded-2xl flex items-center justify-between p-2 shadow-2xl border border-white/10">
          <NavButton 
            active={activeTab === NavTab.DASHBOARD} 
            onClick={() => setActiveTab(NavTab.DASHBOARD)} 
            icon={<LayoutDashboard size={18} />} 
            label="Dash" 
          />
          <NavButton 
            active={activeTab === NavTab.GOALS} 
            onClick={() => setActiveTab(NavTab.GOALS)} 
            icon={<Target size={18} />} 
            label="Goals" 
          />
          <NavButton 
            active={activeTab === NavTab.HACK_ENGINE} 
            onClick={() => setActiveTab(NavTab.HACK_ENGINE)} 
            icon={<Zap size={18} />} 
            label="Engine" 
          />
          <NavButton 
            active={activeTab === NavTab.MENTOR} 
            onClick={() => setActiveTab(NavTab.MENTOR)} 
            icon={<MessageSquare size={18} />} 
            label="Coach" 
          />
          <NavButton 
            active={activeTab === NavTab.INVENTORY} 
            onClick={() => setActiveTab(NavTab.INVENTORY)} 
            icon={<Briefcase size={18} />} 
            label="Vault" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300 ${active ? 'bg-white/10 text-cyan-400 scale-105 neon-glow' : 'text-white/40 hover:text-white/70'}`}
  >
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default Layout;
