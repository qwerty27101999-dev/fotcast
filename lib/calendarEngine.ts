export interface EmploymentPeriod {
  active: boolean;
  workedDays: number;
  monthDays: number;
  ratio: number;
}

function normalize(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
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

  const monthDays =
    Math.round(
      (end.getTime() - start.getTime()) /
        86400000
    ) + 1;

  return {
    start,
    end,
    monthDays,
  };
}

export function getEmploymentPeriod(
  hire: Date | null,
  termination: Date | null,
  month: Date
): EmploymentPeriod {

  if (!hire) {
    return {
      active: false,
      workedDays: 0,
      monthDays: getMonthDays(month).monthDays,
      ratio: 0,
    };
  }

  const monthInfo = getMonthDays(month);

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
    return {
      active: false,
      workedDays: 0,
      monthDays: monthInfo.monthDays,
      ratio: 0,
    };
  }

  const workedDays =
    Math.round(
      (end.getTime() - start.getTime()) /
        86400000
    ) + 1;

  return {
    active: true,
    workedDays,
    monthDays: monthInfo.monthDays,
    ratio:
      workedDays /
      monthInfo.monthDays,
  };
}