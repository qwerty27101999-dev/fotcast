import { DashboardCards } from "../layout/DashboardCards";

import { MonthlyCostChart } from "../charts/MonthlyCostChart";
import { HeadcountChart } from "../charts/HeadcountChart";
import { DepartmentCostChart } from "../charts/DepartmentCostChart";
import { CostStructureChart } from "../charts/CostStructureChart";

import { buildDashboardData } from "@/lib/dashboard/dashboardEngine";

export function DashboardPage({

  payroll,

  headcount,

}: any) {

  const dashboard = buildDashboardData(

    payroll,

    headcount

  );

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
            data={dashboard.monthly}
          />

        </div>

        <div className="dashboard-row two">

          <HeadcountChart
            data={dashboard.headcountTrend}
          />

          <CostStructureChart
            data={dashboard.structure}
          />

        </div>

        <div className="dashboard-row">

          <DepartmentCostChart
            data={dashboard.departmentData}
          />

        </div>

      </div>

    </>

  );

}