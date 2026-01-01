'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/tasks';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);
  const { toggleTaskCompletion: toggleCompletionInHook, deleteTask: deleteTaskInHook, updateTask: updateTaskInHook } = useTasks();

  const handleToggleCompletion = async () => {
    try {
      await toggleCompletionInHook(task.id, !task.completed);
    } catch (error: any) {
      console.error('Error toggling task completion:', error);
      // Error handling is done in the useTasks hook with toast notifications
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskInHook(task.id);
      } catch (error: any) {
        console.error('Error deleting task:', error);
        // Error handling is done in the useTasks hook with toast notifications
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await updateTaskInHook(task.id, {
        title: title.trim(),
        description: description.trim() || undefined
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating task:', error);
      // Error handling is done in the useTasks hook with toast notifications
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <div className={`bg-white shadow rounded-md p-4 mb-3 ${task.completed ? 'opacity-70' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full p-2 border border-gray-300 rounded-md text-lg font-medium"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Task description..."
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={loading || !title.trim()}
              className={`px-3 py-1 text-sm rounded-md disabled:opacity-50 ${
                loading || !title.trim()
                  ? 'bg-blue-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <h3 className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-gray-600">{task.description}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Created: {new Date(task.created_at).toLocaleString()}
                {task.updated_at !== task.created_at && (
                  <span>, Updated: {new Date(task.updated_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}