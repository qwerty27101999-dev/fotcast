import { DashboardCards } from "../layout/DashboardCards";

import { MonthlyCostChart } from "../charts/MonthlyCostChart";
import { HeadcountChart } from "../charts/HeadcountChart";
import { DepartmentCostChart } from "../charts/DepartmentCostChart";
import { CostStructureChart } from "../charts/CostStructureChart";

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

      <MonthlyCostChart
        payroll={payroll}
      />

      <HeadcountChart
        headcount={headcount}
      />

      <DepartmentCostChart
        payroll={payroll}
      />

      <CostStructureChart
        payroll={payroll}
      />

    </>
  );
}