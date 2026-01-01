
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { 
//   Trash2, CheckCircle, Circle, Plus, 
//   X, Calendar, AlignLeft, ChevronRight, 
//   AlertCircle, Layout, Sparkles, Zap
// } from 'lucide-react';

// export default function ProfessionalTasks() {
//   const { user, isLoading } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [newDesc, setNewDesc] = useState(""); 
//   const [selectedTask, setSelectedTask] = useState<any>(null);

//   const API_BASE = "http://127.0.0.1:8000/api/tasks";

//   const fetchTasks = async () => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`${API_BASE}/?user_id=${user.id}`, { credentials: 'include' });
//       if (res.ok) {
//         const data = await res.json();
//         setTasks(data);
//       }
//     } catch (err) { console.error("Fetch error:", err); }
//   };

//   useEffect(() => { 
//     if (!isLoading && user?.id) { fetchTasks(); }
//   }, [user, isLoading]);

//   const addTask = async (e: any) => {
//     e.preventDefault();
//     if (!user?.id || !newTask.trim()) return;
//     try {
//       const res = await fetch(`${API_BASE}/?user_id=${user.id}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ title: newTask, description: newDesc, completed: false })
//       });
//       if (res.ok) { setNewTask(""); setNewDesc(""); fetchTasks(); }
//     } catch (err) { console.error("Add error:", err); }
//   };

//   const updateTask = async (id: any, updatedData: any) => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`${API_BASE}/${id}?user_id=${user.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(updatedData)
//       });
//       if (res.ok) {
//         const updated = await res.json();
//         fetchTasks();
//         if (selectedTask?.id === id) setSelectedTask(updated);
//       }
//     } catch (err) { console.error("Update error:", err); }
//   };

//   const deleteTask = async (id: any) => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`${API_BASE}/${id}?user_id=${user.id}`, { method: 'DELETE', credentials: 'include' });
//       if (res.ok) { setSelectedTask(null); fetchTasks(); }
//     } catch (err) { console.error("Delete error:", err); }
//   };

//   const activeTasks = tasks.filter((t: any) => !t.completed);
//   const completedTasks = tasks.filter((t: any) => t.completed);

//   if (isLoading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-purple-500 font-black tracking-[0.5em]">LOADING...</div>;

//   return (
//     <div className="flex h-screen bg-[#09090b] text-slate-200 overflow-hidden font-sans">
//       <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedTask ? 'mr-[380px] opacity-40' : 'mr-0'}`}>
//         <header className="px-10 py-12 flex justify-between items-end">
//           <div className="pl-4">
//             <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Mission Control</h1>
//             <div className="flex items-center gap-3 mt-3">
//               <span className="h-px w-8 bg-purple-500"></span>
//               <p className="text-[10px] text-amber-400 font-black tracking-[0.3em] uppercase italic">{activeTasks.length} Operations Pending</p>
//             </div>
//           </div>
//           <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4 py-2 border border-white/5 rounded-lg">
//             Agent: {user?.email || "Offline"}
//           </div>
//         </header>

//         <div className="flex-1 overflow-y-auto px-14 no-scrollbar">
//           <div className="max-w-4xl">
//             <form onSubmit={addTask} className="bg-[#111114] border border-white/5 rounded-2xl p-6 mb-12 shadow-2xl transition-all focus-within:border-purple-500/40">
//               <div className="flex flex-col gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-purple-600/20 p-2 rounded-lg"><Zap className="text-purple-500" size={20} /></div>
//                   <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New objective name..." className="w-full bg-transparent border-none text-xl font-bold focus:outline-none text-white" />
//                 </div>
//                 <div className="pl-12 flex items-center gap-3">
//                   <AlignLeft size={14} className="text-slate-600" />
//                   <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Brief description..." className="w-full bg-transparent border-none text-sm text-slate-500 focus:outline-none" />
//                   <button type="submit" className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-full hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest">Deploy</button>
//                 </div>
//               </div>
//             </form>

//             <div className="space-y-10 pb-20">
//               <section>
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-2 h-2 rounded-full bg-purple-500"></div>
//                   <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">In-Progress Ops</h2>
//                 </div>
//                 <div className="space-y-3">
//                   {activeTasks.map((task: any) => (
//                     <div key={task.id} onClick={() => setSelectedTask(task)} className="group flex items-center justify-between p-5 rounded-xl bg-[#111114]/50 border border-white/[0.03] hover:border-purple-500/20 transition-all cursor-pointer">
//                       <div className="flex items-center gap-5">
//                         <button onClick={(e) => { e.stopPropagation(); updateTask(task.id, { ...task, completed: true }); }}>
//                           <Circle className="text-slate-700 hover:text-purple-500 transition-colors stroke-[2.5px]" size={22} />
//                         </button>
//                         <span className="text-[16px] font-bold text-slate-200 tracking-tight">{task.title}</span>
//                       </div>
//                       <ChevronRight size={16} className="text-slate-800 group-hover:text-purple-500" />
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {completedTasks.length > 0 && (
//                 <section className="pt-8 border-t border-white/5">
//                   <h2 className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><Sparkles size={14} /> Accomplished Mission</h2>
//                   <div className="space-y-2">
//                     {completedTasks.map((task: any) => (
//                       <div key={task.id} onClick={() => setSelectedTask(task)} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-pointer">
//                         <div className="flex items-center gap-4">
//                           <button onClick={(e) => { e.stopPropagation(); updateTask(task.id, { ...task, completed: false }); }}>
//                             <CheckCircle className="text-purple-500" size={20} />
//                           </button>
//                           <span className="text-[14px] font-medium text-slate-500 line-through italic tracking-wide">{task.title}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </section>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {selectedTask && (
//         <div className="fixed right-0 top-0 h-full w-[380px] bg-[#0c0c0e] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-right duration-300">
//           <div className="flex flex-col h-full overflow-hidden">
//             <div className="p-6 border-b border-white/5 flex items-center justify-between">
//               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2"><AlertCircle size={14} /> Intelligence Brief</span>
//               <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white"><X size={18} /></button>
//             </div>

//             <div className="p-8 space-y-6 flex-1 overflow-hidden">
//               <div className="space-y-1">
//                 <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Target Name</label>
//                 <textarea value={selectedTask.title} onChange={(e) => updateTask(selectedTask.id, { ...selectedTask, title: e.target.value })} className="w-full bg-transparent text-xl font-black text-white focus:outline-none resize-none leading-tight" rows={2} />
//               </div>

//               <div className="flex flex-col gap-3">
//                  <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Operational Status</label>
//                  <button onClick={() => updateTask(selectedTask.id, { ...selectedTask, completed: !selectedTask.completed })} className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black transition-all border ${selectedTask.completed ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-900 border-white/5 text-amber-500'}`}>
//                   {selectedTask.completed ? <CheckCircle size={14} /> : <Circle size={14} />} {selectedTask.completed ? 'COMPLETED' : 'MARK AS DONE'}
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between"><label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Briefing Detail</label><AlignLeft size={12} className="text-purple-500" /></div>
//                 <textarea value={selectedTask.description || ""} onChange={(e) => updateTask(selectedTask.id, { ...selectedTask, description: e.target.value })} placeholder="No additional intel..." className="w-full bg-[#080809] border border-white/5 rounded-xl p-4 text-[13px] text-slate-400 focus:outline-none focus:border-purple-500/30 h-[120px] resize-none leading-relaxed" />
//               </div>
//             </div>

//             <div className="p-6 border-t border-white/5 bg-[#09090b] flex items-center justify-center gap-4">
//               <button onClick={() => deleteTask(selectedTask.id)} className="flex-1 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/50 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Trash2 size={14} /> Delete</button>
//               <button onClick={() => setSelectedTask(null)} className="flex-1 bg-white text-black py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Dismiss</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }















'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Trash2, CheckCircle, Circle, Plus, 
  X, Calendar, AlignLeft, ChevronRight, 
  AlertCircle, Layout, Sparkles, Zap
} from 'lucide-react';

export default function ProfessionalTasks() {
  const { user, isLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // const API_BASE = "http://127.0.0.1:8000/api/tasks";
  const API_BASE = "https://iqoonaz4321-taskneon-app.hf.space/api/tasks";

  const fetchTasks = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/?user_id=${user.id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => {
    if (!isLoading && user?.id) { fetchTasks(); }
  }, [user, isLoading]);

  // --- ARCHIVE LOGIC ---
  const syncWithArchive = (task: any, isCompleted: boolean) => {
    try {
      const existingArchive = JSON.parse(localStorage.getItem('missionArchive') || '[]');
      if (isCompleted) {
        if (!existingArchive.find((t: any) => t.id === task.id)) {
          const archiveEntry = {
            ...task,
            completedAt: new Date().toLocaleDateString(),
            status: 'Accomplished'
          };
          localStorage.setItem('missionArchive', JSON.stringify([...existingArchive, archiveEntry]));
        }
      } else {
        const filteredArchive = existingArchive.filter((t: any) => t.id !== task.id);
        localStorage.setItem('missionArchive', JSON.stringify(filteredArchive));
      }
    } catch (e) {
      console.error("Archive sync error:", e);
    }
  };

  const addTask = async (e: any) => {
    e.preventDefault();
    if (!user?.id || !newTask.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/?user_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newTask,
          description: newDesc,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          completed: false
        })
      });
      if (res.ok) {
        setNewTask("");
        setNewDesc("");
        setDueDate("");
        fetchTasks();
      }
    } catch (err) { console.error("Add error:", err); }
  };

  const updateTask = async (id: any, updatedData: any) => {
    if (!user?.id) return;

    // Payload prepare karein (backend PUT expectation ke mutabik)
    const payload = {
      title: updatedData.title,
      description: updatedData.description,
      completed: updatedData.completed,
      due_date: updatedData.due_date ? new Date(updatedData.due_date).toISOString() : null
    };

    try {
      const res = await fetch(`${API_BASE}/${id}?user_id=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        fetchTasks();
        syncWithArchive(updated, updatedData.completed);
        if (selectedTask?.id === id) setSelectedTask(updated);
      }
    } catch (err) { console.error("Update error:", err); }
  };

  const deleteTask = async (id: any) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/${id}?user_id=${user.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { 
        // Delete karne par archive se bhi hatao
        const existingArchive = JSON.parse(localStorage.getItem('missionArchive') || '[]');
        localStorage.setItem('missionArchive', JSON.stringify(existingArchive.filter((t: any) => t.id !== id)));
        
        setSelectedTask(null); 
        fetchTasks(); 
      }
    } catch (err) { console.error("Delete error:", err); }
  };

  const activeTasks = tasks.filter((t: any) => !t.completed);
  const completedTasks = tasks.filter((t: any) => t.completed);

  if (isLoading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-purple-500 font-black tracking-[0.5em]">LOADING...</div>;

  return (
    <div className="flex h-screen bg-[#09090b] text-slate-200 overflow-hidden font-sans">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedTask ? 'mr-[380px] opacity-40' : 'mr-0'}`}>
        <header className="px-10 py-12 flex justify-between items-end">
          <div className="pl-4">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Mission Control</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="h-px w-8 bg-purple-500"></span>
              <p className="text-[10px] text-amber-400 font-black tracking-[0.3em] uppercase italic">{activeTasks.length} Operations Pending</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4 py-2 border border-white/5 rounded-lg">
            Agent: {user?.email || "Offline"}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-14 no-scrollbar">
          <div className="max-w-4xl">
            {/* Input Form - ChatKit style enhancement */}
            <form onSubmit={addTask} className="bg-[#111114] border border-white/5 rounded-2xl p-6 mb-12 shadow-2xl transition-all focus-within:border-purple-500/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="flex flex-col gap-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600/20 p-2 rounded-lg"><Zap className="text-purple-500" size={20} /></div>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New objective name..."
                    className="w-full bg-transparent border-none text-xl font-bold focus:outline-none text-white placeholder-slate-700"
                  />
                </div>

                <div className="pl-12 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-2 focus-within:border-purple-500/30 transition-all">
                    <AlignLeft size={14} className="text-slate-600" />
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Brief intelligence / description..."
                      className="w-full bg-transparent border-none text-sm text-slate-400 focus:outline-none placeholder-slate-800"
                    />
                  </div>

                  <div className="w-full sm:w-auto flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-2 focus-within:border-purple-500/30 transition-all">
                    <Calendar size={14} className="text-purple-500" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none color-scheme-dark custom-date-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-white text-black text-[10px] font-black px-8 py-3 rounded-full hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest shadow-lg active:scale-95"
                  >
                    Deploy
                  </button>
                </div>
              </div>
            </form>

            <style jsx>{`
              .custom-date-input::-webkit-calendar-picker-indicator {
                filter: invert(1);
                opacity: 0.5;
                cursor: pointer;
              }
            `}</style>

            {/* Task List */}
            <div className="space-y-10 pb-20">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">In-Progress Ops</h2>
                </div>
                <div className="space-y-3">
                  {activeTasks.map((task: any) => (
                    <div key={task.id} onClick={() => setSelectedTask(task)} className="group flex items-center justify-between p-5 rounded-xl bg-[#111114]/50 border border-white/[0.03] hover:border-purple-500/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-5">
                        <button onClick={(e) => { e.stopPropagation(); updateTask(task.id, { ...task, completed: true }); }}>
                          <Circle className="text-slate-700 hover:text-purple-500 transition-colors stroke-[2.5px]" size={22} />
                        </button>
                        <span className="text-[16px] font-bold text-slate-200 tracking-tight">{task.title}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-800 group-hover:text-purple-500" />
                    </div>
                  ))}
                </div>
              </section>

              {completedTasks.length > 0 && (
                <section className="pt-8 border-t border-white/5">
                  <h2 className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><Sparkles size={14} /> Accomplished Mission</h2>
                  <div className="space-y-2">
                    {completedTasks.map((task: any) => (
                      <div key={task.id} onClick={() => setSelectedTask(task)} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <button onClick={(e) => { e.stopPropagation(); updateTask(task.id, { ...task, completed: false }); }}>
                            <CheckCircle className="text-purple-500" size={20} />
                          </button>
                          <span className="text-[14px] font-medium text-slate-500 line-through italic tracking-wide">{task.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side Drawer (Same as before) */}
      {selectedTask && (
        <div className="fixed right-0 top-0 h-full w-[380px] bg-[#0c0c0e] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2"><AlertCircle size={14} /> Intelligence Brief</span>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-8 space-y-6 flex-1 overflow-hidden">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Target Name</label>
                <textarea value={selectedTask.title} onChange={(e) => updateTask(selectedTask.id, { ...selectedTask, title: e.target.value })} className="w-full bg-transparent text-xl font-black text-white focus:outline-none resize-none leading-tight" rows={2} />
              </div>

              <div className="flex flex-col gap-3">
                 <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Operational Status</label>
                 <button onClick={() => updateTask(selectedTask.id, { ...selectedTask, completed: !selectedTask.completed })} className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black transition-all border ${selectedTask.completed ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-900 border-white/5 text-amber-500'}`}>
                  {selectedTask.completed ? <CheckCircle size={14} /> : <Circle size={14} />} {selectedTask.completed ? 'COMPLETED' : 'MARK AS DONE'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between"><label className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Briefing Detail</label><AlignLeft size={12} className="text-purple-500" /></div>
                <textarea value={selectedTask.description || ""} onChange={(e) => updateTask(selectedTask.id, { ...selectedTask, description: e.target.value })} placeholder="No additional intel..." className="w-full bg-[#080809] border border-white/5 rounded-xl p-4 text-[13px] text-slate-400 focus:outline-none focus:border-purple-500/30 h-[120px] resize-none leading-relaxed" />
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#09090b] flex items-center justify-center gap-4">
              <button onClick={() => deleteTask(selectedTask.id)} className="flex-1 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/50 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Trash2 size={14} /> Delete</button>
              <button onClick={() => setSelectedTask(null)} className="flex-1 bg-white text-black py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}