export function buildPayroll(
  data: any[],
  months: Date[],
  CAP: number,
  RATE_LOW: number,
  RATE_HIGH: number,
  parseExcelDate: (v: any) => Date | null
) {
  return data.map(emp => {
    const hire = parseExcelDate(emp.hire_date);
    const salary = Number(emp.salary || 0);

    let cumulative = 0;
    const rows: any[] = [];

    for (let i = 0; i < 12; i++) {
      const monthEnd = new Date(
        months[i].getFullYear(),
        months[i].getMonth() + 1,
        0
      );

      if (!hire || hire > monthEnd) {
        rows.push({ fot: 0, ins: 0, total: 0 });
        continue;
      }

      const fot = salary;
      const remaining = Math.max(CAP - cumulative, 0);

      let ins = 0;

      if (remaining >= fot) {
        ins = fot * RATE_LOW;
      } else {
        ins =
          remaining * RATE_LOW +
          (fot - remaining) * RATE_HIGH;
      }

      cumulative += fot;

      rows.push({
        fot,
        ins: Math.round(ins),
        total: fot + Math.round(ins),
      });
    }

    return {
      name: emp.name,
      department: emp.department || "—",
      rows,
    };
  });
}