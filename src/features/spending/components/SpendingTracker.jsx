import { useMemo, useState } from "react";
import Card from "../../../components/ui/Card.jsx";
import Select from "../../../components/ui/Select.jsx";
import { buildMonthOptions, getCurrentMonthKey } from "../../../lib/dates.js";
import { formatMonthLabel } from "../../../lib/formatters.js";
import SpendingSummary from "./SpendingSummary.jsx";
import TransactionForm from "./TransactionForm.jsx";
import TransactionTable from "./TransactionTable.jsx";
import { getMonthTransactions } from "../spendingService.js";

export default function SpendingTracker({
  creditCards,
  budgetsByMonth,
  transactions,
  onDataChange,
}) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ cardId: "", categoryId: "", store: "" });
  const monthOptions = useMemo(() => buildMonthOptions(selectedMonth), [selectedMonth]);
  const activeCards = creditCards.filter((card) => card.isActive);
  const categories = budgetsByMonth[selectedMonth] ?? [];
  const monthTransactions = useMemo(
    () => getMonthTransactions(transactions, selectedMonth),
    [selectedMonth, transactions],
  );

  function refreshSpendingData(nextData) {
    setEditingTransaction(null);
    onDataChange(nextData);
  }

  return (
    <section className="grid gap-6">
      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-gray-500">Spending tracker</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-gray-950">
              {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Track transactions separately from cards and budgets.
            </p>
          </div>
          <Select
            label="Spending month"
            value={selectedMonth}
            onChange={(event) => {
              setEditingTransaction(null);
              setFilters({ cardId: "", categoryId: "", store: "" });
              setSelectedMonth(event.target.value);
            }}
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <SpendingSummary
        transactions={monthTransactions}
        cards={activeCards}
        categories={categories}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <TransactionTable
          transactions={monthTransactions}
          cards={activeCards}
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          onEdit={setEditingTransaction}
          onDataChange={refreshSpendingData}
        />

        <Card className="h-fit p-5">
          <TransactionForm
            monthKey={selectedMonth}
            cards={activeCards}
            categories={categories}
            editingTransaction={editingTransaction}
            onCancel={() => setEditingTransaction(null)}
            onSaved={refreshSpendingData}
          />
        </Card>
      </div>
    </section>
  );
}
