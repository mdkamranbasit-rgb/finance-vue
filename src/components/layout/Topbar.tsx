import React from "react";
import { Sun, Moon, Bell, Search, User, Shield, Eye, Menu } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { cn } from "../../lib/utils";

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, title }) => {
  const { theme, toggleTheme, role, setRole } = useFinance();

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 w-full min-w-0">
      <div className="flex items-center gap-4 min-w-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex-shrink-0"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white capitalize truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-6 flex-shrink-0">
        {/* Search - Hidden on mobile/tablet */}
        <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full dark:text-white"
          />
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-shrink-0">
          <button
            onClick={() => setRole("admin")}
            className={cn(
              "p-1.5 rounded-lg transition-all flex items-center gap-2 text-[10px] sm:text-xs font-medium",
              role === "admin" 
                ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
            title="Admin Role"
          >
            <Shield size={14} className="flex-shrink-0" />
            <span className="hidden xs:inline">Admin</span>
          </button>
          <button
            onClick={() => setRole("viewer")}
            className={cn(
              "p-1.5 rounded-lg transition-all flex items-center gap-2 text-[10px] sm:text-xs font-medium",
              role === "viewer" 
                ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
            title="Viewer Role"
          >
            <Eye size={14} className="flex-shrink-0" />
            <span className="hidden xs:inline">Viewer</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex-shrink-0"
        >
          {theme === "light" ? <Moon size={18} className="sm:w-5 sm:h-5" /> : <Sun size={18} className="sm:w-5 sm:h-5" />}
        </button>

        {/* Notifications - Hidden on very small screens */}
        <button className="hidden sm:block p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative flex-shrink-0">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 lg:pl-6 border-l border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="hidden sm:block text-right min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">John Doe</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <User size={18} className="sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
