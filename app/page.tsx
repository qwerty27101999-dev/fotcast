"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  // 📦 данные из Excel
  const [data, setData] = useState<any[]>([]);

  // 📅 выбранный год
  const [year, setYear] = useState(2026);

  // 🔀 вкладки интерфейса
  const [tab, setTab] = useState<"fot" | "headcount">("fot");

  // 📌 форматирование денег (1 000 000 → 1 000 000 ₽)
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("ru-RU").format(value);

  // 📌 Excel date → JS date
  const parseExcelDate = (value: any) => {
    if (!value) return null;

    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }

    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  // 📂 загрузка Excel файла
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

  // 📅 список месяцев выбранного года
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  // 💰 расчёт сотрудников (ФОТ)
  const employeeRows = useMemo(() => {
    return data.map((row) => {
      const hireDate = parseExcelDate(row.hire_date);
      const salary = Number(row.salary || 0);

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
        department: row.department || "—",
        hireDate,
        salary,
        monthly,
        yearlyTotal: monthly.reduce((a, b) => a + b, 0),
      };
    });
  }, [data, months]);

  // 👥 численность по месяцам (общая)
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
    <main
      style={{
        padding: 40,
        fontFamily: "Calibri, Arial",
        fontSize: 12,
      }}
    >
      <h1>FOTcast</h1>

      {/* 📂 загрузка Excel */}
      <input type="file" onChange={handleFile} />

      {/* 📅 выбор года */}
      <div style={{ marginTop: 20 }}>
        <label>Год: </label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      {/* 🔀 вкладки */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("fot")} style={{ marginRight: 10 }}>
          ФОТ
        </button>

        <button onClick={() => setTab("headcount")}>
          Численность
        </button>
      </div>

      {/* 💰 FOT TAB */}
      {tab === "fot" && (
        <table
          style={{
            marginTop: 30,
            borderCollapse: "collapse",
            width: "100%",
          }}
          border={1}
          cellPadding={6}
        >
          <thead>
            <tr style={{ background: "#0abab5", color: "white" }}>
              <th>ФИО</th>
              <th>Подразделение</th>
              <th>Дата</th>
              <th>Оклад</th>

              {months.map((m, i) => (
                <th key={i}>{m.toLocaleString("ru-RU", { month: "short" })}
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
                <td>
                  {e.hireDate?.toLocaleDateString("ru-RU") || "—"}
                </td>
                <td>{formatMoney(e.salary)}</td>

                {e.monthly.map((v, j) => (
                  <td key={j}>{formatMoney(v)}</td>
                ))}

                <td>
                  <b>{formatMoney(e.yearlyTotal)}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 👥 HEADCOUNT TAB */}
      {tab === "headcount" && (
        <table
          style={{
            marginTop: 30,
            borderCollapse: "collapse",
            width: "100%",
          }}
          border={1}
          cellPadding={6}
        >
          <thead>
            <tr style={{ background: "#0abab5", color: "white" }}>
              <th>Месяц</th>
              <th>Численность</th>
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
      )}
    </main>
  );
}