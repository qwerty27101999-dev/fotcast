import { companySettings } from "../config/companySettings";

export function getWeekendDays() {
  return companySettings.calendar.weekends;
}