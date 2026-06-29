import { DashboardCards } from "../layout/DashboardCards";

export function DashboardPage({
  payroll,
  headcount,
}: any) {
  return (
    <>
      <h2>Dashboard</h2>

      <DashboardCards
        payroll={payroll}
        headcount={headcount}
      />
    </>
  );
}