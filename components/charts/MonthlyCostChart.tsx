"use client";

import {

  LineChart,

  Line,

  CartesianGrid,

  ResponsiveContainer,

  Tooltip,

  XAxis,

  YAxis,

} from "recharts";

export function MonthlyCostChart({

  data,

}: any) {

  const chartData = data.map((m: any) => ({

    month: new Date(
      2025,
      m.month,
      1
    ).toLocaleString("en", {
      month: "short",
    }),

    Payroll: Math.round(m.payroll),

    Insurance: Math.round(m.insurance),

    Total: Math.round(m.total),

  }));

  return (

    <div className="card chart-card">

      <div className="card-title">

        Monthly Cost Trend

      </div>

      <div style={{ height: 340 }}>

        <ResponsiveContainer>

          <LineChart data={chartData}>

            <CartesianGrid />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              dataKey="Payroll"
              stroke="#2563eb"
              strokeWidth={3}
            />

            <Line
              dataKey="Insurance"
              stroke="#10b981"
              strokeWidth={3}
            />

            <Line
              dataKey="Total"
              stroke="#ef4444"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}