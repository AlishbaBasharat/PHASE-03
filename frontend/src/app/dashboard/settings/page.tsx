'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  User, Lock, Bell, Save, Mail, Camera, RefreshCw,
  CircleUser, ShieldAlert, BadgeCheck, Terminal
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rank: 'Lead Architect',
    bio: 'Establishing task management excellence...'
  });

  // Sync with auth user and localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('operatorProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse operator profile", e);
      }
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.email?.split('@')[0] || 'Operator',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleSave = () => {
    setIsSaving(true);

    // Persist to localStorage for immediate UI feedback
    localStorage.setItem('operatorProfile', JSON.stringify(formData));

    // Dispatch custom event to notify other components (like Sidebar)
    window.dispatchEvent(new Event('profileUpdate'));

    // Simulating API persistence
    setTimeout(() => {
       setIsSaving(false);
       console.log("System configuration updated:", formData);
       alert("MISSION PROTOCOL: System Identity Successfully Updated.");
    }, 1000);
  };

  if (authLoading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-purple-500 font-black tracking-[0.5em]">DECRYPTING SETTINGS...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] p-4 md:p-10 text-slate-200 overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto">

        {/* HEADER SECTION */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Terminal className="text-purple-500" size={20} />
               <p className="text-[10px] text-purple-500 font-black tracking-[0.3em] uppercase italic">Control Terminal</p>
            </div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            {isSaving ? "SYNCING..." : "COMMIT CHANGES"}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT: TAB NAVIGATION */}
          <div className="w-full lg:w-[300px] space-y-3">
            {[
              { id: 'profile', label: 'OPERATOR PROFILE', icon: <User size={18}/> },
              { id: 'security', label: 'SECURITY PROTOCOLS', icon: <Lock size={18}/> },
              { id: 'notifications', label: 'ALERT SYSTEM', icon: <Bell size={18}/> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-black text-[10px] tracking-widest transition-all border ${
                  activeTab === tab.id
                    ? 'bg-purple-600/10 border-purple-500/40 text-purple-400 shadow-xl shadow-purple-900/5'
                    : 'bg-[#111114]/50 border-white/[0.03] text-slate-500 hover:text-white'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-purple-400' : 'text-slate-700'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            <div className="mt-8 p-6 rounded-[32px] bg-gradient-to-br from-purple-900/10 to-transparent border border-white/5">
               <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-4">Encryption Status</p>
               <div className="flex items-center gap-3">
                 <BadgeCheck className="text-green-500" size={16} />
                 <span className="text-xs font-bold text-slate-300">End-to-End Verified</span>
               </div>
            </div>
          </div>

          {/* RIGHT: MAIN CONTENT AREA */}
          <div className="flex-1 bg-[#111114] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32"></div>

            {/* PROFILE CONTENT */}
            {activeTab === 'profile' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* Profile Banner */}
                <div className="flex items-center gap-8 bg-black/20 p-8 rounded-[32px] border border-white/5">
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-[28px] bg-[#09090b] border-2 border-purple-500/20 flex items-center justify-center overflow-hidden transition-all hover:border-purple-500/50">
                      <CircleUser size={50} className="text-slate-800" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-purple-600 p-2.5 rounded-xl border-4 border-[#111114] text-white shadow-lg cursor-pointer hover:bg-purple-500 transition-colors">
                      <Camera size={14} className="fill-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Operator: {formData.name}</h4>
                    <p className="text-[10px] text-purple-500/70 font-black uppercase tracking-[0.3em] mt-2">UUID: {user?.id?.substring(0, 8) || '00000000'}...</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 leading-none">Call Sign</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#080809] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 leading-none">Operational Rank</label>
                    <input
                      type="text"
                      value={formData.rank}
                      onChange={(e) => setFormData({...formData, rank: e.target.value})}
                      className="w-full bg-[#080809] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 leading-none">Secure Path (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                    <input
                      type="email"
                      readOnly
                      value={formData.email}
                      className="w-full bg-[#080809]/50 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-sm text-slate-500 focus:outline-none cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 leading-none">Intelligence Brief (Bio)</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-[#080809] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all resize-none font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex gap-6">
                  <ShieldAlert className="text-amber-500 shrink-0" size={24} />
                  <p className="text-xs text-slate-400 italic leading-relaxed font-medium">Attention Operator: Multi-Factor Authentication (MFA) is recommended for your clearance level. Enhanced security protocols ensure task isolation across the MCP network.</p>
                </div>

                <div className="space-y-6 max-w-md">
                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Current Authorization Key</label>
                      <input type="password" placeholder="••••••••••••" className="w-full bg-[#080809] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/40 font-mono" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">New Terminal Password</label>
                      <input type="password" placeholder="MIN 12 ALPHANUMERIC" className="w-full bg-[#080809] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/40 font-mono" />
                   </div>
                   <button className="text-purple-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all text-left bg-white/5 w-fit px-6 py-3 rounded-xl border border-white/5 hover:bg-purple-600/10 active:scale-95">Reset Biometrics</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {[
                  { title: "Critical Transmissions", desc: "Push alerts on mission failures and priority task shifts." },
                  { title: "Neural Link Updates", desc: "Synchronize notifications across all connected agent interfaces." },
                  { title: "Operational Summary", desc: "A daily debrief transmitted to your secure channel." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-8 bg-black/20 rounded-[32px] border border-white/5 hover:border-purple-500/30 hover:bg-black/30 transition-all group">
                    <div className="flex-1 pr-6">
                      <p className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-purple-400 transition-colors">{item.title}</p>
                      <p className="text-[11px] text-slate-600 mt-2 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="w-14 h-7 bg-purple-600/10 rounded-full relative cursor-pointer border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                      <div className="absolute right-1 top-1 w-5 h-5 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
