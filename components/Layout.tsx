
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
    <div className="relative min-h-screen bg-[#020202] text-white flex flex-col selection:bg-cyan-500/30">
      {/* Background Ambience - More subtle for better dark theme */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Header - Restored to Screenshot 1 style */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Zap size={18} className="text-black fill-current" />
          </div>
          <span className="font-orbitron font-black text-xl tracking-tighter neon-glow">SELFHACK</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em] font-mono opacity-60">Status</span>
            <span className="text-[11px] font-mono neon-text-green font-bold">ONLINE_CORE</span>
          </div>
          <div className="w-9 h-9 rounded-full border border-white/10 glass flex items-center justify-center hover:border-cyan-500/30 transition-colors">
            <User size={18} className="text-white/60" />
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 pt-20 pb-28 px-4 max-w-2xl mx-auto w-full relative z-10">
        {children}
      </main>

      {/* Navigation - Reordered: Dash, Goals, Coach, Hack, Vault */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="glass rounded-2xl flex items-center justify-between p-1.5 shadow-2xl border border-white/5">
          <NavButton 
            active={activeTab === NavTab.DASHBOARD} 
            onClick={() => setActiveTab(NavTab.DASHBOARD)} 
            icon={<LayoutDashboard size={20} />} 
            label="Dash" 
          />
          <NavButton 
            active={activeTab === NavTab.GOALS} 
            onClick={() => setActiveTab(NavTab.GOALS)} 
            icon={<Target size={20} />} 
            label="Goals" 
          />
          <NavButton 
            active={activeTab === NavTab.MENTOR} 
            onClick={() => setActiveTab(NavTab.MENTOR)} 
            icon={<MessageSquare size={20} />} 
            label="Coach" 
          />
          <NavButton 
            active={activeTab === NavTab.HACK_ENGINE} 
            onClick={() => setActiveTab(NavTab.HACK_ENGINE)} 
            icon={<Zap size={20} />} 
            label="Hack" 
          />
          <NavButton 
            active={activeTab === NavTab.INVENTORY} 
            onClick={() => setActiveTab(NavTab.INVENTORY)} 
            icon={<Briefcase size={20} />} 
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
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-500/10 text-cyan-400 neon-glow' : 'text-white/30 hover:text-white/60'}`}
  >
    {icon}
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;
