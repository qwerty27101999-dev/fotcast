export function parseExcelDate(value: any) {
  if (!value) return null;

  if (typeof value === "number") {
    return new Date((value - 25569) * 86400 * 1000);
  }

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}