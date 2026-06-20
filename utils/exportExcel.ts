import * as XLSX from "xlsx";

export function exportPayroll(
  payroll: any[],
  monthLabels: string[],
  year: number
) {
  const wb = XLSX.utils.book_new();

  const sheet = payroll.map(p => {
    const row: any = {
      ФИО: p.name,
      Подразделение: p.department,
    };

    p.rows.forEach((r: any, i: number) => {
      row[`ФОТ_${monthLabels[i]}`] = r.fot;
      row[`INS_${monthLabels[i]}`] = r.ins;
      row[`TOTAL_${monthLabels[i]}`] = r.total;
    });

    return row;
  });

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(sheet),
    "PAYROLL"
  );

  XLSX.writeFile(wb, `ФОТcast_${year}.xlsx`);
}