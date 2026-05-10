import { useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import CreditCardForm from "../features/creditCards/components/CreditCardForm.jsx";
import CreditCardList from "../features/creditCards/components/CreditCardList.jsx";
import CreditLimitSummary from "../features/creditCards/components/CreditLimitSummary.jsx";
import MonthlyBalanceGraph from "../features/creditCards/components/MonthlyBalanceGraph.jsx";
import MonthlyBalanceTable from "../features/creditCards/components/MonthlyBalanceTable.jsx";
import { readAppData } from "../lib/storage/appStorage.js";

export default function App() {
  const [appData, setAppData] = useState(() => readAppData());
  const [editingCard, setEditingCard] = useState(null);

  const activeCards = useMemo(
    () => appData.creditCards.filter((card) => card.isActive),
    [appData.creditCards],
  );

  function refreshData(nextData) {
    setAppData(nextData ?? readAppData());
    setEditingCard(null);
  }

  return (
    <AppShell>
      <CreditLimitSummary cards={activeCards} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-6">
          <MonthlyBalanceTable
            cards={activeCards}
            monthlyBalances={appData.monthlyBalances}
            onDataChange={refreshData}
          />
          <MonthlyBalanceGraph monthlyBalances={appData.monthlyBalances} />
          <CreditCardList
            cards={activeCards}
            onEdit={setEditingCard}
            onDataChange={refreshData}
          />
        </div>

        <Card className="h-fit p-5">
          <CreditCardForm editingCard={editingCard} onCancel={() => setEditingCard(null)} onSaved={refreshData} />
        </Card>
      </div>
    </AppShell>
  );
}
