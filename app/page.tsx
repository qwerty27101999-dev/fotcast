"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(2026);

  // 📌 Excel date → JS date
  const parseExcelDate = (value: any) => {
    if (!value) return null;

    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  // 📂 upload Excel
  const handleFile = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      setData(json);
    };

    reader.readAsBinaryString(file);
  };

  // 📅 months of selected year
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  // 📊 employees matrix with prorated salary
  const employeeRows = useMemo(() => {
    return data.map((row) => {
      const hireDate = parseExcelDate(row.hire_date);
      const salary = Number(row.salary || 0);

      const monthly = months.map((m) => {
        if (!hireDate) return 0;

        const monthStart = new Date(m.getFullYear(), m.getMonth(), 1);
        const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        // ещё не нанят
        if (hireDate > monthEnd) return 0;

        // уже работает полный месяц
        if (hireDate <= monthStart) return salary;

        // нанят внутри месяца → пропорция по дням
        const daysInMonth = monthEnd.getDate();
        const startDay = hireDate.getDate();

        const workedDays = daysInMonth - startDay + 1;

        return Math.round((salary * workedDays) / daysInMonth);
      });

      const yearlyTotal = monthly.reduce((a, b) => a + b, 0);

      return {
        name: row.name,
        hireDate,
        salary,
        monthly,
        yearlyTotal,
      };
    });
  }, [data, months]);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>FOTcast</h1>

      <h2>Payroll Matrix (CFO-level model)</h2>

      {/* 📂 upload */}
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

      {/* 📅 year switch */}
      <div style={{ marginTop: 20 }}>
        <label>Год: </label>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      {/* 📋 table */}
      {data.length > 0 && (
        <table
          border={1}
          cellPadding={6}
          style={{ marginTop: 30, borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Дата найма</th>
              <th>Оклад</th>

              {months.map((m, i) => (
                <th key={i}>
                  {m.toLocaleString("ru-RU", { month: "short" })}
                </th>
              ))}

              <th>Год</th>
            </tr>
          </thead>

          <tbody>
            {employeeRows.map((e, i) => (
              <tr key={i}>
                <td>{e.name}</td>

                <td>
                  {e.hireDate
                    ? e.hireDate.toLocaleDateString("ru-RU")
                    : "—"}
                </td>

                <td>{e.salary.toLocaleString()} ₽</td>

                {e.monthly.map((v: number, j: number) => (
                  <td key={j}>{v.toLocaleString()}</td>
                ))}

                <td>
                  <b>{e.yearlyTotal.toLocaleString()} ₽</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}