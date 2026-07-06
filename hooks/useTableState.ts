"use client";

import { useState } from "react";

import { DataColumn } from "@/components/tables/v2/types";

export interface TableState {

  search: string;

  sortField: string | null;

  sortDirection: "asc" | "desc";

  openedFilter: string | null;

  columnFilters: Record<string, string[]>;

}

export interface TableActions {

  setSearch: (value: string) => void;

  setSort: (field: string) => void;

  openFilter: (field: string | null) => void;

  setColumnFilter: (

    field: string,

    values: string[]

  ) => void;

  clearColumnFilter: (

    field: string

  ) => void;

  clearAllFilters: () => void;

}

export function useTableState<T>(

  columns: DataColumn<T>[]

): TableState & TableActions {

  const [search, setSearch] =

    useState("");

  const [

    sortField,

    setSortField,

  ] = useState<string | null>(null);

  const [

    sortDirection,

    setSortDirection,

  ] = useState<"asc" | "desc">("asc");

  const [

    openedFilter,

    setOpenedFilter,

  ] = useState<string | null>(null);

  const [

    columnFilters,

    setColumnFilters,

  ] = useState<Record<string, string[]>>({});

  function setSort(field: string) {

    if (sortField === field) {

      setSortDirection(prev =>

        prev === "asc"

          ? "desc"

          : "asc"

      );

      return;

    }

    setSortField(field);

    setSortDirection("asc");

  }

  function openFilter(

    field: string | null

  ) {

    setOpenedFilter(field);

  }

  function setColumnFilter(

    field: string,

    values: string[]

  ) {

    setColumnFilters(prev => ({

      ...prev,

      [field]: values,

    }));

  }

  function clearColumnFilter(

    field: string

  ) {

    setColumnFilters(prev => {

      const next = { ...prev };

      delete next[field];

      return next;

    });

  }

  function clearAllFilters() {

    setColumnFilters({});

    setSearch("");

  }

  return {

    search,

    sortField,

    sortDirection,

    openedFilter,

    columnFilters,

    setSearch,

    setSort,

    openFilter,

    setColumnFilter,

    clearColumnFilter,

    clearAllFilters,

  };

}