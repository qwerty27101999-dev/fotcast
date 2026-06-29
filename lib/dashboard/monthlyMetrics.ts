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

      payroll.forEach(employee => {

        payrollSum += employee.rows[month].fot;

        insuranceSum +=
          employee.rows[month].insurance.total;

        totalSum +=
          employee.rows[month].total;

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