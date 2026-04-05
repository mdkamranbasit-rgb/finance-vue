# 💰 FinVue – Finance Dashboard UI

A modern, responsive finance dashboard built to help users track, analyze, and understand their financial activity.

This project was created as part of a Frontend Developer Internship assignment and focuses on clean UI/UX, component structure, and effective state management.

---

## 🚀 Live Demo

👉 https://finance-vue-eight.vercel.app/

## 📂 Repository

👉 https://github.com/mdkamranbasit-rgb/finance-vue

---

## 🧠 Overview

FinVue is a frontend-only dashboard that simulates a real-world financial tracking application.
It allows users to visualize their balance, explore transactions, and gain insights into spending patterns.

The project emphasizes:

* Intuitive design
* Responsive layout
* Modular architecture
* Interactive UI behavior

---

## ✨ Features

### 📊 Dashboard Overview

* Summary cards:

  * Total Balance
  * Total Income
  * Total Expenses
* Line chart showing balance trend over time
* Pie chart for category-wise spending breakdown

---

### 📋 Transactions Management

* View transactions with:

  * Date
  * Amount
  * Category
  * Type (Income/Expense)
* Features:

  * 🔍 Search
  * 🎯 Filter (Income / Expense)
  * ↕️ Sorting (date & amount)
  * ➕ Add transaction (Admin only)
  * ✏️ Edit / Delete transaction

---

### 🔐 Role-Based UI (Simulated)

* Viewer:

  * Read-only access
* Admin:

  * Can add, edit, and delete transactions
* Role switching via dropdown for demo purposes

---

### 💡 Insights Section

* Highest spending category
* Monthly comparison (current vs previous month)
* Total number of transactions
* Visual indicators for trends

---

### 🌙 Optional Enhancements (Implemented)

* Dark mode toggle (with persistence)
* Data stored in localStorage
* Mock API simulation for fetching data
* Smooth animations and transitions
* Export transactions:

  * CSV
  * JSON
* Advanced filtering:

  * Category
  * Date range
* Grouping (by category/month)

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite / Next.js)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **State Management:** Context API / Zustand
* **Icons:** Lucide React
* **Animations:** Framer Motion (optional)

---

## 📁 Project Structure

```
src/
 ├── components/
 │   ├── Sidebar.jsx
 │   ├── Topbar.jsx
 │   ├── SummaryCard.jsx
 │   ├── ChartsSection.jsx
 │   ├── TransactionsTable.jsx
 │   ├── TransactionModal.jsx
 │   ├── InsightsPanel.jsx
 │   └── RoleSwitcher.jsx
 │
 ├── store/
 │   └── useStore.js
 │
 ├── data/
 │   └── mockData.js
 │
 ├── App.jsx
 └── main.jsx
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/finvue-dashboard.git
cd finvue-dashboard
```

### 2. Install dependencies

```
npm install
```

### 3. Run the project

```
npm run dev
```

---

## 🧪 Assumptions

* No backend is used; all data is mocked
* Role-based access is simulated on the frontend
* Financial data is static or stored locally
* Focus is on UI/UX and frontend logic rather than production-ready backend

---

## 📈 Future Improvements

* Backend integration (Node.js / Firebase)
* Authentication system
* Real-time data updates
* Advanced analytics and forecasting
* Multi-user support

---

## 🎯 Key Highlights

* Clean and modern UI
* Fully responsive design
* Thoughtful UX decisions
* Modular and scalable code structure
* Handles edge cases (empty state, loading state)

---

## 🙌 Conclusion

This project demonstrates my ability to design and build a functional, user-friendly dashboard interface while maintaining clean code and scalable architecture.

---

## 📬 Contact

If you have any feedback or suggestions, feel free to reach out!

* Name: md kamran basit
* Email: mdkamranbasit@gmail.com
* LinkedIn: https://www.linkedin.com/in/md-kamran-basit/

---
