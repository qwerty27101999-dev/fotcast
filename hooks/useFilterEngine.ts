import { useMemo } from "react";

interface Params<T> {
  rows: T[];
  columnFilters: Record<string, string[]>;
}

export function useFilterEngine<T>({
  rows,
  columnFilters,
}: Params<T>) {
  //
  // ==========================
  // FILTERED ROWS
  // ==========================
  //

  const filteredRows = useMemo(() => {
    return applyFilters(rows, columnFilters);
  }, [rows, columnFilters]);

  //
  // ==========================
  // AVAILABLE VALUES
  // (Excel cascade)
  // ==========================
  //

  function getVisibleValues(field: string): string[] {
    const filters = {
      ...columnFilters,
    };

    delete filters[field];

    const rowsForColumn = applyFilters(
      rows,
      filters
    );

    const values = new Set<string>();

    rowsForColumn.forEach((row: any) => {
      values.add(
        String(row[field] ?? "")
      );
    });

    return [...values].sort(smartSort);
  }

  //
  // ==========================
  // ALL VALUES
  // (нужно новому FilterMenu)
  // ==========================
  //

  function getAllValues(field: string): string[] {
    const values = new Set<string>();

    rows.forEach((row: any) => {
      values.add(
        String(row[field] ?? "")
      );
    });

    return [...values].sort(smartSort);
  }

  return {
    filteredRows,
    getAvailableValues: getVisibleValues,
    getAllValues,
  };
}

//
// ==========================
// SHARED FILTER ENGINE
// ==========================
//
function smartSort(a: string, b: string) {

  //
  // Number
  //

  const numA = Number(a);
  const numB = Number(b);

  if (
    !Number.isNaN(numA) &&
    !Number.isNaN(numB) &&
    a.trim() !== "" &&
    b.trim() !== ""
  ) {
    return numA - numB;
  }

  //
  // Date
  //

  const dateA = Date.parse(a);
  const dateB = Date.parse(b);

  if (
    !Number.isNaN(dateA) &&
    !Number.isNaN(dateB)
  ) {
    return dateA - dateB;
  }

  //
  // Text
  //

  return a.localeCompare(
    b,
    "ru",
    {
      numeric: true,
      sensitivity: "base",
    }
  );

}
function applyFilters<T>(
  rows: T[],
  filters: Record<string, string[]>
): T[] {
  let result = [...rows];

  Object.entries(filters).forEach(
    ([field, selected]) => {
      //
      // Нет фильтра
      //

      if (!selected) {
        return;
      }

      //
      // NONE
      //

      if (selected.length === 0) {
        result = [];
        return;
      }

      //
      // PARTIAL
      //

      result = result.filter((row: any) => {
        const value = String(
          row[field] ?? ""
        );

        return selected.includes(value);
      });
    }
  );

  return result;
}