"use client";
import { useState, useCallback } from 'react';
import { TaskService } from '@/services/taskService';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/tasks';
import { useToast } from '@/hooks/useToast';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const useTasks = () => {
  const [state, setState] = useState<TasksState>({
    tasks: [],
    loading: false,
    error: null,
  });

  const { addToast } = useToast();

  // 1. Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await TaskService.getTasks();
      setState(prev => ({ ...prev, tasks: data, loading: false }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to fetch tasks';
      setState(prev => ({ ...prev, loading: false, error: msg }));
      // Infinite loop se bachne ke liye toast ko yahan dhiyaan se use karein
    }
  }, []);

  // 2. Create Task
  const createTask = async (data: CreateTaskData) => {
    try {
      const newTask = await TaskService.createTask(data);
      setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
      addToast('Task created successfully', 'success');
      return newTask;
    } catch (error: any) {
      addToast('Failed to create task', 'error');
      throw error;
    }
  };

  // 3. Update Task
  const updateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await TaskService.updateTask(id, data);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? updatedTask : t)
      }));
      return updatedTask;
    } catch (error: any) {
      addToast('Failed to update task', 'error');
      throw error;
    }
  };

  // 4. Toggle Completion
  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    try {
      const updated = await TaskService.updateTask(id, { completed });
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? updated : t)
      }));
    } catch (error: any) {
      addToast('Failed to update status', 'error');
    }
  };

  // 5. Delete Task
  const deleteTask = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== id)
      }));
      addToast('Task deleted', 'success');
    } catch (error: any) {
      addToast('Failed to delete task', 'error');
    }
  };

  return {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
  };
};