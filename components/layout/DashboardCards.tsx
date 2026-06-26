import { formatNumber } from "@/utils/formatNumber";

export function DashboardCards({ payroll }: any) {

  const totalCost = payroll.reduce(
    (sum: number, p: any) =>
      sum + p.rows.reduce((s: number, r: any) => s + r.total, 0),
    0
  );

  const hc = payroll.length;

  const fot = payroll.reduce(
    (sum: number, p: any) =>
      sum + p.rows.reduce((s: number, r: any) => s + r.fot, 0),
    0
  );

  const insurance = payroll.reduce(
    (sum: number, p: any) =>
      sum + p.rows.reduce((s: number, r: any) => s + r.insurance.total, 0),
    0
  );

  return (
  <div className="cards">

    <div className="card">
      Total Cost: {formatNumber(totalCost)}
    </div>

    <div className="card">
      Headcount: {formatNumber(hc)}
    </div>

    <div className="card">
      FOT: {formatNumber(fot)}
    </div>

    <div className="card">
      Insurance: {formatNumber(insurance)}
    </div>

  </div>
);
}