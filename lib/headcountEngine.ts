export function buildHeadcount(
  data: any[],
  months: Date[],
  parseExcelDate: (v: any) => Date | null
) {
  const departments = Array.from(
    new Set(data.map(d => d.department || "—"))
  );

  return departments.map(dep => {
    const row: any = { dep };

    months.forEach((m, i) => {
      const monthEnd = new Date(
        m.getFullYear(),
        m.getMonth() + 1,
        0
      );

      row[i] = data.filter(emp => {
        const hire = parseExcelDate(emp.hire_date);
        const termination = parseExcelDate(emp.termination_date);

        return (
          (emp.department || "—") === dep &&
          hire &&
          hire <= monthEnd &&
          (!termination || termination > monthEnd)
        );
      }).length;
    });

    return row;
  });
}