import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/formatters.js";

const colors = ["#111827", "#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#4b5563"];

export default function DashboardCharts({ chartData }) {
  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <ChartCard title="Spending by Category">
        {chartData.spendingByCategory.length === 0 ? <EmptyChart /> : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chartData.spendingByCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                {chartData.spendingByCategory.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Budget vs Spending">
        {chartData.budgetVsSpending.length === 0 ? <EmptyChart /> : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData.budgetVsSpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="budget" fill="#9ca3af" />
              <Bar dataKey="spent" fill="#111827" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Monthly Spending Trend">
        {chartData.monthlyTrend.length === 0 ? <EmptyChart /> : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="total" stroke="#111827" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </section>
  );
}

function ChartCard({ title, children }) {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-gray-300 text-sm text-gray-500">
      No data for this chart yet.
    </div>
  );
}
