import Card from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/formatters.js";

export default function BudgetVsSpendingTable({ rows }) {
  return (
    <Card>
      <SectionHeader title="Budget vs Spending" />
      {rows.length === 0 ? <Empty message="No budget categories for this month." /> : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Spent</th>
                <th className="px-5 py-3">Remaining</th>
                <th className="px-5 py-3">Percent Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const over = row.remaining < 0;
                const near = row.percentUsed >= 90;
                return (
                  <tr key={row.category} className={over ? "bg-red-50" : near ? "bg-amber-50" : "bg-white"}>
                    <td className="px-5 py-4 font-semibold text-gray-950">{row.category}</td>
                    <td className="px-5 py-4">{formatCurrency(row.budget)}</td>
                    <td className="px-5 py-4">{formatCurrency(row.spent)}</td>
                    <td className={`px-5 py-4 font-semibold ${over ? "text-red-700" : "text-gray-950"}`}>{formatCurrency(row.remaining)}</td>
                    <td className="px-5 py-4">{row.percentUsed.toFixed(0)}%</td>
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

function SectionHeader({ title }) {
  return <h3 className="border-b border-gray-200 p-5 text-lg font-semibold text-gray-950">{title}</h3>;
}

function Empty({ message }) {
  return <div className="p-8 text-center text-sm text-gray-500">{message}</div>;
}
