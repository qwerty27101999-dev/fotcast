"use client";

import { useState } from "react";

import { DataColumn } from "./types";
import { TableFilterMenu } from "./TableFilterMenu";

interface Props<T> {
  columns: DataColumn<T>[];

  rows: T[];

  sortField: string | null;

  sortDirection: "asc" | "desc";

  onSort: (field: string) => void;

  columnFilters: Record<string, string[]>;

  onFilterChange: (
    columnId: string,
    values: string[]
  ) => void;

  getAvailableValues: (
    field: string
  ) => string[];

  getAllValues: (
    field: string
  ) => string[];
}

export function TableHeader<T>({
  columns,
  rows,
  sortField,
  sortDirection,
  onSort,
  columnFilters,
  onFilterChange,
  getAvailableValues,
  getAllValues,
}: Props<T>) {
  const [openedFilter, setOpenedFilter] =
    useState<string | null>(null);

  const [filterPosition, setFilterPosition] =
    useState({
      top: 0,
      left: 0,
    });

  return (
    <thead>
      <tr>
        {columns.map(column => {
          const id = String(column.id);

          //
          // Все значения столбца
          //

          const allValues =
            getAllValues(id);

          //
          // Доступные после остальных фильтров
          //

          const values =
            getAvailableValues(id);

          //
          // Если фильтр выключен —
          // считаем выбранными все значения
          //
          
          const selected =
            columnFilters[id] ??
            allValues;

          const filtered =
            selected.length !==
            allValues.length;

          return (
            <th
              key={id}
              style={{
                width: column.width,
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
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
                    onSort(id)
                  }
                >
                  {column.title}{" "}
                  {sortField === id
                    ? sortDirection ===
                      "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </span>

                {column.filterable && (
                  <button
                    type="button"
                    onClick={e => {
                      if (
                        openedFilter ===
                        id
                      ) {
                        setOpenedFilter(
                          null
                        );
                        return;
                      }

                      const rect =
                        e.currentTarget.getBoundingClientRect();

                      const menuWidth = 260;

const left =
  rect.right + menuWidth > window.innerWidth
    ? rect.right - menuWidth
    : rect.left;

setFilterPosition({
  top: rect.bottom + 6,
  left,
});

                      setOpenedFilter(
                        id
                      );
                    }}
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer",
                      color: filtered
                        ? "#2563eb"
                        : "#6b7280",
                    }}
                  >
                    ⏷
                  </button>
                )}
              </div>

              {openedFilter === id && (
                <TableFilterMenu
  values={values}
  allValues={allValues}
  selected={selected}

  formatValue={
    column.formatFilterValue ??
    ((value) => String(value))
  }

  position={filterPosition}

  onApply={next =>
    onFilterChange(id, next)
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