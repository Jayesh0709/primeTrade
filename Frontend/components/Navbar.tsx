
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <i className="fas fa-tasks text-white text-lg"></i>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          SmartTasks
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <div className="h-10 w-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold">
          {user?.name?.[0].toUpperCase()}
        </div>
        <button 
          onClick={handleLogout}
          className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <i className="fas fa-sign-out-alt text-lg"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
