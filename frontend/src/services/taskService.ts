import { apiClient } from '@/lib/api';
import { authClient } from '@/lib/auth';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/tasks';

export class TaskService {
  private static formatTaskDates(task: Task): Task {
    return {
      ...task,
      created_at: task.created_at ? task.created_at.replace(' ', 'T') : new Date().toISOString(),
      updated_at: task.updated_at ? task.updated_at.replace(' ', 'T') : new Date().toISOString(),
    };
  }

  private static async checkAuth() {
    const { data: sessionData } = await authClient.getSession();
    if (!sessionData?.user) throw new Error('User not authenticated');
  }

  static async getTasks(): Promise<Task[]> {
    try {
      await this.checkAuth();
      const response = await apiClient.get<Task[]>('/api/tasks/');
      if (!Array.isArray(response.data)) return [];
      return response.data.map(task => this.formatTaskDates(task));
    } catch (error: any) {
      console.error("Fetch Tasks Error:", error.message);
      throw error; // Re-throw taake hook handle kar saky
    }
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      await this.checkAuth();
      const response = await apiClient.post<Task>('/api/tasks/', {
        title: taskData.title,
        description: taskData.description || ""
      });
      return this.formatTaskDates(response.data);
    } catch (error: any) {
      throw error;
    }
  }

  static async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      await this.checkAuth();
      const response = await apiClient.put<Task>(`/api/tasks/${id}`, taskData);
      return this.formatTaskDates(response.data);
    } catch (error: any) {
      throw error;
    }
  }

  static async deleteTask(id: string): Promise<void> {
    try {
      await this.checkAuth();
      await apiClient.delete(`/api/tasks/${id}`);
    } catch (error: any) {
      throw error;
    }
  }
}