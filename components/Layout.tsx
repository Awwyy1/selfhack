import React, { ReactNode, useState } from 'react';
import { NavTab } from '../types';
import { Profile } from '../services/supabase';
import { LayoutDashboard, Zap, MessageSquare, Briefcase, User, Target, Sun, Moon, LogOut, Crown } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile?: Profile | null;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, profile, onLogout }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getPlanBadge = () => {
    if (!profile) return null;
    if (profile.plan === 'pro') return { text: 'PRO', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    if (profile.plan === 'premium') return { text: 'PREMIUM', color: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30' };
    return null;
  };

  const planBadge = getPlanBadge();

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-cyan-500/30 transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-white dark:text-black fill-current" />
          </div>
          <span className="font-orbitron font-black text-xl tracking-tighter neon-glow text-cyan-600 dark:text-cyan-400">SELFHACK</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl glass border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all active:scale-90"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              {planBadge ? (
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${planBadge.color}`}>
                  {planBadge.text}
                </span>
              ) : (
                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] font-mono opacity-60">Free</span>
              )}
              <span className="text-[11px] font-mono font-bold text-green-600 dark:text-green-400">LVL {profile?.level || 1}</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 glass flex items-center justify-center hover:border-cyan-500/30 transition-colors"
              >
                <User size={18} className="text-slate-500 dark:text-white/60" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 glass rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {profile && (
                      <div className="px-3 py-2 border-b border-white/5 mb-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile.display_name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{profile.email}</p>
                      </div>
                    )}

                    <button
                      onClick={() => { setActiveTab(NavTab.SUBSCRIPTION); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/10 transition-colors text-sm"
                    >
                      <Crown size={16} className="text-fuchsia-500" />
                      <span className="text-slate-700 dark:text-white/80">Upgrade Plan</span>
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-red-500/10 transition-colors text-sm text-red-500"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 pt-24 pb-32 px-4 max-w-2xl mx-auto w-full relative z-10">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="glass rounded-3xl flex items-center justify-between p-1.5 shadow-2xl">
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
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition-all duration-300 ${
      active
        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
        : 'text-slate-400 dark:text-white/30 hover:text-cyan-500 dark:hover:text-white/60'
    }`}
  >
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;
