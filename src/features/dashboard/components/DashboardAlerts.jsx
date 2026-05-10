import Card from "../../../components/ui/Card.jsx";
import { getAlerts } from "../dashboardUtils.js";

export default function DashboardAlerts({ data }) {
  const alerts = getAlerts(data);

  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold text-gray-950">Alerts</h3>
      {alerts.length === 0 ? (
        <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Everything looks okay for the selected month.
        </p>
      ) : (
        <div className="mt-4 grid gap-2">
          {alerts.map((alert, index) => (
            <div
              key={`${alert.text}-${index}`}
              className={`rounded-md border px-3 py-2 text-sm ${
                alert.type === "danger"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {alert.text}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
