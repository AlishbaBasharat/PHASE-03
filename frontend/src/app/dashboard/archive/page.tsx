'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  CheckCircle, RotateCcw, Trash2,
  History, Zap, Search, Database,
  ShieldCheck
} from 'lucide-react';

export default function MissionArchive() {
  const { user, isLoading } = useAuth();
  const [archivedTasks, setArchivedTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE = "https://iqoonaz4321-taskneon-app.hf.space/api/tasks";

  // Load from localStorage
  useEffect(() => {
    const loadArchive = () => {
      const data = JSON.parse(localStorage.getItem('missionArchive') || '[]');
      // Sort: Latest first
      setArchivedTasks(data.sort((a: any, b: any) =>
        new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
      ));
    };
    loadArchive();
  }, []);

  const handleRestore = async (task: any) => {
    if (!user?.id) return;

    try {
      // 1. Update backend state (Using PUT for task update)
      const res = await fetch(`${API_BASE}/${task.id}?user_id=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
           title: task.title,
           description: task.description || "",
           completed: false,
           due_date: task.due_date || null
        })
      });

      if (res.ok) {
        // 2. Remove from local archive
        const updatedArchive = archivedTasks.filter(t => t.id !== task.id);
        localStorage.setItem('missionArchive', JSON.stringify(updatedArchive));
        setArchivedTasks(updatedArchive);
        console.log(`Mission RESTORED: ${task.title}`);
      }
    } catch (err) {
      console.error("Restore error:", err);
    }
  };

  const purgeArchive = () => {
    if (confirm("SECURITY PROTOCOL: Are you sure you want to permanently WIPE the mission history?")) {
      localStorage.removeItem('missionArchive');
      setArchivedTasks([]);
    }
  };

  const filteredTasks = archivedTasks.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-purple-500 font-black tracking-[0.5em]">LOADING ARCHIVES...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 p-8 lg:p-12 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto">

        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="text-purple-500" size={24} />
              <p className="text-[10px] text-purple-500 font-black tracking-[0.4em] uppercase italic">Temporal Repository</p>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Mission Archive</h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
               <div>
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Operator Context</p>
                 <p className="text-xl font-black text-green-500">{user?.email?.split('@')[0].toUpperCase()}</p>
               </div>
               <ShieldCheck className="text-green-500/30" size={32} />
            </div>
            <button
              onClick={purgeArchive}
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> Purge Records
            </button>
          </div>
        </header>

        {/* METRICS & SEARCH */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-1 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20 rounded-[32px] p-6 relative overflow-hidden group">
            <Zap className="absolute -right-4 -bottom-4 text-purple-500/10 rotate-12 group-hover:scale-110 transition-all" size={120} />
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-1">Accomplished</p>
            <p className="text-4xl font-black text-white italic">{archivedTasks.length}</p>
            <p className="text-[9px] text-slate-500 mt-4 font-bold uppercase italic">Finalized Mission Logs</p>
          </div>

          <div className="lg:col-span-3 flex items-center gap-4 bg-[#111114] border border-white/5 rounded-[32px] px-8 focus-within:border-purple-500/30 transition-all">
            <Search className="text-slate-600" size={20} />
            <input
              type="text"
              placeholder="Search historical records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none py-6 text-lg font-bold text-white focus:outline-none placeholder-slate-800"
            />
          </div>
        </div>

        {/* ARCHIVE LIST */}
        <div className="space-y-4 pb-20">
          {filteredTasks.length > 0 ? filteredTasks.map((task, i) => (
            <div
              key={task.id || i}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[24px] bg-[#111114]/50 border border-white/[0.03] hover:border-purple-500/20 hover:bg-[#111114] transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="mt-1">
                  <CheckCircle className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors tracking-tight line-through opacity-60 italic leading-tight">
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">
                       Mission Completed: <span className="text-slate-400">{task.completedAt || 'Legacy Data'}</span>
                    </p>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-700 mt-2 italic line-clamp-1 group-hover:text-slate-500">{task.description}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRestore(task)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/10 text-purple-400 text-[9px] font-black uppercase tracking-widest border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all shadow-lg"
                >
                  <RotateCcw size={12} /> Re-Activate
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[40px]">
              <Database className="mx-auto text-slate-800 mb-6" size={48} />
              <h3 className="text-xl font-bold text-slate-600 uppercase italic">Empty Data Stream</h3>
              <p className="text-xs text-slate-700 mt-2 uppercase tracking-widest">No historical data in the vault</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
