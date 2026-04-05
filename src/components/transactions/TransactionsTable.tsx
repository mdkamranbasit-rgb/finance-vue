import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Edit2, 
  Trash2, 
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileJson,
  FileSpreadsheet
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { Transaction } from "../../types";
import { cn, formatCurrency, formatDate } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface TransactionsTableProps {
  onAddClick: () => void;
  onEditClick: (tx: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ onAddClick, onEditClick }) => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const isAdmin = role === "admin";

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  // Filter and Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch = 
          tx.category.toLowerCase().includes(search.toLowerCase()) ||
          tx.description.toLowerCase().includes(search.toLowerCase()) ||
          tx.amount.toString().includes(search);
        
        const matchesType = filterType === "all" || tx.type === filterType;
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [transactions, search, filterType, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const exportData = (format: "csv" | "json") => {
    const data = transactions;
    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.json";
      a.click();
    } else {
      const headers = ["Date", "Description", "Category", "Type", "Amount"];
      const csvContent = [
        headers.join(","),
        ...data.map(tx => [tx.date, `"${tx.description}"`, tx.category, tx.type, tx.amount].join(","))
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300 w-full min-w-0">
      {/* Table Header / Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64 lg:w-80 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex-shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white truncate"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white flex-shrink-0"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-shrink-0">
            <button 
              onClick={() => exportData("csv")}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-all"
              title="Export CSV"
            >
              <FileSpreadsheet size={18} />
            </button>
            <button 
              onClick={() => exportData("json")}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-all"
              title="Export JSON"
            >
              <FileJson size={18} />
            </button>
          </div>
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex-1 sm:flex-none"
            >
              <Plus size={18} />
              <span className="whitespace-nowrap">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto custom-scrollbar w-full">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-2">
                    Date <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Description</th>
                <th className="px-6 py-4 whitespace-nowrap">Category</th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap" onClick={() => handleSort("amount")}>
                  <div className="flex items-center gap-2">
                    Amount <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Type</th>
                {isAdmin && <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <AnimatePresence mode="popLayout">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ 
                        backgroundColor: "rgba(99, 102, 241, 0.05)",
                        scale: 1.002,
                        transition: { duration: 0.1 }
                      }}
                      className="border-b border-slate-200 dark:border-slate-800 transition-colors group cursor-default"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white min-w-[200px]">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-sm font-bold whitespace-nowrap",
                        tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      )}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          tx.type === "income" 
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                        )}>
                          {tx.type}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => onEditClick(tx)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Search size={48} className="opacity-20" />
                        <p className="text-sm font-medium">No transactions found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredTransactions.length}</span> entries
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
            >
              {[5, 8, 10, 20, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
            title="Previous Page"
          >
            <ChevronLeft size={18} className="dark:text-white group-hover:text-indigo-600 transition-colors" />
          </button>
          
          <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
            {/* Show page numbers with logic for many pages */}
            {totalPages <= 5 ? (
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 flex-shrink-0 rounded-lg text-sm font-bold transition-all",
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={cn(
                    "w-8 h-8 flex-shrink-0 rounded-lg text-sm font-bold transition-all",
                    currentPage === 1 ? "bg-indigo-600 text-white" : "text-slate-500"
                  )}
                >
                  1
                </button>
                {currentPage > 3 && <span className="text-slate-400 px-1">...</span>}
                {currentPage > 1 && currentPage < totalPages && (
                  <button className="w-8 h-8 flex-shrink-0 rounded-lg text-sm font-bold bg-indigo-600 text-white">
                    {currentPage}
                  </button>
                )}
                {currentPage < totalPages - 2 && <span className="text-slate-400 px-1">...</span>}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={cn(
                    "w-8 h-8 flex-shrink-0 rounded-lg text-sm font-bold transition-all",
                    currentPage === totalPages ? "bg-indigo-600 text-white" : "text-slate-500"
                  )}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
            title="Next Page"
          >
            <ChevronRight size={18} className="dark:text-white group-hover:text-indigo-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
