import { apiClient } from '@/lib/api';
import authClient from '@/lib/auth';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ToggleTaskCompletionRequest,
  TaskResponse,
  TasksResponse
} from '@/types/tasks';
import { ApiResponse } from '@/types/api';

export class TasksService {
  // Get the current user's ID from the Better Auth session
  private static async getCurrentUserId(): Promise<string> {
    const session = await authClient.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }
    return session.user.id;
  }

  // Get all tasks for the current user
  static async getTasks(): Promise<Task[]> {
    try {
      const userId = await this.getCurrentUserId();
      const response = await apiClient.get<ApiResponse<Task[]>>(`/api/${userId}/tasks`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new task
  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const userId = await this.getCurrentUserId();
      const response = await apiClient.post<ApiResponse<Task>>(`/api/${userId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update a task
  static async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const userId = await this.getCurrentUserId();
      const response = await apiClient.put<ApiResponse<Task>>(`/api/${userId}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Toggle task completion status
  static async toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
    try {
      const userId = await this.getCurrentUserId();
      const response = await apiClient.patch<ApiResponse<Task>>(`/api/${userId}/tasks/${id}/complete`, {
        completed
      } as ToggleTaskCompletionRequest);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete a task
  static async deleteTask(id: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      await apiClient.delete<ApiResponse<null>>(`/api/${userId}/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Get a specific task by ID
  static async getTaskById(id: string): Promise<Task> {
    try {
      const userId = await this.getCurrentUserId();
      const response = await apiClient.get<ApiResponse<Task>>(`/api/${userId}/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}