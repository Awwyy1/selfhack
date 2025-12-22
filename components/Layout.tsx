
import React, { ReactNode } from 'react';
import { NavTab } from '../types';
import { LayoutDashboard, Zap, MessageSquare, Briefcase, User, Target, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme, toggleTheme }) => {
  return (
    <div className="relative min-h-screen transition-colors duration-300 bg-softlight dark:bg-[#020202] text-gray-900 dark:text-white flex flex-col selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 dark:bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/5 dark:bg-fuchsia-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5 dark:border-white/5 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-600 dark:bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Zap size={18} className="text-white dark:text-black fill-current" />
          </div>
          <span className="font-orbitron font-black text-xl tracking-tighter neon-glow">SELFHACK</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Switch */}
          <button 
            onClick={toggleTheme}
            className="w-12 h-6 rounded-full bg-gray-200 dark:bg-white/10 relative border border-black/5 dark:border-white/10 transition-colors p-1 flex items-center"
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'translate-x-6 bg-cyan-500 text-black' : 'translate-x-0 bg-white text-gray-900'}`}>
               {theme === 'dark' ? <Moon size={10} /> : <Sun size={10} />}
            </div>
          </button>

          <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 glass flex items-center justify-center hover:border-cyan-500/30 transition-colors">
            <User size={18} className="text-gray-500 dark:text-white/60" />
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 pt-20 pb-28 px-4 max-w-2xl mx-auto w-full relative z-10">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="glass rounded-2xl flex items-center justify-between p-1.5 shadow-2xl border border-black/5 dark:border-white/5">
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
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 neon-glow' : 'text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white/60'}`}
  >
    {icon}
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;
