import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Transaction, UserRole, DashboardStats, MonthlyTrend, CategorySpending } from "../types";
import { fetchTransactions, CATEGORY_COLORS } from "../services/mockApi";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, format } from "date-fns";

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  theme: "light" | "dark";
  isLoading: boolean;
  stats: DashboardStats;
  monthlyTrends: MonthlyTrend[];
  categorySpending: CategorySpending[];
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [role, setRoleState] = useState<UserRole>("admin");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTransactions();
      setTransactions(data);
      setIsLoading(false);
    };

    const savedRole = localStorage.getItem("finvue_role") as UserRole;
    if (savedRole) setRoleState(savedRole);

    const savedTheme = localStorage.getItem("finvue_theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    loadData();
  }, []);

  // Persist transactions
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("finvue_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("finvue_role", newRole);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("finvue_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const addTransaction = (newTx: Omit<Transaction, "id">) => {
    const tx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedFields } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // Derived Stats
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthTxs = transactions.filter((tx) =>
      isWithinInterval(new Date(tx.date), { start: currentMonthStart, end: currentMonthEnd })
    );

    const prevMonthTxs = transactions.filter((tx) =>
      isWithinInterval(new Date(tx.date), { start: prevMonthStart, end: prevMonthEnd })
    );

    const calculateTotals = (txs: Transaction[]) => {
      return txs.reduce(
        (acc, tx) => {
          if (tx.type === "income") acc.income += tx.amount;
          else acc.expense += tx.amount;
          return acc;
        },
        { income: 0, expense: 0 }
      );
    };

    const currentTotals = calculateTotals(currentMonthTxs);
    const prevTotals = calculateTotals(prevMonthTxs);

    const totalIncome = transactions.reduce((acc, tx) => (tx.type === "income" ? acc + tx.amount : acc), 0);
    const totalExpenses = transactions.reduce((acc, tx) => (tx.type === "expense" ? acc + tx.amount : acc), 0);

    const calculateTrend = (curr: number, prev: number) => {
      if (prev === 0) return 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      incomeTrend: calculateTrend(currentTotals.income, prevTotals.income),
      expenseTrend: calculateTrend(currentTotals.expense, prevTotals.expense),
      balanceTrend: calculateTrend(currentTotals.income - currentTotals.expense, prevTotals.income - prevTotals.expense),
    };
  }, [transactions]);

  // Monthly Trends for Line Chart
  const monthlyTrends = useMemo(() => {
    const trends: Record<string, MonthlyTrend> = {};
    
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthKey = format(monthDate, "MMM yyyy");
      trends[monthKey] = { month: monthKey, income: 0, expense: 0, balance: 0 };
    }

    transactions.forEach((tx) => {
      const monthKey = format(new Date(tx.date), "MMM yyyy");
      if (trends[monthKey]) {
        if (tx.type === "income") trends[monthKey].income += tx.amount;
        else trends[monthKey].expense += tx.amount;
      }
    });

    return Object.values(trends).map(t => ({
      ...t,
      balance: t.income - t.expense
    }));
  }, [transactions]);

  // Category Spending for Pie Chart
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        spending[tx.category] = (spending[tx.category] || 0) + tx.amount;
      }
    });

    return Object.entries(spending).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Other"],
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        theme,
        isLoading,
        stats,
        monthlyTrends,
        categorySpending,
        setRole,
        toggleTheme,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
