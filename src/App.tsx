import React, { useState } from "react";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { SummaryCard } from "./components/dashboard/SummaryCard";
import { ChartsSection } from "./components/dashboard/ChartsSection";
import { InsightsPanel } from "./components/dashboard/InsightsPanel";
import { TransactionsTable } from "./components/transactions/TransactionsTable";
import { TransactionModal } from "./components/transactions/TransactionModal";
import { Wallet, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Transaction } from "./types";
import { motion, AnimatePresence } from "motion/react";

const DashboardContent: React.FC = () => {
  const { stats, isLoading, activeTab, setActiveTab } = useDashboardState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your financial data...</p>
      </div>
    );
  }

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={activeTab}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto w-full px-2 sm:px-4">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="min-w-0">
                      <SummaryCard
                        title="Total Balance"
                        amount={stats.totalBalance}
                        trend={stats.balanceTrend}
                        icon={Wallet}
                        color="indigo"
                        delay={0.1}
                      />
                    </div>
                    <div className="min-w-0">
                      <SummaryCard
                        title="Total Income"
                        amount={stats.totalIncome}
                        trend={stats.incomeTrend}
                        icon={TrendingUp}
                        color="emerald"
                        delay={0.2}
                      />
                    </div>
                    <div className="min-w-0">
                      <SummaryCard
                        title="Total Expenses"
                        amount={stats.totalExpenses}
                        trend={stats.expenseTrend}
                        icon={TrendingDown}
                        color="rose"
                        delay={0.3}
                      />
                    </div>
                  </div>

                  <ChartsSection />
                  <InsightsPanel />
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                      <button 
                        onClick={() => setActiveTab("transactions")}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    <TransactionsTable onAddClick={handleAdd} onEditClick={handleEdit} />
                  </div>
                </motion.div>
              )}

              {activeTab === "transactions" && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransactionsTable onAddClick={handleAdd} onEditClick={handleEdit} />
                </motion.div>
              )}

              {activeTab === "insights" && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <InsightsPanel />
                  <ChartsSection />
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Currency</p>
                        <p className="text-sm text-slate-500">Choose your preferred currency</p>
                      </div>
                      <select className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 text-sm font-bold dark:text-white">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Notifications</p>
                        <p className="text-sm text-slate-500">Manage your alert preferences</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editTransaction={editingTransaction} 
      />
    </div>
  );
};

// Helper hook to manage local dashboard state
const useDashboardState = () => {
  const { stats, isLoading } = useFinance();
  const [activeTab, setActiveTab] = useState("dashboard");

  return { stats, isLoading, activeTab, setActiveTab };
};

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
