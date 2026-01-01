// src/types/tasks.ts

export interface Task {
  id: string; 
  title: string; 
  description?: string;
  completed: boolean;
  created_at: string; 
  updated_at: string; 
  user_id: string; 
}

// Yahan hum 'Request' ko hi 'Data' ka alias de dete hain 
// taake useTasks.tsx ka error khatam ho jaye
export interface CreateTaskRequest {
  title: string;
  description?: string;
}
export type CreateTaskData = CreateTaskRequest; // Alias

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}
export type UpdateTaskData = UpdateTaskRequest; // Alias

export interface ToggleTaskCompletionRequest {
  completed: boolean;
}

export interface TaskResponse {
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
}