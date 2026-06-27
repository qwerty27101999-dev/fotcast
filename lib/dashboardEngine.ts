import { PayrollEmployee } from "./types";

export interface DashboardMetrics {
  totalCost: number;
  payroll: number;
  insurance: number;
  headcount: number;
  avgCost: number;
  avgPayroll: number;
}

export function buildDashboard(
  payroll: PayrollEmployee[]
): DashboardMetrics {

  const totalCost = payroll.reduce(
    (sum, employee) =>
      sum +
      employee.rows.reduce(
        (s, row) => s + row.total,
        0
      ),
    0
  );

  const payrollTotal = payroll.reduce(
    (sum, employee) =>
      sum +
      employee.rows.reduce(
        (s, row) => s + row.fot,
        0
      ),
    0
  );

  const insurance = payroll.reduce(
    (sum, employee) =>
      sum +
      employee.rows.reduce(
        (s, row) => s + row.insurance.total,
        0
      ),
    0
  );

  // Пока считаем количество сотрудников.
  // В Build 3 заменим на среднесписочную численность.
  const headcount = payroll.length;

  return {

    totalCost,

    payroll: payrollTotal,

    insurance,

    headcount,

    avgCost:
      headcount === 0
        ? 0
        : Math.round(totalCost / headcount),

    avgPayroll:
      headcount === 0
        ? 0
        : Math.round(payrollTotal / headcount),

  };

}