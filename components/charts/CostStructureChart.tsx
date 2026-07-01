"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export function CostStructureChart({
  data,
}: any) {

  return (

    <div className="card">

      <div className="card-title">

        Cost Structure

      </div>

      <div
        style={{
          height: 380,
        }}
      >

        <ResponsiveContainer>

          <PieChart>

            <Pie

              data={data}

              dataKey="value"

              nameKey="name"

              outerRadius={120}

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

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}