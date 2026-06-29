"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

import { formatNumber } from "@/utils/formatNumber";

const COLORS = {
  Salary: "#2563eb",
  "Monthly Bonus": "#16a34a",
  "Quarterly Bonus": "#f59e0b",
  "Annual Bonus": "#dc2626",
  Insurance: "#7c3aed",
};

export function CostStructureChart({
  payroll,
}: any) {

  let fixed = 0;
  let monthly = 0;
  let quarterly = 0;
  let annual = 0;
  let insurance = 0;

  payroll.forEach((employee: any) => {

    employee.rows.forEach((row: any) => {

      fixed += row.fixedPay;
      monthly += row.monthlyBonus;
      quarterly += row.quarterlyBonus;
      annual += row.annualBonus;
      insurance += row.insurance.total;

    });

  });

  const data = [

    {
      name: "Salary",
      value: Math.round(fixed),
    },

    {
      name: "Monthly Bonus",
      value: Math.round(monthly),
    },

    {
      name: "Quarterly Bonus",
      value: Math.round(quarterly),
    },

    {
      name: "Annual Bonus",
      value: Math.round(annual),
    },

    {
      name: "Insurance",
      value: Math.round(insurance),
    },

  ].filter((x) => x.value > 0);

  return (

    <div className="card chart-card">

      <div className="card-title">
        Cost Structure
      </div>

      <div style={{ height: 380 }}>

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[
                      entry.name as keyof typeof COLORS
                    ]
                  }
                />

              ))}

            </Pie>

            <Tooltip
              formatter={(value: any) =>
                formatNumber(value)
              }
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}