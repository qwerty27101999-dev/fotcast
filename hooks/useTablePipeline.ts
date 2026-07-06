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
}

export function useTablePipeline<T>({
  rows,
  columns,
  search,
  sort,
}: PipelineParams<T>) {

  return useMemo(() => {

    let result = [...rows];

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

      result = [...result].sort((a: any, b: any) => {

        const A = a[field];
        const B = b[field];

        if (
          typeof A === "number" &&
          typeof B === "number"
        ) {

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

  ]);

}