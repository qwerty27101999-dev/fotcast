import { companySettings } from "../config/companySettings";

export function getCompanyName() {
  return companySettings.companyName;
}

export function getCurrency() {
  return companySettings.currency;
}

export function getLocale() {
  return companySettings.locale;
}