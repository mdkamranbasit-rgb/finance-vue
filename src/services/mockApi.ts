import { Transaction } from "../types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2024-03-01", amount: 5000, category: "Salary", type: "income", description: "Monthly salary" },
  { id: "2", date: "2024-03-02", amount: 120, category: "Food", type: "expense", description: "Grocery shopping" },
  { id: "3", date: "2024-03-05", amount: 45, category: "Travel", type: "expense", description: "Uber ride" },
  { id: "4", date: "2024-03-10", amount: 200, category: "Bills", type: "expense", description: "Electricity bill" },
  { id: "5", date: "2024-03-12", amount: 1500, category: "Freelance", type: "income", description: "Web design project" },
  { id: "6", date: "2024-03-15", amount: 80, category: "Entertainment", type: "expense", description: "Netflix & Cinema" },
  { id: "7", date: "2024-03-18", amount: 300, category: "Shopping", type: "expense", description: "New clothes" },
  { id: "8", date: "2024-03-20", amount: 50, category: "Food", type: "expense", description: "Dinner out" },
  { id: "9", date: "2024-03-22", amount: 1000, category: "Investments", type: "income", description: "Stock dividends" },
  { id: "10", date: "2024-03-25", amount: 250, category: "Health", type: "expense", description: "Gym membership & supplements" },
  { id: "11", date: "2024-02-28", amount: 4800, category: "Salary", type: "income", description: "Feb salary" },
  { id: "12", date: "2024-02-15", amount: 150, category: "Food", type: "expense", description: "Feb Groceries" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F87171",
  Travel: "#60A5FA",
  Bills: "#FBBF24",
  Entertainment: "#A78BFA",
  Shopping: "#F472B6",
  Health: "#34D399",
  Salary: "#10B981",
  Freelance: "#3B82F6",
  Investments: "#8B5CF6",
  Other: "#9CA3AF",
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem("finvue_transactions");
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        localStorage.setItem("finvue_transactions", JSON.stringify(MOCK_TRANSACTIONS));
        resolve(MOCK_TRANSACTIONS);
      }
    }, 800);
  });
};
