"use client";

import { useState } from "react";

import {
  useTablePipeline,
  SortState,
} from "@/hooks/useTablePipeline";

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

  //
  // ==========================
  // TABLE STATE
  // ==========================
  //

  const [globalSearch, setGlobalSearch] = useState("");

  const [sort, setSort] =
    useState<SortState<T> | null>(null);

  const [columnFilters, setColumnFilters] =
    useState<Record<string, string[]>>({});

  //
  // ==========================
  // FILTER ENGINE
  // ==========================
  //

  const {

  filteredRows,

  getAvailableValues,

  getAllValues,

} = useFilterEngine({
    rows,
    columnFilters,
  });

  //
  // ==========================
  // SORT
  // ==========================
  //

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

  //
  // ==========================
  // COLUMN FILTERS
  // ==========================
  //

  function handleFilterChange(
    columnId: string,
    values: string[]
  ) {

    setColumnFilters(prev => {

      const next = { ...prev };

      const totalValues =
        getAvailableValues(columnId).length;

      if (
        values.length === 0 ||
        values.length === totalValues
      ) {
        delete next[columnId];
      } else {
        next[columnId] = values;
      }

      return next;

    });

  }

  //
  // ==========================
  // PIPELINE
  // ==========================
  //

  const processedRows =
    useTablePipeline({

      rows: filteredRows,

      columns,

      search: globalSearch,

      sort,

    });

  //
  // ==========================
  // RENDER
  // ==========================
  //

  return (

    <div
      className="card"
      style={{
        padding: 0,
        overflow: "visible",
      }}
    >

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          gap: 10,
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
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            background: "#141414",
            color: "#eaeaea",
          }}
        />

        <button
          className="btn"
          onClick={() => setColumnFilters({})}
        >
          Clear filters
        </button>

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
            getAllValues={getAllValues}
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