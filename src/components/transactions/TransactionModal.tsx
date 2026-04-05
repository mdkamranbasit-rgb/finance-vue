import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Transaction, TransactionType } from "../../types";
import { useFinance } from "../../context/FinanceContext";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const CATEGORIES = ["Food", "Travel", "Bills", "Salary", "Freelance", "Entertainment", "Shopping", "Health", "Investments", "Other"];

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, editTransaction }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState<Omit<Transaction, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    category: "Food",
    type: "expense",
    description: "",
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: editTransaction.date,
        amount: editTransaction.amount,
        category: editTransaction.category,
        type: editTransaction.type,
        description: editTransaction.description,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        category: "Food",
        type: "expense",
        description: "",
      });
    }
  }, [editTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTransaction) {
      updateTransaction(editTransaction.id, formData);
    } else {
      addTransaction(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editTransaction ? "Edit Transaction" : "Add New Transaction"}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    formData.type === "income" 
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    formData.type === "expense" 
                      ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  Expense
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white h-24 resize-none"
                  placeholder="What was this for?"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  {editTransaction ? "Save Changes" : "Add Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
