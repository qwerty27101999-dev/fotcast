import { buildDashboard } from "@/lib/dashboardEngine";
import { formatNumber } from "@/utils/formatNumber";

export function DashboardCards({
  payroll,
}: any) {

  const metrics =
    buildDashboard(payroll);

  return (

    <div className="kpi-row">

      <div className="card">

        <div className="card-title">
          Total Cost
        </div>

        <div className="card-value num">
          {formatNumber(metrics.totalCost)}
        </div>

      </div>

      <div className="card">

        <div className="card-title">
          Payroll
        </div>

        <div className="card-value num">
          {formatNumber(metrics.payroll)}
        </div>

      </div>

      <div className="card">

        <div className="card-title">
          Insurance
        </div>

        <div className="card-value num">
          {formatNumber(metrics.insurance)}
        </div>

      </div>

      <div className="card">

        <div className="card-title">
          Headcount
        </div>

        <div className="card-value num">
          {formatNumber(metrics.headcount)}
        </div>

      </div>

      <div className="card">

        <div className="card-title">
          Avg Cost / Employee
        </div>

        <div className="card-value num">
          {formatNumber(metrics.avgCost)}
        </div>

      </div>

      <div className="card">

        <div className="card-title">
          Avg Payroll
        </div>

        <div className="card-value num">
          {formatNumber(metrics.avgPayroll)}
        </div>

      </div>

    </div>

  );

}