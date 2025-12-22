import React, { useState } from 'react';
import { Camera, Edit3, HelpCircle, LifeBuoy, ShieldCheck, Trash2, ArrowLeft, ChevronRight, User, Settings, Info } from 'lucide-react';

interface UserProfileProps {
  userName: string;
  onUpdateName: (name: string) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, onUpdateName, onBack }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(userName);

  const handleSave = () => {
    onUpdateName(newName);
    setEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={onBack}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-orbitron font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Profile Protocol</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-cyan-500 p-[2px] shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-500 animate-pulse-subtle">
            <div className="w-full h-full rounded-[calc(1.5rem-2px)] bg-slate-900 flex items-center justify-center overflow-hidden relative">
              <User size={48} className="text-cyan-400/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                <Camera size={20} className="text-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Update</span>
              </button>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-fuchsia-600 flex items-center justify-center text-white shadow-lg border-2 border-slate-50 dark:border-slate-950">
            <Settings size={14} />
          </div>
        </div>

        <div className="text-center space-y-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="bg-black/20 border-b border-cyan-500 text-center text-lg font-black italic uppercase tracking-tight text-slate-900 dark:text-white focus:outline-none px-2"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => setEditing(true)}>
              <h3 className="text-2xl font-orbitron font-black text-slate-900 dark:text-white italic uppercase tracking-tight">
                {userName}
              </h3>
              <Edit3 size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <p className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em]">ID: SH-8829-X</p>
        </div>
      </div>

      {/* Main Settings Matrix */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.3em] px-2 font-mono">Operations</h4>
        <div className="grid grid-cols-1 gap-3">
          <SettingsItem icon={<HelpCircle size={18} />} title="FAQ & Support Center" desc="System documentation and help" />
          <SettingsItem icon={<LifeBuoy size={18} />} title="Contact Neural Support" desc="Direct link to administrators" />
          <SettingsItem icon={<ShieldCheck size={18} />} title="Privacy & Security" desc="Data processing protocols" />
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-slate-500/5 transition-colors">
          <Info size={16} className="text-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Legal Info</span>
        </button>
        <button className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-slate-500/5 transition-colors">
          <Settings size={16} className="text-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Preferences</span>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-red-500/10">
        <button 
          onClick={() => confirm("WARNING: Critical action. Are you sure you want to initialize data purge?")}
          className="w-full glass rounded-2xl p-5 border-red-500/20 bg-red-500/[0.02] flex items-center justify-between group hover:border-red-500/50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <Trash2 size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black uppercase text-red-700 dark:text-red-400">Memory Wipe</h4>
              <p className="text-[9px] font-mono text-slate-400 dark:text-slate-600 mt-0.5 uppercase">Permanently delete all neural data</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-red-500 opacity-30 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="text-center pt-4">
        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-700 uppercase tracking-widest">SelfHack Core v1.4.2 // Stability: Nominal</span>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <button className="glass rounded-2xl p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-all bg-white/40 dark:bg-transparent">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 transition-colors">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{title}</h4>
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase mt-0.5">{desc}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-300 dark:text-slate-800 group-hover:text-cyan-500 transition-all" />
  </button>
);

export default UserProfile;
