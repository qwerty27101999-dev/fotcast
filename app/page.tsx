"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(2026);
  const [tab, setTab] = useState<"fot" | "headcount">("fot");

  // 📌 Excel date parser
  const parseExcelDate = (value: any) => {
    if (!value) return null;

    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  // 📂 upload
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

  // 📅 months
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  // 💰 payroll + department
  const employeeRows = useMemo(() => {
    return data.map((row) => {
      const hireDate = parseExcelDate(row.hire_date);
      const salary = Number(row.salary || 0);
      const department = row.department || "—";

      const monthly = months.map((m) => {
        if (!hireDate) return 0;

        const start = new Date(m.getFullYear(), m.getMonth(), 1);
        const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        if (hireDate > end) return 0;
        if (hireDate <= start) return salary;

        const days = end.getDate();
        const worked = days - hireDate.getDate() + 1;

        return Math.round((salary * worked) / days);
      });

      return {
        name: row.name,
        department,
        hireDate,
        salary,
        monthly,
        yearlyTotal: monthly.reduce((a, b) => a + b, 0),
      };
    });
  }, [data, months]);

  // 👥 headcount grouped by department
  const headcountByDeptMonth = useMemo(() => {
    const depts = Array.from(
      new Set(data.map((d) => d.department || "—"))
    );

    return depts.map((dept) => {
      const row: any = { dept };

      months.forEach((m, i) => {
        const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        row[i] = data.filter((r) => {
          if ((r.department || "—") !== dept) return false;
          const d = parseExcelDate(r.hire_date);
          return d && d <= end;
        }).length;
      });

      return row;
    });
  }, [data, months]);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>FOTcast</h1>

      <input type="file" onChange={handleFile} />

      <div style={{ marginTop: 20 }}>
        <label>Год: </label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      {/* tabs */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("fot")} style={{ marginRight: 10 }}>
          ФОТ
        </button>
        <button onClick={() => setTab("headcount")}>
          Численность
        </button>
      </div>

      {/* FOT TAB */}
      {tab === "fot" && (
        <table border={1} cellPadding={6} style={{ marginTop: 30 }}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Подразделение</th>
              <th>Дата</th>
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
                <td>{e.department}</td>
                <td>{e.hireDate?.toLocaleDateString("ru-RU") || "—"}</td>
                <td>{e.salary}</td>

                {e.monthly.map((v, j) => (
                  <td key={j}>{v}</td>
                ))}

                <td><b>{e.yearlyTotal}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* HEADCOUNT TAB (TRANSPOSED) */}
      {tab === "headcount" && (
        <div style={{ marginTop: 30 }}>
          <h3>Численность по подразделениям</h3>

          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                <th>Подразделение</th>
                {months.map((m, i) => (
                  <th key={i}>
                    {m.toLocaleString("ru-RU", { month: "short" })}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {headcountByDeptMonth.map((r, i) => (
                <tr key={i}>
                  <td><b>{r.dept}</b></td>

                  {months.map((_, j) => (
                    <td key={j}>{r[j] || 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}