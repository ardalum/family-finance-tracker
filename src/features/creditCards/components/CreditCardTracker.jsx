import { useMemo, useState } from "react";
import Card from "../../../components/ui/Card.jsx";
import CreditCardForm from "./CreditCardForm.jsx";
import CreditCardList from "./CreditCardList.jsx";
import CreditLimitSummary from "./CreditLimitSummary.jsx";
import MonthlyBalanceGraph from "./MonthlyBalanceGraph.jsx";
import MonthlyBalanceTable from "./MonthlyBalanceTable.jsx";

export default function CreditCardTracker({ creditCards, monthlyBalances, onDataChange }) {
  const [editingCard, setEditingCard] = useState(null);
  const activeCards = useMemo(
    () => creditCards.filter((card) => card.isActive),
    [creditCards],
  );

  function refreshCreditCardData(nextData) {
    setEditingCard(null);
    onDataChange(nextData);
  }

  return (
    <section className="grid gap-6">
      <CreditLimitSummary cards={activeCards} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-6">
          <MonthlyBalanceTable
            cards={activeCards}
            monthlyBalances={monthlyBalances}
            onDataChange={refreshCreditCardData}
          />
          <MonthlyBalanceGraph monthlyBalances={monthlyBalances} />
          <CreditCardList
            cards={activeCards}
            onEdit={setEditingCard}
            onDataChange={refreshCreditCardData}
          />
        </div>

        <Card className="h-fit p-5">
          <CreditCardForm
            editingCard={editingCard}
            onCancel={() => setEditingCard(null)}
            onSaved={refreshCreditCardData}
          />
        </Card>
      </div>
    </section>
  );
}
