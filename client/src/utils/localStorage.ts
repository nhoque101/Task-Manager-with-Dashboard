import { Task } from '../types/task';

const getStorageKey = (userId: string) => `tasks_${userId}`;

export const getStoredTasks = (userId: string): Task[] => {
  if (typeof window === 'undefined') return [];
  const tasks = localStorage.getItem(getStorageKey(userId));
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTask = (userId: string, task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
  const tasks = getStoredTasks(userId);
  const newTask: Task = {
    _id: Date.now().toString(),
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(tasks));
  return newTask;
};

export const updateTask = (userId: string, taskId: string, updates: Partial<Task>) => {
  const tasks = getStoredTasks(userId);
  const taskIndex = tasks.findIndex(t => t._id === taskId);
  if (taskIndex === -1) return null;

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  tasks[taskIndex] = updatedTask;
  localStorage.setItem(getStorageKey(userId), JSON.stringify(tasks));
  return updatedTask;
};

export const deleteTask = (userId: string, taskId: string) => {
  const tasks = getStoredTasks(userId);
  const filteredTasks = tasks.filter(t => t._id !== taskId);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(filteredTasks));
};
