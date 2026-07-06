import { useMemo } from "react";

interface Params<T> {
  rows: T[];
  columnFilters: Record<string, string[]>;
}

export function useFilterEngine<T>({
  rows,
  columnFilters,
}: Params<T>) {
  const filteredRows = useMemo(() => {
    let result = [...rows];

    Object.entries(columnFilters).forEach(([field, values]) => {
      if (!values.length) return;

      result = result.filter((row: any) =>
        values.includes(String(row[field] ?? ""))
      );
    });

    return result;
  }, [rows, columnFilters]);

  function getAvailableValues(field: string) {
    const values = new Set<string>();

    filteredRows.forEach((row: any) => {
      values.add(String(row[field] ?? ""));
    });

    return [...values].sort();
  }

  return {
    filteredRows,
    getAvailableValues,
  };
}