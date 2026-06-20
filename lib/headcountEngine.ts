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
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

      row[i] = data.filter(emp => {
        const d = parseExcelDate(emp.hire_date);
        return (emp.department || "—") === dep && d && d <= end;
      }).length;
    });

    return row;
  });
}