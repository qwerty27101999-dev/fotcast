"use client";

import { ReactNode, useMemo, useState } from "react";

export interface DataColumn<T> {

  id: keyof T | string;

  title: string;

  width?: number;

  align?: "left" | "center" | "right";

  sortable?: boolean;

  render: (row: T) => ReactNode;

}

interface Props<T> {

  rows: T[];

  columns: DataColumn<T>[];

  onRowClick?: (row: T) => void;

  selectedRow?: T | null;

  getRowKey: (row: T) => string;

}

type SortState<T> = {

  field: keyof T | string;

  direction: "asc" | "desc";

} | null;

export function DataTable<T>({

  rows,

  columns,

  onRowClick,

  selectedRow,

  getRowKey,

}: Props<T>) {

  const [sort, setSort] = useState<SortState<T>>(null);

  const [search, setSearch] = useState("");

  function handleSort(field: keyof T | string) {

    setSort(prev => {

      if (!prev || prev.field !== field) {

        return { field, direction: "asc" };

      }

      return {

        field,

        direction:

          prev.direction === "asc"

            ? "desc"

            : "asc",

      };

    });

  }

  const filteredRows = useMemo(() => {

    if (!search) return rows;

    const q = search.toLowerCase();

    return rows.filter(row => {

      return columns.some(col => {

        const value = (row as any)[col.id];

        if (value === null || value === undefined) {

          return false;

        }

        return String(value)

          .toLowerCase()

          .includes(q);

      });

    });

  }, [rows, search, columns]);

  const sortedRows = useMemo(() => {

    if (!sort) return filteredRows;

    const { field, direction } = sort;

    const copy = [...filteredRows];

    copy.sort((a: any, b: any) => {

      const aValue = a[field];

      const bValue = b[field];

      // numbers
      if (

        typeof aValue === "number" &&

        typeof bValue === "number"

      ) {

        return direction === "asc"

          ? aValue - bValue

          : bValue - aValue;

      }

      // dates
      if (

        aValue instanceof Date &&

        bValue instanceof Date

      ) {

        return direction === "asc"

          ? aValue.getTime() -

              bValue.getTime()

          : bValue.getTime() -

              aValue.getTime();

      }

      // fallback string
      return direction === "asc"

        ? String(aValue ?? "").localeCompare(

            String(bValue ?? "")

          )

        : String(bValue ?? "").localeCompare(

            String(aValue ?? "")

          );

    });

    return copy;

  }, [filteredRows, sort]);

  function getSortIcon(field: string) {

    if (!sort || sort.field !== field) {

      return "⇅";

    }

    return sort.direction === "asc"

      ? "▲"

      : "▼";

  }

  return (

    <div
      className="card"
      style={{
        padding: 0,
        overflow: "auto",
        maxHeight: "72vh",
      }}
    >

      {/* SEARCH BAR */}
      <div
        style={{
          padding: 10,
          borderBottom: "1px solid #1f1f1f",
          background: "#0f0f0f",
        }}
      >

        <input

          value={search}

          onChange={e =>
            setSearch(e.target.value)
          }

          placeholder="Search..."

          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            background: "#141414",
            color: "#eaeaea",
            outline: "none",
          }}

        />

      </div>

      <table
        className="table"
        style={{
          background: "#fff",
          color: "#111827",
        }}
      >

        <thead>

          <tr>

            {columns.map(column => {

              const isSortable = column.sortable;

              return (

                <th
                  key={String(column.id)}
                  onClick={() =>
                    isSortable &&
                    handleSort(column.id)
                  }
                  style={{
                    width: column.width,
                    textAlign:
                      column.align ?? "left",
                    cursor: isSortable
                      ? "pointer"
                      : "default",
                    userSelect: "none",
                  }}
                >

                  {column.title}{" "}

                  {isSortable &&
                    getSortIcon(
                      String(column.id)
                    )}

                </th>

              );

            })}

          </tr>

        </thead>

        <tbody>

          {sortedRows.map(row => {

            const selected =

              selectedRow &&

              getRowKey(selectedRow) ===

              getRowKey(row);

            return (

              <tr

                key={getRowKey(row)}

                className={
                  selected
                    ? "company-row company-row-selected"
                    : "company-row"
                }

                onClick={() =>
                  onRowClick?.(row)
                }

                style={{

                  cursor:

                    onRowClick

                      ? "pointer"

                      : "default",

                }}

              >

                {columns.map(column => (

                  <td

                    key={String(column.id)}

                    className={
                      column.align === "right"
                        ? "num"
                        : ""
                    }

                    style={{
                      textAlign:
                        column.align ?? "left",
                      color: "#111827",
                    }}

                  >

                    {column.render(row)}

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