export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type UserRole = "admin" | "viewer";

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  incomeTrend: number;
  expenseTrend: number;
  balanceTrend: number;
}

export interface CategorySpending {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
