import Card from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/formatters.js";
import { getOwnerCreditLimitTotal } from "../creditCardsService.js";

export default function CreditLimitSummary({ cards }) {
  const arvinTotal = getOwnerCreditLimitTotal(cards, "Arvin");
  const kristineTotal = getOwnerCreditLimitTotal(cards, "Kristine");
  const combinedTotal = arvinTotal + kristineTotal;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SummaryTile label="Arvin total limit" value={formatCurrency(arvinTotal)} />
      <SummaryTile label="Kristine total limit" value={formatCurrency(kristineTotal)} />
      <SummaryTile label="Combined total limit" value={formatCurrency(combinedTotal)} emphasis />
    </section>
  );
}

function SummaryTile({ label, value, emphasis = false }) {
  return (
    <Card className={`p-5 ${emphasis ? "border-gray-950" : ""}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-normal text-gray-950">{value}</p>
    </Card>
  );
}
