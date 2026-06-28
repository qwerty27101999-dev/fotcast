import { companySettings } from "../config/companySettings";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat(
    companySettings.locale,
    {
      style: "currency",
      currency: companySettings.currency,
      maximumFractionDigits: 0,
    }
  ).format(value);
}