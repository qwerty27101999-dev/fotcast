import { buildDashboardMetrics } from "@/lib/metrics";
import { formatNumber } from "@/utils/formatNumber";

export function DashboardCards({
  payroll,
  headcount,
}: any) {

  // нормализуем headcount в безопасный массив чисел
  const monthlyHeadcount: number[] = Array.from(
    { length: 12 },
    (_, month) =>
      (headcount || []).reduce((sum: number, dep: any) => {
        const val = Number(dep?.[month] ?? 0);
        return sum + (isNaN(val) ? 0 : val);
      }, 0)
  );

  const metrics = buildDashboardMetrics(
    payroll,
    monthlyHeadcount
  );

  return (
    <div className="kpi-row">

      <div className="card">
        <div className="card-title">Total Cost</div>
        <div className="card-value num">
          {formatNumber(metrics.totalCost)}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Payroll</div>
        <div className="card-value num">
          {formatNumber(metrics.totalFOT)}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Insurance</div>
        <div className="card-value num">
          {formatNumber(metrics.insurance)}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Avg HC</div>
        <div className="card-value num">
          {formatNumber(Math.round(metrics.avgHeadcount))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Peak HC</div>
        <div className="card-value num">
          {formatNumber(metrics.peakHeadcount)}
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          Avg Cost / Employee
        </div>

        <div className="card-value num">
          {formatNumber(
            Math.round(metrics.avgCostPerEmployee)
          )}
        </div>
      </div>

    </div>
  );
}