
import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (id: string, currentStatus: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusToggle }) => {
  const priorityColors = {
    [TaskPriority.HIGH]: 'bg-red-100 text-red-700 border-red-200',
    [TaskPriority.LOW]: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  const statusColors = {
    [TaskStatus.COMPLETED]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TaskStatus.PENDING]: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <h3 className={`text-lg font-bold text-slate-800 mb-2 ${task.status === TaskStatus.COMPLETED ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </h3>
      
      <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">
        {task.description}
      </p>

      <div className="pt-4 mt-auto border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          <i className="far fa-calendar-alt mr-1"></i>
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <button 
          onClick={() => onStatusToggle(task.id, task.status)}
          className={`text-xs font-semibold py-1.5 px-3 rounded-lg transition-all ${
            task.status === TaskStatus.COMPLETED 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {task.status === TaskStatus.COMPLETED ? 'Undo' : 'Complete'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
