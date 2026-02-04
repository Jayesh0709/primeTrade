
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import { useTasks } from '../context/TaskContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { 
    filteredTasks, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters,
    createTask,
    updateTask,
    deleteTask
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = async (data: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success('Task updated successfully');
      } else {
        await createTask(data);
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTaskId) {
      try {
        await deleteTask(deleteTaskId);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setDeleteTaskId(null);
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    try {
      await updateTask(id, { status: newStatus });
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header & Search */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Your Tasks</h2>
            <p className="text-slate-500 text-sm">Organize your daily workflow efficiently</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i> Add New Task
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fas fa-search"></i>
            </span>
            <input 
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 min-w-[140px] flex-grow lg:flex-grow-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</span>
              <select 
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
                className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">All</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.LOW}>Low</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 min-w-[140px] flex-grow lg:flex-grow-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">All</option>
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-slate-200 animate-pulse h-48 rounded-xl"></div>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleOpenEdit}
                onDelete={setDeleteTaskId}
                onStatusToggle={handleStatusToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <i className="fas fa-clipboard-list text-5xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No tasks found</h3>
            <p className="text-slate-500 max-w-xs mt-2">
              Try adjusting your search or filters, or create a new task to get started.
            </p>
            <button 
              onClick={handleOpenCreate}
              className="mt-6 text-indigo-600 font-bold hover:underline"
            >
              Create your first task
            </button>
          </div>
        )}
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
      />

      <ConfirmModal 
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />

      {/* Persistent Call-to-Action for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={handleOpenCreate}
          className="bg-indigo-600 w-14 h-14 rounded-full shadow-xl shadow-indigo-300 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
