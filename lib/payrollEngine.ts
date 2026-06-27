import { calculateInsurance } from "./insuranceEngine";
import { getEmploymentPeriod } from "./calendarEngine";

import {
  Employee,
  PayrollEmployee,
  PayrollRow,
} from "./types";

export function buildPayroll(
  data: Employee[],
  months: Date[],
  parseExcelDate: (v: any) => Date | null
): PayrollEmployee[] {

  return data.map((emp) => {

    const hire = parseExcelDate(emp.hire_date);
    const termination = parseExcelDate(emp.termination_date);

    const salary = toNumber(emp.salary);

    const monthlyBonus = toNumber(emp.monthly_bonus);
    const quarterlyBonus = toNumber(emp.quarterly_bonus);
    const annualBonus = toNumber(emp.annual_bonus);

    let cumulativeBase = 0;

    const rows: PayrollRow[] = [];

    for (const month of months) {

      const employment = getEmploymentPeriod(
        hire,
        termination,
        month
      );

      if (!employment.active) {
        rows.push(emptyRow());
        continue;
      }

      const fixedPay =
        salary * employment.ratio;

      const monthBonus =
        monthlyBonus * employment.ratio;

      const quarterBonus =
        isQuarterMonth(month.getMonth())
          ? quarterlyBonus * employment.ratio
          : 0;

      const yearBonus =
        month.getMonth() === 11
          ? annualBonus * employment.ratio
          : 0;

      const fot =
        fixedPay +
        monthBonus +
        quarterBonus +
        yearBonus;

      const insurance =
        calculateInsurance(
          fot,
          cumulativeBase
        );

      cumulativeBase += fot;

      rows.push({

        fot: round(fot),

        fixedPay: round(fixedPay),

        monthlyBonus: round(monthBonus),

        quarterlyBonus: round(quarterBonus),

        annualBonus: round(yearBonus),

        insurance,

        total: round(
          fot + insurance.total
        ),

      });

    }

    return {

      name: emp.name,

      department:
        emp.department || "—",

      rows,

    };

  });

}

function isQuarterMonth(month: number) {
  return [2, 5, 8, 11].includes(month);
}

function emptyRow(): PayrollRow {

  return {

    fot: 0,

    fixedPay: 0,

    monthlyBonus: 0,

    quarterlyBonus: 0,

    annualBonus: 0,

    insurance: {
      ops: 0,
      oms: 0,
      vnim: 0,
      nsipz: 0,
      total: 0,
    },

    total: 0,

  };

}

function round(value: number) {
  return Math.round(value);
}

function toNumber(value: any): number {

  if (value === null || value === undefined)
    return 0;

  return (
    Number(
      String(value)
        .replace(/\s/g, "")
        .replace(",", ".")
    ) || 0
  );

}