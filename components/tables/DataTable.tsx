"use client";

import { Column } from "@/lib/table/tableTypes";

interface Props<T> {

  columns: Column<T>[];

  rows: T[];

  onRowClick?: (row: T) => void;

  selectedRow?: T | null;

}

export function DataTable<T>({

  columns,

  rows,

  onRowClick,

  selectedRow,

}: Props<T>) {

  return (

    <div
      className="card"
      style={{
        marginTop: 20,
        overflow: "auto",
        maxHeight: "72vh",
        padding: 0,
      }}
    >

      <table
        className="table"
        style={{
          background: "#ffffff",
          color: "#111827",
        }}
      >

        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "#f8fafc",
          }}
        >

          <tr>

            {columns.map(column => (

              <th

                key={String(column.id)}

                className={
                  column.numeric
                    ? "num"
                    : undefined
                }

              >

                {column.title}

              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {rows.map((row, index) => {

            const selected =
              row === selectedRow;

            return (

              <tr

                key={index}

                className={
                  selected

                    ? "company-row company-row-selected"

                    : "company-row"
                }

                style={{
                  background:

                    selected

                      ? "#dbeafe"

                      : index % 2

                        ? "#f8fafc"

                        : "#ffffff",

                  cursor:

                    onRowClick

                      ? "pointer"

                      : "default",

                }}

                onClick={() =>

                  onRowClick?.(row)

                }

              >

                {columns.map(column => (

                  <td

                    key={String(column.id)}

                    className={
                      column.numeric
                        ? "num"
                        : undefined
                    }

                    style={{
                      color: "#111827",
                    }}

                  >

                    {column.render

                      ? column.render(row)

                      : String(
                          (row as any)[column.id]
                        )}

                  </td>

                ))}

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );

}