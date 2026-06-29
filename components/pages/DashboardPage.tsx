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

      <div className="dashboard-grid">

        <div className="dashboard-row">

          <MonthlyCostChart
            payroll={payroll}
          />

        </div>

        <div className="dashboard-row two">

          <HeadcountChart
            headcount={headcount}
          />

          <CostStructureChart
            payroll={payroll}
          />

        </div>

        <div className="dashboard-row">

          <DepartmentCostChart
            payroll={payroll}
          />

        </div>

      </div>

    </>

  );

}