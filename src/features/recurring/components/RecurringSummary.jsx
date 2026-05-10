import Card from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/formatters.js";
import { getRecurringSummary } from "../recurringService.js";

export default function RecurringSummary({ templates, monthKey, transactions }) {
  const summary = getRecurringSummary(templates, monthKey, transactions);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <SummaryTile label="Fixed recurring" value={summary.fixedTotal} />
      <SummaryTile label="Estimated variable" value={summary.variableTotal} />
      <SummaryTile label="Estimated total" value={summary.estimatedTotal} />
      <SummaryTile label="Actual generated" value={summary.actualTotal} />
      <SummaryTile label="Difference" value={summary.difference} />
    </section>
  );
}

function SummaryTile({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-normal text-gray-950">
        {formatCurrency(value)}
      </p>
    </Card>
  );
}
