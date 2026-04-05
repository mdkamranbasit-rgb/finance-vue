import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../lib/utils";
import { motion } from "motion/react";

export const ChartsSection: React.FC = () => {
  const { monthlyTrends, categorySpending, theme } = useFinance();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
      {/* Line Chart - Balance Trend */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-0 w-full"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Balance Trend</h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-slate-500 dark:text-slate-400">Balance</span>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }}
                dy={10}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }}
                tickFormatter={(value) => `$${value}`}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#0f172a" : "#ffffff", 
                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                  borderRadius: "12px",
                  color: isDark ? "#ffffff" : "#000000",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value: number) => [formatCurrency(value), "Balance"]}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart - Spending by Category */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-0 w-full flex flex-col"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex-shrink-0">Spending by Category</h3>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="h-[220px] w-full min-w-0 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? "#0f172a" : "#ffffff", 
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-6 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2 flex-1">
            {categorySpending.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs gap-2 py-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{item.name}</span>
                </div>
                <span className="text-slate-900 dark:text-white font-bold flex-shrink-0">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
