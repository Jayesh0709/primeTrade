
/**
 * Backend API Configuration
 * Change this URL to connect to your live backend server.
 */
export const API_BASE_URL = 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    ME: '/me',
  },
  TASKS: {
    BASE: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
  }
};
