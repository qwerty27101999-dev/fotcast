import { CompanyDataset } from "./company/companyTypes";

export interface HeadcountRow {
  dep: string;
  [month: number]: number | string;
}

export function buildHeadcount(
  company: CompanyDataset,
  months: Date[],
  parseExcelDate: (v: any) => Date | null
): HeadcountRow[] {

  const departments = company.departments;

  return departments.map(dep => {

    const row: HeadcountRow = {
      dep,
    };

    months.forEach((month, index) => {

      const monthEnd = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
      );

      row[index] = company.employees.filter(emp => {

        if ((emp.department || "—") !== dep)
          return false;

        const hire = parseExcelDate(
          emp.hire_date
        );

        const termination = parseExcelDate(
          emp.termination_date
        );

        if (!hire)
          return false;

        if (hire > monthEnd)
          return false;

        if (
          termination &&
          termination <= monthEnd
        )
          return false;

        return true;

      }).length;

    });

    return row;

  });

}