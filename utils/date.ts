export function parseExcelDate(value: any) {
  if (!value) return null;

  // Excel serial date
  if (typeof value === "number") {
    return new Date((value - 25569) * 86400 * 1000);
  }

  // строка вида 31.08.2026
  if (typeof value === "string") {
    const parts = value.split(".");

    if (parts.length === 3) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);

      return new Date(year, month, day);
    }
  }

  const d = new Date(value);

  return isNaN(d.getTime())
    ? null
    : d;
}