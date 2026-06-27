export interface PayrollCalculationInput {
  salary: number;

  monthlyBonus: number;
  quarterlyBonus: number;
  annualBonus: number;

  workedDays: number;
  totalDays: number;

  month: number;
}

export interface PayrollCalculationResult {
  fixedPay: number;

  monthlyBonus: number;
  quarterlyBonus: number;
  annualBonus: number;

  fot: number;
}

export function calculateCalendarPayroll(
  input: PayrollCalculationInput
): PayrollCalculationResult {

  const ratio =
    input.totalDays === 0
      ? 0
      : input.workedDays / input.totalDays;

  const fixedPay =
    input.salary * ratio;

  const monthlyBonus =
    input.monthlyBonus * ratio;

  const quarterlyBonus =
    isQuarterMonth(input.month)
      ? input.quarterlyBonus * ratio
      : 0;

  const annualBonus =
    input.month === 11
      ? input.annualBonus * ratio
      : 0;

  return {

    fixedPay,

    monthlyBonus,

    quarterlyBonus,

    annualBonus,

    fot:
      fixedPay +
      monthlyBonus +
      quarterlyBonus +
      annualBonus,

  };
}

function isQuarterMonth(month: number) {
  return [2, 5, 8, 11].includes(month);
}