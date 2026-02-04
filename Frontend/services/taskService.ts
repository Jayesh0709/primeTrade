
import api from './api';
import { API_ENDPOINTS } from '../utils/apiConfig';
import { Task } from '../types';

export const taskService = {
  getAll: async () => {
    return api.get(API_ENDPOINTS.TASKS.BASE);
  },

  create: async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    return api.post(API_ENDPOINTS.TASKS.BASE, taskData);
  },

  update: async (id: string, taskData: Partial<Task>) => {
    return api.put(API_ENDPOINTS.TASKS.DETAIL(id), taskData);
  },

  delete: async (id: string) => {
    return api.delete(API_ENDPOINTS.TASKS.DETAIL(id));
  }
};
