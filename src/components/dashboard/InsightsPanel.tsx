import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../lib/utils";
import { 
  Trophy, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "motion/react";

export const InsightsPanel: React.FC = () => {
  const { categorySpending, stats, transactions } = useFinance();

  const highestSpending = categorySpending[0];
  const totalTransactions = transactions.length;
  
  const insights = [
    {
      title: "Highest Spending",
      value: highestSpending ? highestSpending.name : "N/A",
      subtitle: highestSpending ? `${formatCurrency(highestSpending.value)} spent` : "No data",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Monthly Growth",
      value: `${stats.incomeTrend >= 0 ? "+" : ""}${stats.incomeTrend.toFixed(1)}%`,
      subtitle: "Income vs last month",
      icon: TrendingUp,
      color: stats.incomeTrend >= 0 ? "text-emerald-500" : "text-rose-500",
      bg: stats.incomeTrend >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-rose-50 dark:bg-rose-900/20"
    },
    {
      title: "Activity",
      value: totalTransactions.toString(),
      subtitle: "Total transactions",
      icon: Calendar,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-0"
          >
            <div className={`p-3 rounded-xl flex-shrink-0 ${insight.bg} ${insight.color}`}>
              <insight.icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{insight.title}</p>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">{insight.value}</h4>
              <p className="text-xs text-slate-400 truncate">{insight.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
