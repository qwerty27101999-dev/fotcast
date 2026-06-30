import { useState } from "react";

import { DashboardCards } from "../layout/DashboardCards";

import { MonthlyCostChart } from "../charts/MonthlyCostChart";
import { HeadcountChart } from "../charts/HeadcountChart";
import { DepartmentCostChart } from "../charts/DepartmentCostChart";
import { CostStructureChart } from "../charts/CostStructureChart";

type DashboardView =
  | "monthly"
  | "quarterly"
  | "yearly";

export function DashboardPage({
  payroll,
  headcount,
}: any) {

  const [view, setView] =
    useState<DashboardView>("monthly");

  return (

    <>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >

        <h2
          style={{
            margin: 0,
          }}
        >
          Dashboard
        </h2>

        <select
          value={view}
          onChange={(e) =>
            setView(
              e.target.value as DashboardView
            )
          }
        >

          <option value="monthly">
            Monthly
          </option>

          <option value="quarterly">
            Quarterly (coming soon)
          </option>

          <option value="yearly">
            Yearly (coming soon)
          </option>

        </select>

      </div>

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