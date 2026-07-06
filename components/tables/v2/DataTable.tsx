"use client";

import { useState } from "react";

import { useTablePipeline, SortState } from "@/hooks/useTablePipeline";

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

  const [globalSearch, setGlobalSearch] = useState("");

  const [sort, setSort] = useState<SortState<T> | null>(null);

  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});

  function handleSort(field: string) {

    setSort(prev => {

      if (!prev || prev.field !== field) {

        return { field, direction: "asc" };

      }

      return {

        field,

        direction: prev.direction === "asc" ? "desc" : "asc",

      };

    });

  }

  function handleFilterChange(columnId: string, values: Set<string>) {

    setColumnFilters(prev => ({

      ...prev,

      [columnId]: values,

    }));

  }

  const processedRows = useTablePipeline({

    rows,

    columns,

    search: globalSearch,

    sort,

    filters: columnFilters,

  });

  return (

    <div

      className="card"

      style={{

        padding: 0,

        overflow: "auto",

        maxHeight: "72vh",

      }}

    >

      {/* GLOBAL SEARCH */}

      <div

        style={{

          padding: 10,

          borderBottom: "1px solid #1f1f1f",

          background: "#0f0f0f",

        }}

      >

        <input

          value={globalSearch}

          onChange={e => setGlobalSearch(e.target.value)}

          placeholder="Search in filtered rows..."

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

        <TableHeader

          columns={columns}

          rows={processedRows}

          sortField={sort?.field ? String(sort.field) : null}

          sortDirection={sort?.direction ?? "asc"}

          onSort={handleSort}

          columnFilters={columnFilters}

          onFilterChange={handleFilterChange}

        />

        <tbody>

          {processedRows.map(row => (

            <TableRow

              key={getRowKey(row)}

              row={row}

              columns={columns}

              selected={

                selectedRow

                  ? getRowKey(selectedRow) === getRowKey(row)

                  : false

              }

              onClick={() => onRowClick?.(row)}

            />

          ))}

        </tbody>

      </table>

    </div>

  );

}