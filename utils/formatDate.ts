import { parseExcelDate } from "./date";

export function formatDate(value: any): string {

  const date = parseExcelDate(value);

  if (!date) {

    return "—";

  }

  return date.toLocaleDateString(

    "ru-RU"

  );

}