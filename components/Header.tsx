import React from 'react';
import { SunIcon, MoonIcon, SaveIcon, UserIcon, LogoutIcon, DumbbellIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  view: 'generate' | 'myPlans';
  setView: (view: 'generate' | 'myPlans') => void;
  canSavePlan: boolean;
  onSavePlan: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, view, setView, canSavePlan, onSavePlan }) => {
  const { user, logout, setAuthModalOpen } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-md safe-top">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <DumbbellIcon className="text-accent w-8 h-8"/>
          <h1 className="text-xl md:text-2xl font-bold font-orbitron text-gray-800 dark:text-white">
            AI Fitness Planner
          </h1>
        </div>
        
        {user && (
          <div className="hidden sm:flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                  onClick={() => setView('generate')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'generate' ? 'bg-white dark:bg-gray-900 text-primary-dark dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                  Generator
              </button>
              <button
                  onClick={() => setView('myPlans')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'myPlans' ? 'bg-white dark:bg-gray-900 text-primary-dark dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                  My Plans
              </button>
          </div>
        )}

        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          
          {user ? (
            <>
              {view === 'generate' && (
                <button
                  onClick={onSavePlan}
                  disabled={!canSavePlan}
                  className="hidden sm:flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  aria-label="Save Plan"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span className="hidden lg:inline">Save</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className="hidden md:inline font-semibold text-sm text-gray-700 dark:text-gray-200">{user.email.split('@')[0]}</span>
                <button onClick={logout} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Logout">
                  <LogoutIcon className="w-6 h-6"/>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-gray-900 font-bold py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
            >
              <UserIcon className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;