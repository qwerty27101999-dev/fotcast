export function parseExcelDate(
  value: unknown
): Date | null {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  // Excel serial number
  if (typeof value === "number") {

    const EXCEL_EPOCH = 25569;
    const MS_PER_DAY = 86400000;

    return new Date(
      (value - EXCEL_EPOCH) * MS_PER_DAY
    );

  }

  // DD.MM.YYYY
  if (typeof value === "string") {

    const parts = value.split(".");

    if (parts.length === 3) {

      const [day, month, year] = parts;

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

    }

  }

  const date = new Date(value as string);

  return Number.isNaN(date.getTime())
    ? null
    : date;

}