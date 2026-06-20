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
    const termination = parseExcelDate(emp.termination_date);

    const salary = Number(
      String(emp.salary || 0)
        .replace(/\s/g, "")
        .replace(",", ".")
    );

    let cumulative = 0;
    const rows: any[] = [];

    for (let i = 0; i < months.length; i++) {
      const m = months[i];

      const monthStart = new Date(m.getFullYear(), m.getMonth(), 1);
      const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);

      // 💰 PAYROLL LOGIC: worked at least 1 day in month
      const active =
        hire &&
        hire <= monthEnd &&
        (!termination || termination >= monthEnd)

      if (!active) {
        rows.push({ fot: 0, ins: 0, total: 0 });
        continue;
      }

      const fot = salary;

      const remainingCap = Math.max(CAP - cumulative, 0);

      let ins = 0;

      if (remainingCap >= fot) {
        ins = fot * RATE_LOW;
      } else {
        ins =
          remainingCap * RATE_LOW +
          (fot - remainingCap) * RATE_HIGH;
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