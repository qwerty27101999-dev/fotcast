import { calculateInsurance } from "./insuranceEngine";
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

    for (let i = 0; i < months.length; i++) {
      const month = months[i];

      const monthStart = new Date(
        month.getFullYear(),
        month.getMonth(),
        1
      );

      const monthEnd = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
      );

      const start =
        hire && hire > monthStart
          ? hire
          : monthStart;

      const end =
        termination && termination < monthEnd
          ? termination
          : monthEnd;

      if (!hire || start > end) {
        rows.push(emptyRow());
        continue;
      }

      const MS_PER_DAY = 1000 * 60 * 60 * 24;

      const workedDays =
        Math.floor(
          (end.getTime() - start.getTime()) /
            MS_PER_DAY
        ) + 1;

      const totalDays =
        Math.floor(
          (monthEnd.getTime() -
            monthStart.getTime()) /
            MS_PER_DAY
        ) + 1;

      const ratio = workedDays / totalDays;

      const fixedPay = salary * ratio;

      const monthBonus = monthlyBonus * ratio;

      const qBonus =
        isQuarterMonth(month.getMonth())
          ? quarterlyBonus * ratio
          : 0;

      const yBonus =
        month.getMonth() === 11
          ? annualBonus * ratio
          : 0;

      const fot =
        fixedPay +
        monthBonus +
        qBonus +
        yBonus;

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

        quarterlyBonus: round(qBonus),

        annualBonus: round(yBonus),

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

  return Number(
    String(value)
      .replace(/\s/g, "")
      .replace(",", ".")
  ) || 0;
}