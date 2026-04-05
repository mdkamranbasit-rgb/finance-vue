import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "../../lib/utils";
import { motion } from "motion/react";

interface SummaryCardProps {
  title: string;
  amount: number;
  trend: number;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "rose";
  delay?: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, trend, icon: Icon, color, delay = 0 }) => {
  const isPositive = trend >= 0;
  
  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
  };

  const iconBgClasses = {
    indigo: "bg-indigo-600 shadow-indigo-500/30",
    emerald: "bg-emerald-600 shadow-emerald-500/30",
    rose: "bg-rose-600 shadow-rose-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "p-6 rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-300",
        "hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-none dark:border-slate-800"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl text-white shadow-lg", iconBgClasses[color])}>
          <Icon size={24} />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
          isPositive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
        )}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {formatCurrency(amount)}
        </h3>
      </div>
    </motion.div>
  );
};
