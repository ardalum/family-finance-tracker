import { useMemo, useState } from "react";
import Card from "../../../components/ui/Card.jsx";
import Select from "../../../components/ui/Select.jsx";
import { buildMonthOptions, getCurrentMonthKey } from "../../../lib/dates.js";
import { formatMonthLabel } from "../../../lib/formatters.js";
import RecurringGenerationPanel from "./RecurringGenerationPanel.jsx";
import RecurringPaymentForm from "./RecurringPaymentForm.jsx";
import RecurringPaymentTable from "./RecurringPaymentTable.jsx";
import RecurringSummary from "./RecurringSummary.jsx";

export default function RecurringPayments({
  creditCards,
  budgetsByMonth,
  recurringPayments,
  recurringStatusByMonth,
  transactions,
  onDataChange,
}) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [editingTemplate, setEditingTemplate] = useState(null);
  const monthOptions = useMemo(() => buildMonthOptions(selectedMonth), [selectedMonth]);
  const activeCards = creditCards.filter((card) => card.isActive);
  const categories = budgetsByMonth[selectedMonth] ?? [];

  function refreshRecurringData(nextData) {
    setEditingTemplate(null);
    onDataChange(nextData);
  }

  return (
    <section className="grid gap-6">
      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-gray-500">Recurring payments</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-gray-950">
              {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage bill templates and generate monthly spending transactions.
            </p>
          </div>
          <Select
            label="Generation month"
            value={selectedMonth}
            onChange={(event) => {
              setEditingTemplate(null);
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

      <RecurringSummary
        templates={recurringPayments}
        monthKey={selectedMonth}
        transactions={transactions}
      />

      <RecurringGenerationPanel
        monthKey={selectedMonth}
        templates={recurringPayments}
        transactions={transactions}
        recurringStatusByMonth={recurringStatusByMonth}
        categories={categories}
        onDataChange={onDataChange}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <RecurringPaymentTable
          templates={recurringPayments}
          cards={activeCards}
          categories={categories}
          onEdit={setEditingTemplate}
          onDataChange={refreshRecurringData}
        />

        <Card className="h-fit p-5">
          <RecurringPaymentForm
            cards={activeCards}
            categories={categories}
            editingTemplate={editingTemplate}
            onCancel={() => setEditingTemplate(null)}
            onSaved={refreshRecurringData}
          />
        </Card>
      </div>
    </section>
  );
}
