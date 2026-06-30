import { calculateInsurance } from "./insuranceEngine";
import { calculateCalendarPayroll } from "./payrollRules";
import { getEmploymentPeriod } from "./calendarEngine";

import {
  Employee,
  PayrollEmployee,
  PayrollRow,
} from "./types";

import { Scenario } from "./scenario";

function normalizeDate(date: Date | null): Date |null {
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
  parseExcelDate: (v: any) => Date | null,
  scenario: Scenario
): PayrollEmployee[] {

  return data.map(employee => {

    const hire = normalizeDate(
      parseExcelDate(employee.hire_date)
    );

    const termination = normalizeDate(
      parseExcelDate(employee.termination_date)
    );

    const salary =
      toNumber(employee.salary) *
      scenario.salaryMultiplier;

    const monthlyBonus =
      toNumber(employee.monthly_bonus) *
      scenario.monthlyBonusMultiplier;

    const quarterlyBonus =
      toNumber(employee.quarterly_bonus) *
      scenario.quarterlyBonusMultiplier;

    const annualBonus =
      toNumber(employee.annual_bonus) *
      scenario.annualBonusMultiplier;

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

      const payroll =
        calculateCalendarPayroll({

          salary,

          monthlyBonus,

          quarterlyBonus,

          annualBonus,

          workedDays:
            employment.workedDays,

          totalDays:
            employment.monthDays,

          month:
            month.getMonth(),

        });

      const insurance =
        scenario.insuranceEnabled

          ? calculateInsurance(
              payroll.fot,
              cumulativeBase
            )

          : {

              ops: 0,

              oms: 0,

              vnim: 0,

              nsipz: 0,

              total: 0,

            };

      cumulativeBase += payroll.fot;

      rows.push({

        fot: round(payroll.fot),

        fixedPay: round(
          payroll.fixedPay
        ),

        monthlyBonus: round(
          payroll.monthlyBonus
        ),

        quarterlyBonus: round(
          payroll.quarterlyBonus
        ),

        annualBonus: round(
          payroll.annualBonus
        ),

        insurance,

        total: round(
          payroll.fot +
          insurance.total
        ),

      });

    }

    return {

      name: employee.name,

      department:
        employee.department || "—",

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

function round(value: number) {
  return Math.round(value);
}

function toNumber(value: any): number {

  if (
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  return Number(

    String(value)
      .replace(/\s/g, "")
      .replace(",", ".")

  ) || 0;

}