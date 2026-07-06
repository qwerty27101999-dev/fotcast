import { useMemo } from "react";

export interface SortState<T> {
  field: keyof T | string;
  direction: "asc" | "desc";
}

interface PipelineParams<T> {
  rows: T[];
  columns: {
    id: keyof T | string;
  }[];

  search: string;

  sort: SortState<T> | null;

  columnFilters?: Record<string, string[]>;
}

export function useTablePipeline<T>({
  rows,
  columns,
  search,
  sort,
  columnFilters,
}: PipelineParams<T>) {
  return useMemo(() => {
    let result = [...rows];

    //
// ==========================
// COLUMN FILTERS (Excel style)
// ==========================
//

if (columnFilters) {

  (Object.entries(columnFilters) as [string, string[]][])
.forEach(

    ([field, selectedValues]) => {

      if (!selectedValues.length) {

        return;

      }

      result = result.filter((row: any) => {

        const value = String(

          row[field] ?? ""

        );

        return selectedValues.includes(

          value

        );

      });

    }

  );

}

    //
    // ==========================
    // GLOBAL SEARCH
    // ==========================
    //

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(row =>
        columns.some(col => {
          const value = (row as any)[col.id];

          if (value === undefined || value === null) {
            return false;
          }

          return String(value)
            .toLowerCase()
            .includes(q);
        })
      );
    }

    //
    // ==========================
    // SORT
    // ==========================
    //

    if (sort) {
      const { field, direction } = sort;

      result.sort((a: any, b: any) => {
        const A = a[field];
        const B = b[field];

        if (typeof A === "number" && typeof B === "number") {
          return direction === "asc"
            ? A - B
            : B - A;
        }

        return direction === "asc"
          ? String(A ?? "").localeCompare(String(B ?? ""))
          : String(B ?? "").localeCompare(String(A ?? ""));
      });
    }

    return result;
  }, [
    rows,
    columns,
    search,
    sort,
    columnFilters,
  ]);
}