import { getEmploymentPeriod } from "./calendarEngine";

export function buildHeadcount(
  data: any[],
  months: Date[],
  parseExcelDate: (v: any) => Date | null
) {
  const departments = Array.from(
    new Set(
      data.map((emp) => emp.department || "—")
    )
  );

  return departments.map((dep) => {

    const row: any = {
      dep,
    };

    months.forEach((month, index) => {

      row[index] = data.filter((emp) => {

        if ((emp.department || "—") !== dep)
          return false;

        const hire = parseExcelDate(emp.hire_date);
        const termination = parseExcelDate(
          emp.termination_date
        );

        const employment =
          getEmploymentPeriod(
            hire,
            termination,
            month
          );

        return employment.active;

      }).length;

    });

    return row;

  });
}