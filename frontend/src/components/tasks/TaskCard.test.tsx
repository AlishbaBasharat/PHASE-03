import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Task } from '@/types/tasks';
import TaskCard from './TaskCard';
import { useTasks } from '@/hooks/useTasks';

// Mock the useTasks hook
jest.mock('@/hooks/useTasks', () => ({
  useTasks: jest.fn(),
}));

const mockUseTasks = useTasks as jest.MockedFunction<any>;

const mockTask: Task = {
  id: 'test-id',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  created_at: '2025-12-18T10:30:00Z',
  updated_at: '2025-12-18T10:30:00Z',
  user_id: 'user-id',
};

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTasks.mockReturnValue({
      toggleTaskCompletion: jest.fn().mockResolvedValue(undefined),
      deleteTask: jest.fn().mockResolvedValue(undefined),
      updateTask: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays completed task with strikethrough', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskCard task={completedTask} />);

    const taskTitle = screen.getByText('Test Task');
    expect(taskTitle).toHaveClass('line-through');
  });

  it('allows toggling task completion', async () => {
    const toggleTaskCompletion = jest.fn().mockResolvedValue(undefined);
    mockUseTasks.mockReturnValue({
      toggleTaskCompletion,
      deleteTask: jest.fn().mockResolvedValue(undefined),
      updateTask: jest.fn().mockResolvedValue(undefined),
    });

    render(<TaskCard task={mockTask} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(toggleTaskCompletion).toHaveBeenCalledWith(mockTask.id, true);
    });
  });

  it('shows edit mode when edit button is clicked', async () => {
    render(<TaskCard task={mockTask} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    });
  });

  it('allows deleting a task', async () => {
    const deleteTask = jest.fn().mockResolvedValue(undefined);
    mockUseTasks.mockReturnValue({
      toggleTaskCompletion: jest.fn().mockResolvedValue(undefined),
      deleteTask,
      updateTask: jest.fn().mockResolvedValue(undefined),
    });

    window.confirm = jest.fn(() => true); // Mock confirm dialog to return true

    render(<TaskCard task={mockTask} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(mockTask.id);
    });
  });

  it('cancels edit mode when cancel is clicked', async () => {
    render(<TaskCard task={mockTask} />);

    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Change the input value
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });

    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      // Should go back to display mode with original title
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });
});