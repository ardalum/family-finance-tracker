import { useState } from "react";
import AppShell from "../components/layout/AppShell.jsx";
import BackupRestore from "../features/backup/components/BackupRestore.jsx";
import BudgetTracker from "../features/budgets/components/BudgetTracker.jsx";
import CreditCardTracker from "../features/creditCards/components/CreditCardTracker.jsx";
import { readAppData } from "../lib/storage/appStorage.js";

const pageContent = {
  "credit-cards": {
    title: "Credit Card Tracker",
    description: "Manage cards, monthly balances, due dates, and statement status.",
  },
  budgets: {
    title: "Budget Tracker",
    description: "Plan monthly budget categories without spending calculations yet.",
  },
  backup: {
    title: "Backup / Restore",
    description: "Export, import, or reset the local data saved in this browser.",
  },
};

export default function App() {
  const [appData, setAppData] = useState(() => readAppData());
  const [activeView, setActiveView] = useState("credit-cards");
  const currentPage = pageContent[activeView];

  function refreshData(nextData) {
    setAppData(nextData ?? readAppData());
  }

  return (
    <AppShell
      activeView={activeView}
      onViewChange={setActiveView}
      pageTitle={currentPage.title}
      pageDescription={currentPage.description}
    >
      {activeView === "credit-cards" ? (
        <CreditCardTracker
          creditCards={appData.creditCards}
          monthlyBalances={appData.monthlyBalances}
          onDataChange={refreshData}
        />
      ) : null}

      {activeView === "budgets" ? (
        <BudgetTracker budgetsByMonth={appData.budgetsByMonth} onDataChange={refreshData} />
      ) : null}

      {activeView === "backup" ? <BackupRestore onDataChange={refreshData} /> : null}
    </AppShell>
  );
}
