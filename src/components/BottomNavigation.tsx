import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, KeyIcon, PlusIcon, MenuIcon } from 'lucide-react';
const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/passwords')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('/passwords') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <KeyIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Passwords</span>
        </button>
        <button onClick={() => navigate('/add-password')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('/add-password') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <PlusIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Add</span>
        </button>
        <button onClick={() => navigate('/menu')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('/menu') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <MenuIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </div>;
};
export default BottomNavigation;