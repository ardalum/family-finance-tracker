import LinkedCardName from "../../../components/shared/LinkedCardName.jsx";
import Card from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/formatters.js";
import { getCardName, getCategoryName } from "../../spending/spendingService.js";

export default function RecentTransactionsTable({ transactions, cards, categories }) {
  return (
    <Card>
      <h3 className="border-b border-gray-200 p-5 text-lg font-semibold text-gray-950">Recent Transactions</h3>
      {transactions.length === 0 ? <div className="p-8 text-center text-sm text-gray-500">No transactions for this month.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Merchant</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Payment method</th>
                <th className="px-5 py-3">Card used</th>
                <th className="px-5 py-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => {
                const card = cards.find((item) => item.id === transaction.cardId);
                return (
                  <tr key={transaction.id} className="bg-white">
                    <td className="px-5 py-4">{transaction.date}</td>
                    <td className="px-5 py-4 font-semibold text-gray-950">{transaction.merchant}</td>
                    <td className="px-5 py-4">{transaction.splits.map((split) => getCategoryName(split.categoryId, categories)).join(", ")}</td>
                    <td className="px-5 py-4 font-semibold">{formatCurrency(transaction.amount)}</td>
                    <td className="px-5 py-4">{transaction.paymentMethod || "Credit Card"}</td>
                    <td className="px-5 py-4">{card ? <LinkedCardName card={card} /> : getCardName(transaction.cardId, cards)}</td>
                    <td className="px-5 py-4">
                      {transaction.source === "recurring" ? (
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">Recurring</span>
                      ) : "manual"}
                    </td>
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
