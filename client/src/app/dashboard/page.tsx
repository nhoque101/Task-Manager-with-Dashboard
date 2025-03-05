'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/task';
import { api } from '@/services/api';
import { 
    PlusIcon, 
    CheckCircleIcon, 
    ClockIcon, 
    XCircleIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'pending' as Task['status']
    });

    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadTasks();
    }, [user, router]);

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const userTasks = await api.tasks.getAll();
            setTasks(userTasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!user) return;
        try {
            const task = await api.tasks.create(newTask);
            setTasks([task, ...tasks]);
            setNewTask({ title: '', description: '', status: 'pending' });
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const handleEditTask = (task: Task) => {
        setCurrentTask(task);
        setShowEditModal(true);
    };

    const handleUpdateTask = async () => {
        if (!currentTask || !user) return;
        try {
            const updatedTask = await api.tasks.update(currentTask._id, currentTask);
            setTasks(tasks.map(task => 
                task._id === currentTask._id ? updatedTask : task
            ));
            setShowEditModal(false);
            setCurrentTask(null);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!user) return;
        try {
            await api.tasks.delete(taskId);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const getStatusIcon = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'in-progress':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <XCircleIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">{user.name}</span>
                        <button
                            onClick={() => logout()}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Task
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No tasks yet. Add one to get started!</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-red-400 hover:text-red-500"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{task.description}</p>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(task.status)}
                                    <span className="text-sm text-gray-500 capitalize">{task.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Task Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTask}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {showEditModal && currentTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={currentTask.title}
                                    onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={currentTask.description}
                                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={currentTask.status}
                                    onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value as Task['status'] })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateTask}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
