import { Task } from '../types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    signup: async (email: string, password: string, name: string) => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },

    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
  },

  tasks: {
    getAll: async (): Promise<Task[]> => {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },

    create: async (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },

    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
    },
  },
}; 