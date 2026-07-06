"use client";

import { useMemo, useState } from "react";

import { DataColumn } from "./types";
import { TableFilterMenu } from "./TableFilterMenu";

interface Props<T> {

  columns: DataColumn<T>[];

  rows: T[];

  sortField: string | null;

  sortDirection: "asc" | "desc";

  onSort: (field: string) => void;

  columnFilters: Record<string, Set<string>>;

  onFilterChange: (

    columnId: string,

    values: Set<string>

  ) => void;

}

export function TableHeader<T>({

  columns,

  rows,

  sortField,

  sortDirection,

  onSort,

  columnFilters,

  onFilterChange,

}: Props<T>) {

  const [openedFilter, setOpenedFilter] =

    useState<string | null>(null);

  return (

    <thead>

      <tr>

        {columns.map(column => {

          const values = useMemo(() => {

            const unique = new Set<string>();

            rows.forEach(row => {

              const value = column.getValue

                ? column.getValue(row)

                : (row as any)[column.id];

              unique.add(String(value ?? ""));

            });

            return [...unique].sort();

          }, [rows]);

          const selected =

            columnFilters[String(column.id)] ??

            new Set(values);

          const filtered =

            selected.size !== values.length;

          return (

            <th

              key={String(column.id)}

              style={{

                width: column.width,

                position: "relative",

                userSelect: "none",

                whiteSpace: "nowrap",

              }}

            >

              <div

                style={{

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: 6,

                }}

              >

                <span

                  style={{

                    cursor:

                      column.sortable

                        ? "pointer"

                        : "default",

                  }}

                  onClick={() =>

                    column.sortable &&

                    onSort(String(column.id))

                  }

                >

                  {column.title}

                  {" "}

                  {sortField === String(column.id)

                    ? sortDirection === "asc"

                      ? "▲"

                      : "▼"

                    : ""}

                </span>

                {column.filterable && (

                  <button

                    type="button"

                    onClick={() =>

                      setOpenedFilter(prev =>

                        prev === String(column.id)

                          ? null

                          : String(column.id)

                      )

                    }

                    style={{

                      border: "none",

                      background: "transparent",

                      cursor: "pointer",

                      color:

                        filtered

                          ? "#2563eb"

                          : "#6b7280",

                      fontSize: 13,

                    }}

                  >

                    ⏷

                  </button>

                )}

              </div>

              {openedFilter === String(column.id) && (

                <TableFilterMenu

                  values={values}

                  selected={selected}

                  onApply={(next) =>

                    onFilterChange(

                      String(column.id),

                      next

                    )

                  }

                  onClose={() =>

                    setOpenedFilter(null)

                  }

                />

              )}

            </th>

          );

        })}

      </tr>

    </thead>

  );

}