import { HeadcountRow } from "../headcountEngine";

export interface MonthlyHeadcount {
  month: number;
  value: number;
}

export function buildMonthlyHeadcount(
  headcount: HeadcountRow[]
): MonthlyHeadcount[] {
  return Array.from(
    { length: 12 },
    (_, month) => {
      const value = headcount.reduce(
        (sum, department) =>
          sum + Number(department[month] ?? 0),
        0
      );

      return {
        month,
        value,
      };
    }
  );
}