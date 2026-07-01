import { buildMonthlyMetrics } from "./monthlyMetrics";
import { buildMonthlyHeadcount } from "./headcountMetrics";

export function buildDashboardData(
  payroll: any[],
  headcount: any[]
) {
  const monthly = buildMonthlyMetrics(payroll);

  const headcountTrend =
    buildMonthlyHeadcount(headcount);

  const departments = new Map<
    string,
    number
  >();

  payroll.forEach((employee: any) => {

    const total =
      employee.rows.reduce(
        (sum: number, row: any) =>
          sum + row.total,
        0
      );

    departments.set(

      employee.department,

      (departments.get(employee.department) ?? 0)
      + total

    );

  });

  const departmentData =

    Array.from(
      departments.entries()
    )

      .map(([department, total]) => ({

        department,

        total,

      }))

      .sort(
        (a, b) =>
          b.total - a.total
      );

  let fixed = 0;
  let monthlyBonus = 0;
  let quarterlyBonus = 0;
  let annualBonus = 0;
  let insurance = 0;

  payroll.forEach((employee: any) => {

    employee.rows.forEach((row: any) => {

      fixed += row.fixedPay;

      monthlyBonus += row.monthlyBonus;

      quarterlyBonus += row.quarterlyBonus;

      annualBonus += row.annualBonus;

      insurance += row.insurance.total;

    });

  });

  const structure = [

    {
      name: "Salary",
      value: fixed,
    },

    {
      name: "Monthly Bonus",
      value: monthlyBonus,
    },

    {
      name: "Quarterly Bonus",
      value: quarterlyBonus,
    },

    {
      name: "Annual Bonus",
      value: annualBonus,
    },

    {
      name: "Insurance",
      value: insurance,
    },

  ].filter(x => x.value > 0);

  return {

    monthly,

    headcountTrend,

    departmentData,

    structure,

  };

}