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

    return [...values].sort((a, b) =>
      a.localeCompare(b)
    );
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

    return [...values].sort((a, b) =>
      a.localeCompare(b)
    );
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