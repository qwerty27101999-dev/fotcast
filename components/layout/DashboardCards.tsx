import { buildDashboardMetrics } from "@/lib/metrics";
import { formatNumber } from "@/utils/formatNumber";

export function DashboardCards({
  payroll,
  headcount,
}: any) {

  const monthlyHeadcount: number[] = Array.from(
    { length: 12 },
    (_, month) =>
      (headcount || []).reduce(
        (sum: number, dep: any) =>
          sum + Number(dep?.[month] ?? 0),
        0
      )
  );

  const metrics =
    buildDashboardMetrics(
      payroll,
      monthlyHeadcount
    );

  const cards = [

    {
      title: "Total Cost",
      value: metrics.totalCost,
      trend: null,
      type: "currency",
    },

    {
      title: "Payroll",
      value: metrics.totalFOT,
      trend: null,
      type: "currency",
    },

    {
      title: "Insurance",
      value: metrics.insurance,
      trend: null,
      type: "currency",
    },

    {
      title: "Average HC",
      value: Math.round(
        metrics.avgHeadcount
      ),
      trend: null,
      type: "headcount",
    },

    {
      title: "Peak HC",
      value: metrics.peakHeadcount,
      trend: null,
      type: "headcount",
    },

    {
      title: "Avg Cost / Employee",
      value: Math.round(
        metrics.avgCostPerEmployee
      ),
      trend: null,
      type: "currency",
    },

  ];

  return (

    <div className="kpi-row">

      {cards.map((card) => (

        <div
          key={card.title}
          className="card"
        >

          <div className="card-title">

            {card.title}

          </div>

          <div className="card-value num">

            {formatNumber(card.value)}

            {card.type === "currency"
              ? " ₽"
              : ""}

          </div>

          {card.trend !== null && (

            <div
              className={
                card.trend >= 0
                  ? "kpi-trend up"
                  : "kpi-trend down"
              }
            >

              {card.trend >= 0
                ? "▲"
                : "▼"}

              {" "}

              {Math.abs(card.trend)}%

              {" · vs previous month"}

            </div>

          )}

        </div>

      ))}

    </div>

  );

}