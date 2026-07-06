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
  // ============================================
  // APPLY ALL FILTERS
  // ============================================
  //

  const filteredRows = useMemo(() => {
    return applyFilters(rows, columnFilters);
  }, [rows, columnFilters]);

  //
  // ============================================
  // EXCEL CASCADE VALUES
  // ============================================
  //

  function getAvailableValues(field: string): string[] {
    //
    // Копируем все фильтры
    //

    const filtersWithoutCurrent = {
      ...columnFilters,
    };

    //
    // Убираем фильтр текущего столбца
    //

    delete filtersWithoutCurrent[field];

    //
    // Применяем остальные фильтры
    //

    const rowsForColumn = applyFilters(
      rows,
      filtersWithoutCurrent
    );

    //
    // Собираем уникальные значения
    //

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

  return {
    filteredRows,
    getAvailableValues,
  };
}

//
// ============================================
// SHARED FILTER FUNCTION
// ============================================
//

function applyFilters<T>(
  rows: T[],
  filters: Record<string, string[]>
): T[] {
  let result = [...rows];

  Object.entries(filters).forEach(
    ([field, selected]) => {

      //
      // Нет фильтра по колонке
      //
      if (!selected) {
        return;
      }


      //
      // Собираем все возможные значения
      //
      const allValues = new Set<string>();

      rows.forEach((row: any) => {

        allValues.add(
          String(row[field] ?? "")
        );

      });


      //
      // NONE
      // ничего не выбрано
      //
      if (selected.length === 0) {

        result = [];

        return;

      }


      //
      // ALL
      // выбраны все значения
      // фильтр фактически выключен
      //
      if (
        selected.length === allValues.size
      ) {

        return;

      }


      //
      // PARTIAL
      // обычная фильтрация
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