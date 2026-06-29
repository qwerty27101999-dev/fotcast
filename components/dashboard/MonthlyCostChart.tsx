"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { PayrollEmployee } from "@/lib/types";

interface Props {
  payroll: PayrollEmployee[];
  months: Date[];
}

export function MonthlyCostChart({
  payroll,
  months,
}: Props) {

  const data = months.map((month, i) => {

    let payrollSum = 0;
    let insurance = 0;
    let total = 0;

    payroll.forEach(emp => {

      payrollSum += emp.rows[i].fot;

      insurance += emp.rows[i].insurance.total;

      total += emp.rows[i].total;

    });

    return {

      month: month.toLocaleString("en", {
        month: "short",
      }),

      Payroll: payrollSum,

      Insurance: insurance,

      Total: total,

    };

  });

  return (

    <div className="card">

      <div className="card-title">

        Monthly Cost Trend

      </div>

      <div
        style={{
          width: "100%",
          height: 380,
        }}
      >

        <ResponsiveContainer>

          <LineChart data={data}>

            <CartesianGrid stroke="#2a2a2a" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              dataKey="Payroll"
              stroke="#3b82f6"
              strokeWidth={3}
            />

            <Line
              dataKey="Insurance"
              stroke="#10b981"
              strokeWidth={3}
            />

            <Line
              dataKey="Total"
              stroke="#f59e0b"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}