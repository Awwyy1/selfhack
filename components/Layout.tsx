
import React, { ReactNode } from 'react';
import { NavTab } from '../types';
import { LayoutDashboard, Zap, MessageSquare, Briefcase, User, Target, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme, toggleTheme }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full dark:bg-cyan-500/5" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full dark:bg-fuchsia-500/5" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center px-6 justify-between border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-600 dark:bg-cyan-500 rounded flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap size={18} className="text-white dark:text-black fill-current" />
          </div>
          <span className="font-orbitron font-black text-xl tracking-tighter neon-text">SELFHACK</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle - Replacing the status text */}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            aria-label="Toggle Theme"
          >
            <div className={`p-1 rounded-full transition-all ${theme === 'light' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}>
              <Sun size={14} />
            </div>
            <div className={`p-1 rounded-full transition-all ${theme === 'dark' ? 'bg-cyan-400 text-black' : 'text-gray-400'}`}>
              <Moon size={14} />
            </div>
          </button>

          <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <User size={18} className="text-gray-500 dark:text-white/60" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-28 px-4 max-w-2xl mx-auto w-full relative z-10">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="glass rounded-2xl flex items-center justify-between p-1.5 shadow-2xl">
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
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' : 'text-gray-400 dark:text-white/20 hover:text-gray-900 dark:hover:text-white/60'}`}
  >
    {icon}
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;
