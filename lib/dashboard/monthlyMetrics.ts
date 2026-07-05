import { PayrollEmployee } from "../types";

export interface MonthlyMetric {
  month: number;

  payroll: number;

  insurance: number;

  total: number;
}

export function buildMonthlyMetrics(
  payroll: PayrollEmployee[]
): MonthlyMetric[] {

  return Array.from(
    { length: 12 },
    (_, month) => {

      let payrollSum = 0;
      let insuranceSum = 0;
      let totalSum = 0;

      payroll.forEach((employee) => {

        const row = employee.rows[month];

        if (!row) {
          return;
        }

        payrollSum += row.fot;

        insuranceSum += row.insurance.total;

        totalSum += row.total;

      });

      return {
        month,

        payroll: payrollSum,

        insurance: insuranceSum,

        total: totalSum,
      };

    }
  );

}