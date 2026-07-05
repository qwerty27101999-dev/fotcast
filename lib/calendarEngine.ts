export interface EmploymentPeriod {
  active: boolean;
  workedDays: number;
  monthDays: number;
  ratio: number;
}

const MS_PER_DAY = 86_400_000;

function normalize(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function daysInclusive(start: Date, end: Date): number {
  return Math.round(
    (end.getTime() - start.getTime()) / MS_PER_DAY
  ) + 1;
}

function emptyPeriod(monthDays: number): EmploymentPeriod {
  return {
    active: false,
    workedDays: 0,
    monthDays,
    ratio: 0,
  };
}

export function getMonthDays(month: Date) {
  const start = new Date(
    month.getFullYear(),
    month.getMonth(),
    1
  );

  const end = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  );

  return {
    start,
    end,
    monthDays: daysInclusive(start, end),
  };
}

export function getEmploymentPeriod(
  hire: Date | null,
  termination: Date | null,
  month: Date
): EmploymentPeriod {

  const monthInfo = getMonthDays(month);

  if (!hire) {
    return emptyPeriod(monthInfo.monthDays);
  }

  const monthStart = normalize(monthInfo.start);
  const monthEnd = normalize(monthInfo.end);

  const hireDate = normalize(hire);

  const terminationDate = termination
    ? normalize(termination)
    : null;

  const start =
    hireDate > monthStart
      ? hireDate
      : monthStart;

  const end =
    terminationDate &&
    terminationDate < monthEnd
      ? terminationDate
      : monthEnd;

  if (start > end) {
    return emptyPeriod(monthInfo.monthDays);
  }

  const workedDays = daysInclusive(start, end);

  return {
    active: true,
    workedDays,
    monthDays: monthInfo.monthDays,
    ratio: workedDays / monthInfo.monthDays,
  };
}