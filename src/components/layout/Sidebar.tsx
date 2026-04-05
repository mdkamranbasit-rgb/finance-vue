import React from "react";
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wallet
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowUpRight },
  { id: "insights", label: "Insights", icon: PieChart },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-colors duration-300",
          "lg:translate-x-0 lg:static lg:block"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">FinVue</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-auto lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  activeTab === item.id
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                  )} 
                />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
