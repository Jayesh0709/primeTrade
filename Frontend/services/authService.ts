
import api from './api';
import { API_ENDPOINTS } from '../utils/apiConfig';

export const authService = {
  login: async (credentials: any) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  signup: async (userData: any) => {
    return api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
  },

  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }
};
