export function parseExcelDate(value: any) {
  if (!value) return null;

  // Excel numeric format
  if (typeof value === "number") {
    return new Date((value - 25569) * 86400 * 1000);
  }

  // DD.MM.YYYY format (ВАЖНО для твоего файла)
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

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}