import Card from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/formatters.js";

export default function RecurringOverview({ rows, summary }) {
  return (
    <Card>
      <div className="border-b border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-950">Recurring Payments Overview</h3>
        <p className="mt-1 text-sm text-gray-500">
          Estimate {formatCurrency(summary.estimatedTotal)} / Actual {formatCurrency(summary.actualTotal)} / Difference {formatCurrency(summary.difference)}
        </p>
      </div>
      {rows.length === 0 ? <Empty message="No recurring payments due this month." /> : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Bill</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Estimate</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const variableNeedsActual = row.template.billType === "variable" && row.status === "Not generated";
                const dueSoon = row.status !== "Generated" && row.daysUntilDue <= 7;
                const pastDue = row.status !== "Generated" && row.daysUntilDue < 0;
                return (
                  <tr key={row.template.id} className={pastDue ? "bg-red-100" : dueSoon || variableNeedsActual ? "bg-amber-50" : "bg-white"}>
                    <td className="px-5 py-4 font-semibold text-gray-950">{row.template.name}</td>
                    <td className="px-5 py-4 capitalize">{row.template.billType}</td>
                    <td className="px-5 py-4">{formatCurrency(row.template.estimatedAmount)}</td>
                    <td className="px-5 py-4">Day {row.template.dueDay}</td>
                    <td className="px-5 py-4">{row.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function Empty({ message }) {
  return <div className="p-8 text-center text-sm text-gray-500">{message}</div>;
}
