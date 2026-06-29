"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function DepartmentCostChart({
  payroll,
}: any) {

  const departments = new Map<
    string,
    number
  >();

  payroll.forEach((employee: any) => {

    const total =
      employee.rows.reduce(
        (s: number, r: any) => s + r.total,
        0
      );

    departments.set(

      employee.department,

      (departments.get(employee.department) ?? 0)
      + total

    );

  });

  const data =
    Array.from(departments.entries())

      .map(([department, total]) => ({

        department,

        total: Math.round(total),

      }))

      .sort(
        (a, b) =>
          b.total - a.total
      );

  return (

    <div className="card">

      <div className="card-title">

        Department Cost Breakdown

      </div>

      <div style={{ height: 360 }}>

        <ResponsiveContainer>

          <BarChart
            data={data}
          >

            <CartesianGrid />

            <XAxis
              dataKey="department"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[6,6,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}