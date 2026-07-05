"use client";

import { ReactNode, useMemo, useState } from "react";

export interface DataColumn<T> {

  id: keyof T | string;

  title: string;

  width?: number;

  align?: "left" | "center" | "right";

  sortable?: boolean;

  render?: (row: T) => ReactNode;

}

interface Filters<T> {

  departmentKey?: keyof T;

  department?: string | null;

  dateKey?: keyof T;

  dateFrom?: Date | null;

  dateTo?: Date | null;

}

interface Props<T> {

  rows: T[];

  columns: DataColumn<T>[];

  getRowKey: (row: T) => string;

  onRowClick?: (row: T) => void;

  selectedRow?: T | null;

  filters?: Filters<T>;

}

type SortState<T> = {

  field: keyof T | string;

  direction: "asc" | "desc";

} | null;

export function DataTable<T>({

  rows,

  columns,

  getRowKey,

  onRowClick,

  selectedRow,

  filters,

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

  // =========================
  // PIPELINE FILTER ENGINE
  // =========================

  const processedRows = useMemo(() => {

    let result = [...rows];

    // 1. Department filter
    if (filters?.department && filters.departmentKey) {

      result = result.filter(row => {

        return (

          String((row as any)[filters.departmentKey!]) ===

          filters.department

        );

      });

    }

    // 2. Date range filter
    if (filters?.dateKey) {

      result = result.filter(row => {

        const value = (row as any)[filters.dateKey!];

        if (!value) return true;

        const date = new Date(value);

        if (filters.dateFrom && date < filters.dateFrom) {

          return false;

        }

        if (filters.dateTo && date > filters.dateTo) {

          return false;

        }

        return true;

      });

    }

    // 3. Search filter
    if (search) {

      const q = search.toLowerCase();

      result = result.filter(row => {

        return columns.some(col => {

          const value = (row as any)[col.id];

          return String(value ?? "")

            .toLowerCase()

            .includes(q);

        });

      });

    }

    // 4. Sort
    if (sort) {

      const { field, direction } = sort;

      result.sort((a: any, b: any) => {

        const aValue = a[field];

        const bValue = b[field];

        if (

          typeof aValue === "number" &&

          typeof bValue === "number"

        ) {

          return direction === "asc"

            ? aValue - bValue

            : bValue - aValue;

        }

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

        return direction === "asc"

          ? String(aValue ?? "").localeCompare(

              String(bValue ?? "")

            )

          : String(bValue ?? "").localeCompare(

              String(aValue ?? "")

            );

      });

    }

    return result;

  }, [rows, filters, search, sort, columns]);

  function getSortIcon(field: string) {

    if (!sort || sort.field !== field) return "⇅";

    return sort.direction === "asc" ? "▲" : "▼";

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

      {/* SEARCH */}
      <div
        style={{
          padding: 10,
          borderBottom: "1px solid #1f1f1f",
          background: "#0f0f0f",
        }}
      >

        <input

          value={search}

          onChange={e => setSearch(e.target.value)}

          placeholder="Search..."

          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            background: "#141414",
            color: "#eaeaea",
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
                    cursor: isSortable
                      ? "pointer"
                      : "default",
                    userSelect: "none",
                  }}
                >

                  {column.title}{" "}

                  {isSortable &&
                    getSortIcon(String(column.id))}

                </th>

              );

            })}

          </tr>

        </thead>

        <tbody>

          {processedRows.map(row => {

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

                onClick={() => onRowClick?.(row)}

                style={{
                  cursor: onRowClick
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