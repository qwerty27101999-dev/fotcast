"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(2026);
  const [tab, setTab] = useState<"fot" | "headcount">("fot");

  const parseExcelDate = (value: any) => {
    if (!value) return null;

    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

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

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  const employeeRows = useMemo(() => {
    return data.map((row) => {
      const hireDate = parseExcelDate(row.hire_date);
      const salary = Number(row.salary || 0);

      const monthly = months.map((m) => {
        if (!hireDate) return 0;

        const monthStart = new Date(m.getFullYear(), m.getMonth(), 1);
        const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        if (hireDate > monthEnd) return 0;
        if (hireDate <= monthStart) return salary;

        const days = monthEnd.getDate();
        const start = hireDate.getDate();
        const worked = days - start + 1;

        return Math.round((salary * worked) / days);
      });

      return {
        name: row.name,
        hireDate,
        salary,
        monthly,
        yearlyTotal: monthly.reduce((a, b) => a + b, 0),
      };
    });
  }, [data, months]);

  const headcountByMonth = useMemo(() => {
    return months.map((m) => {
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

      return {
        month: m.toLocaleString("ru-RU", { month: "long", year: "numeric" }),
        count: data.filter((r) => {
          const d = parseExcelDate(r.hire_date);
          return d && d <= end;
        }).length,
      };
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

      {/* TABS */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setTab("fot")}
          style={{ marginRight: 10 }}
        >
          ФОТ
        </button>

        <button onClick={() => setTab("headcount")}>
          Численность
        </button>
      </div>

      {/* FOT TAB = ПОЛНАЯ ТАБЛИЦА */}
      {tab === "fot" && data.length > 0 && (
        <table border={1} cellPadding={6} style={{ marginTop: 30 }}>
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
                <td>{e.hireDate?.toLocaleDateString("ru-RU") || "—"}</td>
                <td>{e.salary.toLocaleString()}</td>

                {e.monthly.map((v, j) => (
                  <td key={j}>{v.toLocaleString()}</td>
                ))}

                <td><b>{e.yearlyTotal.toLocaleString()}</b></td>
              </tr>
            ))}
          </tbody></table>
      )}

      {/* HEADCOUNT TAB */}
      {tab === "headcount" && (
        <div style={{ marginTop: 30 }}>
          <h3>Численность</h3>

          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                <th>Месяц</th>
                <th>Сотрудников</th>
              </tr>
            </thead>

            <tbody>
              {headcountByMonth.map((m, i) => (
                <tr key={i}>
                  <td>{m.month}</td>
                  <td><b>{m.count}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}