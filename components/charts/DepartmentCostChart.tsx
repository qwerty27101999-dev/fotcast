"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { formatNumber } from "@/utils/formatNumber";

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
  "#dbeafe",
];

export function DepartmentCostChart({
  data,
}: any) {

  return (

    <div className="card chart-card">

      <div className="card-title">

        Department Cost Breakdown

      </div>

      <div style={{ height: 360 }}>

        <ResponsiveContainer>

          <BarChart data={data}>

            <CartesianGrid />

            <XAxis
              dataKey="department"
            />

            <YAxis
              tickFormatter={(v) =>
                formatNumber(v)
              }
            />

            <Tooltip
              formatter={(v: any) =>
                formatNumber(v)
              }
            />

            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
            >

              {data.map((_: any, index: number) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}