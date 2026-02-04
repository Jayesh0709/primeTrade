
export enum TaskPriority {
  HIGH = 'High',
  LOW = 'Low'
}

export enum TaskStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
