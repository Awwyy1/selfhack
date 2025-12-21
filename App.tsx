
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import HackEngine from './views/HackEngine';
import MentorChat from './views/MentorChat';
import Inventory from './views/Inventory';
import Goals from './views/Goals';
import { NavTab, UserStats, Hack, Goal } from './types';
import { Key, ShieldAlert, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.DASHBOARD);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(!!localStorage.getItem('SELFHACK_API_KEY') || !!process.env.API_KEY);

  const [stats, setStats] = useState<UserStats>({
    level: 12,
    xp: 2450,
    xpToNextLevel: 5000,
    streak: 7,
    hacksCompleted: 14,
    rank: 'NEURAL_OPTIMIZER'
  });

  const [hacks, setHacks] = useState<Hack[]>([
    {
      id: '1',
      title: 'Dopamine Detox',
      description: 'Reset reward system by eliminating digital filler.',
      progress: 65,
      status: 'active',
      createdAt: new Date().toISOString(),
      tasks: []
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([]);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('SELFHACK_API_KEY', tempKey.trim());
      setIsKeyValid(true);
      setShowKeyModal(false);
      window.location.reload(); // Reload to re-init services
    }
  };

  const handleAddHack = (newHack: Hack) => {
    setHacks([newHack, ...hacks]);
    setActiveTab(NavTab.DASHBOARD);
  };

  const renderContent = () => {
    if (!isKeyValid && (activeTab === NavTab.HACK_ENGINE || activeTab === NavTab.MENTOR)) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <ShieldAlert size={40} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-bold">ACCESS_DENIED</h3>
            <p className="text-white/40 text-sm mt-2 max-w-xs mx-auto">Neural processing requires a valid API key. Configure it in settings to proceed.</p>
          </div>
          <button 
            onClick={() => setShowKeyModal(true)}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
          >
            Configure Access Key
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case NavTab.DASHBOARD: return <Dashboard stats={stats} hacks={hacks} />;
      case NavTab.GOALS: return <Goals goals={goals} onAddGoal={(g) => setGoals([...goals, {...g, id: Math.random().toString(), completed: false, createdAt: new Date().toISOString()}])} onToggleGoal={(id) => setGoals(goals.map(g => g.id === id ? {...g, completed: !g.completed} : g))} onDeleteGoal={(id) => setGoals(goals.filter(g => g.id !== id))} />;
      case NavTab.HACK_ENGINE: return <HackEngine onAddHack={handleAddHack} />;
      case NavTab.MENTOR: return <MentorChat />;
      case NavTab.INVENTORY: return <Inventory />;
      default: return <Dashboard stats={stats} hacks={hacks} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass w-full max-w-md rounded-3xl p-8 border-cyan-500/30 relative shadow-2xl">
            <button onClick={() => setShowKeyModal(false)} className="absolute top-6 right-6 text-white/20 hover:text-white"><X size={20}/></button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/40">
                <Key size={32} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-orbitron font-black italic italic">NEURAL ACCESS</h2>
                <p className="text-white/40 text-xs mt-1">Provide your Gemini API Key to enable AI features.</p>
              </div>
              <input 
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AI_STUDIO_KEY_..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center font-mono text-sm focus:border-cyan-500 focus:outline-none mt-4"
              />
              <button 
                onClick={handleSaveKey}
                className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                Establish Link
              </button>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                className="text-[10px] text-cyan-400/60 hover:text-cyan-400 uppercase font-bold tracking-widest mt-2"
              >
                Get Key from AI Studio
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Gear (hidden FAB) */}
      <button 
        onClick={() => setShowKeyModal(true)}
        className="fixed top-4 right-20 z-[60] text-white/20 hover:text-cyan-400 transition-colors"
      >
        <Key size={16} />
      </button>
    </Layout>
  );
};

export default App;
