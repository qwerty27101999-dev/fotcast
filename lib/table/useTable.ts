"use client";

import { useMemo, useState } from "react";

import { Column } from "./tableTypes";

export function useTable<T>(
  rows: T[],
  columns: Column<T>[]
) {

  const [search, setSearch] =
    useState("");

  const [sortField, setSortField] =
    useState("");

  const [ascending, setAscending] =
    useState(true);

  const filteredRows = useMemo(() => {

    let result = [...rows];

    if (search.trim()) {

      const query =
        search.toLowerCase();

      result = result.filter(row =>

        columns.some(column => {

          if (!column.searchable)
            return false;

          const value =
            String(
              (row as any)[column.id] ?? ""
            ).toLowerCase();

          return value.includes(query);

        })

      );

    }

    if (sortField) {

      result.sort((a, b) => {

        const av =
          (a as any)[sortField];

        const bv =
          (b as any)[sortField];

        if (
          typeof av === "number" &&
          typeof bv === "number"
        ) {

          return ascending

            ? av - bv

            : bv - av;

        }

        return ascending

          ? String(av ?? "").localeCompare(String(bv ?? ""))

          : String(bv ?? "").localeCompare(String(av ?? ""));

      });

    }

    return result;

  }, [

    rows,

    columns,

    search,

    sortField,

    ascending,

  ]);

  return {

    rows: filteredRows,

    search,

    setSearch,

    sortField,

    setSortField,

    ascending,

    setAscending,

  };

}