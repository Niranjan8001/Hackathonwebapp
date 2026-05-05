import React from 'react';
import { Bell, Plus, Sun, Moon } from 'lucide-react';

export const Header = ({ isDark, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between py-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">Good morning, Ramesh! 👋</h2>
        <p className="text-slate-500 dark:text-[#94A3B8] mt-1">Here's what's happening with your farm store today.</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-[#020617]"></span>
        </button>

        {/* Small Profile Info */}
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-[#334155]">
          <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-[#1E293B] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150" 
              alt="Ramesh Yadav" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">Ramesh Yadav</p>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Farmer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
