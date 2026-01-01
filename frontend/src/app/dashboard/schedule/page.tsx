'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, Plus, Zap, AlertCircle, Calendar
} from 'lucide-react';

export default function SchedulePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Calendar dates calculate karne ki logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Fetch real tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id) {
        console.log('[Calendar] No user ID available');
        return;
      }

      try {
        setLoading(true);
        console.log('[Calendar] Fetching tasks for user:', user.id);

        // Use the same API as My Tasks page
        const response = await fetch(`https://iqoonaz4321-taskneon-app.hf.space/api/tasks/?user_id=${user.id}`, {
          credentials: 'include'
        });

        console.log('[Calendar] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[Calendar] Fetched Tasks for Calendar:', data);
          console.log('[Calendar] Tasks count:', data.length);
          console.log('[Calendar] Tasks with due_date:', data.filter((t: any) => t.due_date));
          setTasks(data);
        } else {
          console.error('[Calendar] Failed to fetch tasks:', response.status);
          setTasks([]);
        }
      } catch (error) {
        console.error('[Calendar] Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.id) {
      fetchTasks();
    }
  }, [user, authLoading]);

  // Handle task date update
  const handleUpdateTaskDate = async (taskId: string) => {
    if (!selectedDate || !user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`https://iqoonaz4321-taskneon-app.hf.space/api/tasks/${taskId}?user_id=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          due_date: new Date(selectedDate).toISOString()
        }),
        credentials: 'include'
      });

      if (response.ok) {
        // Update local tasks state
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, due_date: selectedDate } : t
        ));
        setEditingTaskId(null);
        setSelectedDate('');
        console.log('[Calendar] Task date updated successfully');
      } else {
        console.error('[Calendar] Failed to update task date:', response.status);
      }
    } catch (error) {
      console.error('[Calendar] Error updating task date:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks for the current month and map to calendar dates
  const getTasksForDay = (day: number) => {
    if (!tasks || tasks.length === 0) {
      console.log('[Calendar] No tasks available or tasks array is empty');
      return [];
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const filtered = tasks.filter(task => {
      if (!task.due_date) {
        console.log('[Calendar] Task missing due_date:', task);
        return false;
      }

      const taskDate = new Date(task.due_date);
      console.log('[Calendar] Processing task:', {
        taskTitle: task.title,
        rawDueDate: task.due_date,
        parsedDate: taskDate,
        parsedDay: taskDate.getDate(),
        parsedMonth: taskDate.getMonth(),
        parsedYear: taskDate.getFullYear(),
        targetDay: day,
        targetMonth: currentMonth,
        targetYear: currentYear
      });

      return taskDate.getDate() === day &&
             taskDate.getMonth() === currentMonth &&
             taskDate.getFullYear() === currentYear;
    });

    console.log(`[Calendar] Day ${day} filtered tasks:`, filtered);
    return filtered;
  };

  // Get upcoming tasks (next 7 days)
  const getUpcomingTasks = () => {
    if (!tasks || tasks.length === 0) {
      console.log('[Calendar] No tasks for upcoming section');
      return [];
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    console.log('[Calendar] Getting upcoming tasks:', {
      today,
      nextWeek,
      totalTasks: tasks.length
    });

    const upcoming = tasks
      .filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        const isUpcoming = taskDate >= today && taskDate <= nextWeek;
        console.log('[Calendar] Upcoming check for', task.title, {
          taskDate,
          isUpcoming
        });
        return isUpcoming;
      })
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 5); // Limit to 5 upcoming tasks

    console.log('[Calendar] Final upcoming tasks:', upcoming);
    return upcoming;
  };

  // Get unscheduled tasks (tasks without due_date)
  const getUnscheduledTasks = () => {
    if (!tasks || tasks.length === 0) {
      console.log('[Calendar] No tasks for unscheduled section');
      return [];
    }

    const unscheduled = tasks.filter(task => !task.due_date);
    console.log('[Calendar] Unscheduled tasks:', unscheduled);
    return unscheduled;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      console.log('[Calendar] Navigated to:', newDate);
      return newDate;
    });
  };

  // Log calendar state for debugging
  useEffect(() => {
    console.log('[Calendar] Calendar State:', {
      currentDate,
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth(),
      tasksLength: tasks.length,
      tasks: tasks
    });
  }, [currentDate, tasks]);

  return (
    <div className="min-h-screen bg-[#09090b] p-6 lg:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Mission Schedule</h1>
            <p className="text-[10px] text-purple-500 font-black tracking-[0.3em] uppercase mt-3 italic">Temporal Objective Tracking</p>
          </div>
          <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2">
            <Plus size={14} /> New Entry
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CALENDAR GRID */}
          <div className="lg:col-span-8 bg-[#111114] border border-white/5 rounded-[40px] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-white italic uppercase tracking-tight">
                {monthNames[currentDate.getMonth()]} <span className="text-purple-500">{currentDate.getFullYear()}</span>
              </h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 text-slate-500 hover:text-white transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 text-slate-500 hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* DAYS NAME */}
            <div className="grid grid-cols-7 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[9px] font-black text-slate-600 uppercase text-center tracking-widest">{d}</div>
              ))}
            </div>

            {/* DATES GRID */}
            <div className="grid grid-cols-7 gap-2">
              {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
              {days.map(d => {
                const dayTasks = getTasksForDay(d);
                const hasTasks = dayTasks.length > 0;
                const today = new Date();
                const isToday = d === today.getDate() &&
                               currentDate.getMonth() === today.getMonth() &&
                               currentDate.getFullYear() === today.getFullYear();

                return (
                  <div
                    key={d}
                    className={`aspect-square border border-white/[0.03] rounded-2xl flex flex-col items-center justify-center relative group cursor-pointer transition-all hover:bg-purple-600/10 hover:border-purple-500/30 ${
                      isToday ? 'bg-purple-600/10 border-purple-500/50' : 'bg-black/20'
                    }`}
                  >
                    <span className={`text-sm font-bold ${
                      isToday ? 'text-purple-400' : hasTasks ? 'text-white' : 'text-slate-400'
                    }`}>
                      {d}
                    </span>
                    {hasTasks && (
                      <div className="flex flex-wrap justify-center gap-1 mt-1">
                        {dayTasks.slice(0, 3).map((task, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              task.completed
                                ? 'bg-green-500 shadow-[0_0_8px_green]'
                                : 'bg-purple-500 shadow-[0_0_8px_purple]'
                            }`}
                            title={task.title}
                          ></div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-[8px] text-purple-400">+{dayTasks.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: UPCOMING BRIEFING & UNSCHEDULED */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111114] border border-white/5 rounded-[32px] p-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                <Clock size={16} className="text-purple-500" /> Upcoming Intel
              </h3>
              <div className="space-y-4">
                {getUpcomingTasks().length > 0 ? getUpcomingTasks().map((task, i) => {
                  const taskDate = new Date(task.due_date);
                  const day = taskDate.getDate();
                  const month = taskDate.toLocaleString('default', { month: 'short' });

                  return (
                    <div key={task.id || i} className="bg-black/40 border border-white/5 p-4 rounded-2xl group hover:border-purple-500/40 transition-all">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{month} {day}, {taskDate.getFullYear()}</p>
                      <h4 className="text-sm font-bold text-white mt-1 group-hover:text-purple-400 transition-colors italic">{task.title}</h4>
                    </div>
                  );
                }) : (
                  <p className="text-xs text-slate-500 italic">No upcoming tasks</p>
                )}
              </div>
            </div>

            <div className="bg-[#111114] border border-white/5 rounded-[32px] p-6 text-slate-200">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                <Calendar size={16} className="text-orange-500" /> Unscheduled
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {getUnscheduledTasks().length > 0 ? getUnscheduledTasks().map((task, i) => (
                  <div
                    key={task.id || i}
                    className={`bg-black/40 border border-white/5 p-4 rounded-2xl group hover:border-purple-500/40 transition-all ${
                      task.completed ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          task.completed ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold mt-0 group-hover:text-purple-400 transition-colors italic truncate ${
                            task.completed ? 'text-slate-500 line-through' : 'text-white'
                          }`}>
                            {task.title}
                          </h4>
                        </div>
                      </div>

                      {editingTaskId === task.id ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-black/60 border border-white/10 rounded-lg p-2 text-[10px] text-white focus:border-purple-500 outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateTaskDate(task.id)}
                              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-black uppercase py-2 rounded-lg transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setEditingTaskId(null);
                                setSelectedDate('');
                              }}
                              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 text-[9px] font-black uppercase py-2 rounded-lg transition-colors border border-white/5"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            // Set default date to today for the picker
                            const today = new Date().toISOString().split('T')[0];
                            setSelectedDate(today);
                          }}
                          className="w-full bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 border border-white/5 rounded-xl py-2 px-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                          <Calendar size={12} /> Set Date
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 italic">All tasks scheduled!</p>
                )}
              </div>
            </div>

            <div className="bg-purple-600/5 border border-purple-500/10 rounded-[32px] p-8 relative overflow-hidden group">
              <Zap className="absolute -right-4 -bottom-4 text-purple-500/10 rotate-12 group-hover:scale-110 transition-transform" size={120} />
              <div className="relative z-10">
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">Operational Tip</p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed italic">"Unscheduled tasks in the Backlog section can be scheduled by setting a due date in the Tasks dashboard."</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}