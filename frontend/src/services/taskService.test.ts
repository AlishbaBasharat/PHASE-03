import { TaskService } from './taskService';
import { apiClient } from '@/lib/api';
import { authClient } from '@/lib/auth'; // Named import fix
import { Task } from '@/types/tasks';

// Mock the API client and auth client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authClient: { // Fix: match the named export
    getSession: jest.fn(),
  },
}));

describe('TaskService', () => {
  const mockUserId = 'test-user-id';
  const mockTask: Task = {
    id: 'test-task-id',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: '2025-12-18T10:30:00Z',
    updated_at: '2025-12-18T10:30:00Z',
    user_id: mockUserId,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful session retrieval
    (authClient.getSession as jest.MockedFunction<any>).mockResolvedValue({
      data: { user: { id: mockUserId } }, // Added .data to match better-auth structure
    });
  });

  describe('getTasks', () => {
    it('should fetch tasks for the authenticated user', async () => {
      const mockTasks = [mockTask];
      (apiClient.get as jest.MockedFunction<any>).mockResolvedValue({
        data: mockTasks,
      });

      const result = await TaskService.getTasks();

      expect(authClient.getSession).toHaveBeenCalledTimes(1);
      // FIX: URL matched to backend logic
      expect(apiClient.get).toHaveBeenCalledWith('/api/tasks/');
      expect(result).toEqual(mockTasks);
    });

    it('should throw error when user is not authenticated', async () => {
      (authClient.getSession as jest.MockedFunction<any>).mockResolvedValue({ data: { user: null } });

      await expect(TaskService.getTasks()).rejects.toThrow('User not authenticated');
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = { title: 'New Task', description: 'New Description' };
      (apiClient.post as jest.MockedFunction<any>).mockResolvedValue({
        data: { ...mockTask, ...taskData },
      });

      const result = await TaskService.createTask(taskData);

      expect(authClient.getSession).toHaveBeenCalledTimes(1);
      // FIX: URL matched to backend logic
      expect(apiClient.post).toHaveBeenCalledWith('/api/tasks/', {
        title: taskData.title,
        description: taskData.description
      });
      expect(result).toEqual({ ...mockTask, ...taskData });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateData = { title: 'Updated Task' };
      (apiClient.put as jest.MockedFunction<any>).mockResolvedValue({
        data: { ...mockTask, ...updateData },
      });

      const result = await TaskService.updateTask(mockTask.id, updateData);

      // FIX: Path removed ${userId}
      expect(apiClient.put).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, updateData);
      expect(result).toEqual({ ...mockTask, ...updateData });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      (apiClient.delete as jest.MockedFunction<any>).mockResolvedValue({});

      await TaskService.deleteTask(mockTask.id);

      // FIX: Path removed ${userId}
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`);
    });
  });
});