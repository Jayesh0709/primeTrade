
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { taskService } from '../services/taskService';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    priority: TaskPriority | 'All';
    status: TaskStatus | 'All';
  };
  setFilters: React.Dispatch<React.SetStateAction<{ priority: TaskPriority | 'All'; status: TaskStatus | 'All' }>>;
  refreshTasks: () => Promise<void>;
  createTask: (data: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ priority: TaskPriority | 'All'; status: TaskStatus | 'All' }>({
    priority: 'All',
    status: 'All',
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response: any = await taskService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filters.priority === 'All' || task.priority === filters.priority;
      const matchesStatus = filters.status === 'All' || task.status === filters.status;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, filters]);

  const createTask = async (data: any) => {
    const response: any = await taskService.create(data);
    setTasks(prev => [response.data, ...prev]);
  };

  const updateTask = async (id: string, data: any) => {
    await taskService.update(id, data);
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTask = async (id: string) => {
    await taskService.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      filteredTasks, 
      loading, 
      searchQuery, 
      setSearchQuery, 
      filters, 
      setFilters,
      refreshTasks: fetchTasks,
      createTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
