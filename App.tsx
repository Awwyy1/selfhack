import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import HackEngine from './views/HackEngine';
import MentorChat from './views/MentorChat';
import Inventory from './views/Inventory';
import Goals from './views/Goals';
import Subscription from './views/Subscription';
import Auth from './views/Auth';
import { NavTab, UserStats, Hack, Goal } from './types';
import { X, Ticket, Loader2 } from 'lucide-react';
import { authService } from './services/authService';
import { profileService } from './services/profileService';
import { goalsService } from './services/goalsService';
import { hacksService } from './services/hacksService';
import { promoService } from './services/promoService';
import { Profile, PLAN_LIMITS } from './services/supabase';
import type { User } from '@supabase/supabase-js';

const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App state
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.DASHBOARD);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data state
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    streak: 0,
    hacksCompleted: 0,
    rank: 'INITIATE'
  });

  const [hacks, setHacks] = useState<Hack[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        await loadUserData(authUser.id);
      } else {
        setProfile(null);
        setHacks([]);
        setGoals([]);
        setStats({
          level: 1,
          xp: 0,
          xpToNextLevel: 1000,
          streak: 0,
          hacksCompleted: 0,
          rank: 'INITIATE'
        });
      }
      setAuthLoading(false);
    });

    authService.getSession().then(session => {
      if (!session) {
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    setDataLoading(true);
    try {
      const userProfile = await profileService.getProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
        setStats({
          level: userProfile.level,
          xp: userProfile.xp,
          xpToNextLevel: userProfile.xp_to_next_level,
          streak: userProfile.streak,
          hacksCompleted: userProfile.hacks_completed,
          rank: userProfile.rank
        });
      }

      const userGoals = await goalsService.getGoals(userId);
      setGoals(userGoals.map(g => ({
        id: g.id,
        title: g.title,
        deadline: g.deadline,
        completed: g.completed,
        createdAt: g.created_at
      })));

      const userHacks = await hacksService.getHacks(userId);
      setHacks(userHacks.map(h => ({
        id: h.id,
        title: h.title,
        description: h.description || '',
        progress: h.progress,
        status: h.status,
        createdAt: h.created_at,
        tasks: h.tasks.map(t => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          difficulty: t.difficulty,
          xp: t.xp
        }))
      })));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    setActiveTab(NavTab.DASHBOARD);
  };

  const handleRedeemPromo = async () => {
    if (!user || !promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMessage(null);

    const result = await promoService.redeemCode(user.id, promoCode.trim());

    if (result.success) {
      setPromoMessage({ type: 'success', text: result.message });
      const updatedProfile = await profileService.getProfile(user.id);
      if (updatedProfile) setProfile(updatedProfile);
      setPromoCode('');
      setTimeout(() => setShowPromoModal(false), 2000);
    } else {
      setPromoMessage({ type: 'error', text: result.message });
    }
    setPromoLoading(false);
  };

  const handleAddHack = async (newHack: Hack) => {
    if (!user) return;

    const created = await hacksService.createHack(
      user.id,
      newHack.title,
      newHack.description,
      newHack.tasks.map(t => ({
        title: t.title,
        difficulty: t.difficulty,
        xp: t.xp
      }))
    );

    if (created) {
      setHacks([{
        id: created.id,
        title: created.title,
        description: created.description || '',
        progress: created.progress,
        status: created.status,
        createdAt: created.created_at,
        tasks: created.tasks.map(t => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          difficulty: t.difficulty,
          xp: t.xp
        }))
      }, ...hacks]);
      setActiveTab(NavTab.DASHBOARD);
    }
  };

  const handleToggleTask = async (hackId: string, taskId: string) => {
    if (!user) return;

    const hack = hacks.find(h => h.id === hackId);
    if (!hack) return;

    const task = hack.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    await hacksService.toggleTask(taskId, newCompleted);
    await hacksService.updateHackProgress(hackId);

    if (newCompleted && user) {
      const updatedProfile = await profileService.addXP(user.id, task.xp);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setStats({
          level: updatedProfile.level,
          xp: updatedProfile.xp,
          xpToNextLevel: updatedProfile.xp_to_next_level,
          streak: updatedProfile.streak,
          hacksCompleted: updatedProfile.hacks_completed,
          rank: updatedProfile.rank
        });
      }
    }

    setHacks(prevHacks => prevHacks.map(h => {
      if (h.id !== hackId) return h;
      const updatedTasks = h.tasks.map(t =>
        t.id === taskId ? { ...t, completed: newCompleted } : t
      );
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const newProgress = Math.round((completedCount / updatedTasks.length) * 100);
      return { ...h, tasks: updatedTasks, progress: newProgress };
    }));
  };

  const handleAddGoal = async (goal: Omit<Goal, 'id' | 'completed' | 'createdAt'>) => {
    if (!user) return;

    const created = await goalsService.createGoal(user.id, goal.title, goal.deadline);
    if (created) {
      setGoals([{
        id: created.id,
        title: created.title,
        deadline: created.deadline,
        completed: created.completed,
        createdAt: created.created_at
      }, ...goals]);
    }
  };

  const handleToggleGoal = async (id: string) => {
    if (!user) return;

    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newCompleted = !goal.completed;
    await goalsService.toggleGoal(id, newCompleted);

    if (newCompleted) {
      const updatedProfile = await profileService.addXP(user.id, 150);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setStats({
          level: updatedProfile.level,
          xp: updatedProfile.xp,
          xpToNextLevel: updatedProfile.xp_to_next_level,
          streak: updatedProfile.streak,
          hacksCompleted: updatedProfile.hacks_completed,
          rank: updatedProfile.rank
        });
      }
    }

    setGoals(prevGoals => prevGoals.map(g =>
      g.id === id ? { ...g, completed: newCompleted } : g
    ));
  };

  const handleDeleteGoal = async (id: string) => {
    await goalsService.deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  };

  const getRemainingMessages = () => {
    if (!profile) return 0;
    const effectivePlan = profileService.getEffectivePlan(profile);
    const limit = PLAN_LIMITS[effectivePlan];
    return Math.max(0, limit.messages - profile.messages_used);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase tracking-widest">Initializing Neural Core...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  const renderContent = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case NavTab.DASHBOARD:
        return <Dashboard stats={stats} hacks={hacks} onUpgrade={() => setActiveTab(NavTab.SUBSCRIPTION)} />;
      case NavTab.GOALS:
        return (
          <Goals
            goals={goals}
            onAddGoal={handleAddGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case NavTab.HACK_ENGINE:
        return <HackEngine hacks={hacks} onAddHack={handleAddHack} onToggleTask={handleToggleTask} userId={user.id} />;
      case NavTab.MENTOR:
        return <MentorChat userId={user.id} remainingMessages={getRemainingMessages()} onUpgrade={() => setActiveTab(NavTab.SUBSCRIPTION)} />;
      case NavTab.INVENTORY:
        return <Inventory onUpgrade={() => setActiveTab(NavTab.SUBSCRIPTION)} profile={profile} />;
      case NavTab.SUBSCRIPTION:
        return <Subscription onBack={() => setActiveTab(NavTab.DASHBOARD)} profile={profile} onRedeemPromo={() => setShowPromoModal(true)} />;
      default:
        return <Dashboard stats={stats} hacks={hacks} onUpgrade={() => setActiveTab(NavTab.SUBSCRIPTION)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} onLogout={handleLogout}>
      {renderContent()}

      {showPromoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass w-full max-w-md rounded-3xl p-8 border-cyan-500/30 relative shadow-2xl">
            <button onClick={() => { setShowPromoModal(false); setPromoMessage(null); }} className="absolute top-6 right-6 text-white/20 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center border border-fuchsia-500/40">
                <Ticket size={32} className="text-fuchsia-400" />
              </div>
              <div>
                <h2 className="text-2xl font-orbitron font-black italic">REDEEM CODE</h2>
                <p className="text-white/40 text-xs mt-1">Enter your promo code to unlock premium features.</p>
              </div>

              {promoMessage && (
                <div className={`w-full p-3 rounded-xl text-sm font-mono ${
                  promoMessage.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}>
                  {promoMessage.text}
                </div>
              )}

              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="ENTER_CODE"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center font-mono text-sm focus:border-fuchsia-500 focus:outline-none mt-4 uppercase"
              />
              <button
                onClick={handleRedeemPromo}
                disabled={promoLoading || !promoCode.trim()}
                className="w-full py-4 bg-fuchsia-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(217,70,239,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {promoLoading ? <Loader2 className="animate-spin" size={20} /> : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowPromoModal(true)}
        className="fixed top-4 right-32 z-[60] text-white/20 hover:text-fuchsia-400 transition-colors"
        title="Redeem Promo Code"
      >
        <Ticket size={16} />
      </button>
    </Layout>
  );
};

export default App;
