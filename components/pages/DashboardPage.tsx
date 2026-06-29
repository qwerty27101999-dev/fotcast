import { DashboardCards } from "../layout/DashboardCards";
import { MonthlyPayrollTable } from "../dashboard/MonthlyPayrollTable";

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

      <MonthlyPayrollTable
        payroll={payroll}
        months={months}
      />

    </>

  );

}