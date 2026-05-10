import { useEffect, useMemo, useState } from "react";
import Card from "../../../components/ui/Card.jsx";
import Select from "../../../components/ui/Select.jsx";
import { buildMonthOptions, getCurrentMonthKey } from "../../../lib/dates.js";
import { formatCurrency, formatMonthLabel } from "../../../lib/formatters.js";
import BudgetForm from "./BudgetForm.jsx";
import BudgetTable from "./BudgetTable.jsx";
import { ensureMonthBudgets, getTotalMonthlyBudget } from "../budgetsService.js";

export default function BudgetTracker({ budgetsByMonth, onDataChange }) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [editingBudget, setEditingBudget] = useState(null);
  const monthOptions = useMemo(() => buildMonthOptions(selectedMonth), [selectedMonth]);
  const budgets = budgetsByMonth[selectedMonth] ?? [];
  const totalBudget = getTotalMonthlyBudget(budgets);

  useEffect(() => {
    if (!Array.isArray(budgetsByMonth[selectedMonth])) {
      onDataChange(ensureMonthBudgets(selectedMonth));
    }
  }, [budgetsByMonth, onDataChange, selectedMonth]);

  function refreshBudgetData(nextData) {
    setEditingBudget(null);
    onDataChange(nextData);
  }

  return (
    <section className="grid gap-6">
      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-gray-500">Budget tracker</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-gray-950">
              {formatCurrency(totalBudget)}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Total monthly budget for {formatMonthLabel(selectedMonth)}
            </p>
          </div>
          <Select
            label="Budget month"
            value={selectedMonth}
            onChange={(event) => {
              setEditingBudget(null);
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <BudgetTable
          budgets={budgets}
          monthKey={selectedMonth}
          onEdit={setEditingBudget}
          onDataChange={refreshBudgetData}
        />

        <Card className="h-fit p-5">
          <BudgetForm
            monthKey={selectedMonth}
            editingBudget={editingBudget}
            onCancel={() => setEditingBudget(null)}
            onSaved={refreshBudgetData}
          />
        </Card>
      </div>
    </section>
  );
}
