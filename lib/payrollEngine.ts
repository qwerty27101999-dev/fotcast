export function buildPayroll(
  data: any[],
  months: Date[],
  parseExcelDate: (v: any) => Date | null
) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // 👉 нормализация даты: убираем время полностью
  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return data.map(emp => {
    const hireRaw = parseExcelDate(emp.hire_date);
    const termRaw = parseExcelDate(emp.termination_date);

    const hire = hireRaw ? normalize(hireRaw) : null;
    const termination = termRaw ? normalize(termRaw) : null;

    const salary = Number(
      String(emp.salary || 0)
        .replace(/\s/g, "")
        .replace(",", ".")
    );

    const rows: any[] = [];

    for (let i = 0; i < months.length; i++) {
      const m = months[i];

      const monthStart = new Date(m.getFullYear(), m.getMonth(), 1);
      const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);

      const start = hire && hire > monthStart ? hire : monthStart;
      const end =
        termination && termination < monthEnd ? termination : monthEnd;

      // ❌ не работал вообще в этом месяце
      if (!hire || start > end) {
        rows.push({
          fot: 0,
          ins: 0,
          total: 0,
        });
        continue;
      }

      // 🧠 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
      // считаем календарные дни включительно
      const workedDays =
        (end.getTime() - start.getTime()) / MS_PER_DAY + 1;

      const totalDays =
        (monthEnd.getTime() - monthStart.getTime()) / MS_PER_DAY + 1;

      const ratio = workedDays / totalDays;

      const fot = salary * ratio;

      // insurance пока оставляем как есть (не трогаем логику сейчас)
      const ins = fot * 0.3; // временно (позже заменим на engine)

      rows.push({
        fot: Math.round(fot),
        ins: Math.round(ins),
        total: Math.round(fot + ins),
      });
    }

    return {
      name: emp.name,
      department: emp.department || "—",
      rows,
    };
  });
}