import { calculateInsurance } from "./insuranceEngine";
import { calculateCalendarPayroll } from "./payrollRules";
import { getEmploymentPeriod } from "./calendarEngine";

import {
  Employee,
  PayrollEmployee,
  PayrollRow,
} from "./types";

function normalizeDate(date: Date | null): Date | null {
  if (!date) return null;

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export function buildPayroll(
  data: Employee[],
  months: Date[],
  parseExcelDate: (v: any) => Date | null
): PayrollEmployee[] {

  return data.map((emp) => {

    const hire = normalizeDate(
      parseExcelDate(emp.hire_date)
    );

    const termination = normalizeDate(
      parseExcelDate(emp.termination_date)
    );

    const salary = toNumber(emp.salary);

    const monthlyBonus = toNumber(emp.monthly_bonus);

    const quarterlyBonus = toNumber(emp.quarterly_bonus);

    const annualBonus = toNumber(emp.annual_bonus);

    let cumulativeBase = 0;

    const rows: PayrollRow[] = [];

    for (const month of months) {

      const period = getEmploymentPeriod(
        hire,
        termination,
        month
      );

      if (!period.active) {
        rows.push(emptyRow());
        continue;
      }

      const payroll = calculateCalendarPayroll({

        salary,

        monthlyBonus,

        quarterlyBonus,

        annualBonus,

        workedDays: period.workedDays,

        totalDays: period.monthDays,

        month: month.getMonth(),

      });

      const insurance = calculateInsurance(
        payroll.fot,
        cumulativeBase
      );

      cumulativeBase += payroll.fot;

      rows.push({

        fot: round(payroll.fot),

        fixedPay: round(payroll.fixedPay),

        monthlyBonus: round(payroll.monthlyBonus),

        quarterlyBonus: round(payroll.quarterlyBonus),

        annualBonus: round(payroll.annualBonus),

        insurance,

        total: round(
          payroll.fot + insurance.total
        ),

      });

    }

    return {

      name: emp.name,

      department: emp.department || "—",

      rows,

    };

  });

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

function round(value: number): number {
  return Math.round(value);
}

function toNumber(value: any): number {

  if (value === null || value === undefined) {
    return 0;
  }

  return Number(
    String(value)
      .replace(/\s/g, "")
      .replace(",", ".")
  ) || 0;

}