"use client";

import {

  ResponsiveContainer,

  LineChart,

  Line,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

} from "recharts";

import { buildMonthlyHeadcount }
from "@/lib/dashboard/headcountMetrics";

export function HeadcountChart({
  headcount,
}: any) {

  const metrics =
    buildMonthlyHeadcount(headcount);

  const data = metrics.map((m) => ({

    month: new Date(
      2025,
      m.month,
      1
    ).toLocaleString("en", {
      month: "short",
    }),

    HC: m.value,

  }));

  return (

    <div className="card chart-card">

      <div className="card-title">
        Headcount Trend
      </div>

      <div style={{ height: 340 }}>

        <ResponsiveContainer>

          <LineChart
            data={data}
          >

            <CartesianGrid />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              dataKey="HC"
              stroke="#8b5cf6"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}