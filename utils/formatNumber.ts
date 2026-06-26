export function formatNumber(value: number | string) {
  if (value === null || value === undefined || value === "") return "";

  return Number(value)
    .toLocaleString("ru-RU")
    .replace(/,/g, " ");
}