import { parseExcelDate } from "./date";

export function formatInputDate(
  value: unknown
): string {

  const date = parseExcelDate(value);

  if (!date) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}