import * as XLSX from "xlsx";

function formatMonthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export function exportPayroll(
  payroll: any[],
  months: Date[],
  year: number
) {
  const wb = XLSX.utils.book_new();

  const sheet = payroll.map((p) => {
    const row: any = {
      "Employee": p.name,
      "Department": p.department,
    };

    p.rows.forEach((r: any, i: number) => {
      const label = formatMonthLabel(months[i]);

      row[`FOT_${label}`] = r.fot;
      row[`FIXED_${label}`] = r.fixedPay;
      row[`BONUS_M_${label}`] = r.monthlyBonus;
      row[`BONUS_Q_${label}`] = r.quarterlyBonus;
      row[`BONUS_Y_${label}`] = r.annualBonus;

      row[`INS_TOTAL_${label}`] = r.insurance.total;
      row[`TOTAL_${label}`] = r.total;
    });

    return row;
  });

  const ws = XLSX.utils.json_to_sheet(sheet);

  XLSX.utils.book_append_sheet(wb, ws, "PAYROLL");

  XLSX.writeFile(wb, `FOTcast_${year}.xlsx`);
}