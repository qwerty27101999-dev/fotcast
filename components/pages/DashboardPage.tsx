import { DashboardCards } from "../layout/DashboardCards";

import { MonthlyPayrollTable } from "../dashboard/MonthlyPayrollTable";

import { MonthlyCostChart } from "../dashboard/MonthlyCostChart";

export function DashboardPage({
  payroll,
  headcount,
  months,
}: any) {

  return (

    <>

      <h2>Dashboard</h2>

      <DashboardCards
        payroll={payroll}
        headcount={headcount}
      />

      <br />

      <MonthlyCostChart
        payroll={payroll}
        months={months}
      />

      <br />

      <MonthlyPayrollTable
        payroll={payroll}
        months={months}
      />

    </>

  );

}