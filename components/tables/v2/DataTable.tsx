"use client";

import { useState } from "react";

import { useTablePipeline, SortState } from "@/hooks/useTablePipeline";
import { useFilterEngine } from "@/hooks/useFilterEngine";

import { DataColumn } from "./types";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

interface Props<T> {
  rows: T[];
  columns: DataColumn<T>[];
  getRowKey: (row: T) => string;
  selectedRow?: T | null;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  selectedRow,
  onRowClick,
}: Props<T>) {

  const [globalSearch, setGlobalSearch] =
    useState("");

  const [sort, setSort] =
    useState<SortState<T> | null>(null);

  const [columnFilters, setColumnFilters] =
    useState<Record<string, string[]>>({});

  function handleSort(field: string) {

    setSort(prev => {

      if (!prev || prev.field !== field) {

        return {
          field,
          direction: "asc",
        };

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

  function handleFilterChange(
    columnId: string,
    values: string[]
  ) {

    setColumnFilters(prev => {
  const next = { ...prev };

  if (
    values.length === 0 ||
    values.length === getAvailableValues(columnId).length
  ) {
    delete next[columnId];
  } else {
    next[columnId] = values;
  }

  return next;
});

  }

  const {

    filteredRows,

    getAvailableValues,

  } = useFilterEngine({

    rows,

    columnFilters,

  });

  const processedRows =
    useTablePipeline({

      rows: filteredRows,

      columns,

      search: globalSearch,

      sort,

    });

  return (

    <div
      className="card"
      style={{
        padding: 0,
        overflow: "visible",
      }}
    >

      <div
        style={{
          padding: 10,
          borderBottom: "1px solid #1f1f1f",
          background: "#0f0f0f",
        }}
      >

        <input
          value={globalSearch}
          onChange={e =>
            setGlobalSearch(e.target.value)
          }
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

      <div
  style={{
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "72vh",
    position: "relative",
  }}
>

        <table
          className="table"
          style={{
            background: "#fff",
            color: "#111827",
          }}
        >

          <TableHeader
            columns={columns}
            rows={filteredRows}
            sortField={
              sort
                ? String(sort.field)
                : null
            }
            sortDirection={
              sort?.direction ?? "asc"
            }
            onSort={handleSort}
            columnFilters={columnFilters}
            onFilterChange={handleFilterChange}
            getAvailableValues={
              getAvailableValues
            }
          />

          <tbody>

            {processedRows.map(row => (

              <TableRow
                key={getRowKey(row)}
                row={row}
                columns={columns}
                selected={
                  selectedRow
                    ? getRowKey(selectedRow) ===
                      getRowKey(row)
                    : false
                }
                onClick={() =>
                  onRowClick?.(row)
                }
              />

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}