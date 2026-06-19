"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(2026);

  // 📌 Excel дата → нормальная JS дата
  const parseExcelDate = (value: any) => {
    if (!value) return null;

    // Excel serial number (46266 и т.п.)
    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  // 📂 загрузка Excel
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

  // 📅 старт сценария
  const startDate = new Date(year, 0, 1);

  // 📊 ФОТ прогноз
  const monthlyFot = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i, 1);

    const total = data.reduce((sum, row) => {
      const hireDate = parseExcelDate(row.hire_date);

      if (!hireDate || isNaN(hireDate.getTime())) return sum;

      // сотрудник учитывается только после найма
      if (hireDate.getTime() <= monthDate.getTime()) {
        return sum + Number(row.salary || 0);
      }

      return sum;
    }, 0);

    return {
      month: monthDate.toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      }),
      fot: total,
    };
  });

  return (
    <main style={{ padding: 50, fontFamily: "Arial" }}>
      <h1>FOTcast</h1>

      <h2>Прогноз фонда оплаты труда</h2>

      {/* загрузка */}
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

      {/* выбор года */}
      <div style={{ marginTop: 20 }}>
        <label>Год расчёта: </label>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      {/* таблица */}
      {data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>📋 Сотрудники</h3>

          <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Зарплата</th>
                <th>Дата найма</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => {
                const parsedDate = parseExcelDate(row.hire_date);

                return (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{Number(row.salary).toLocaleString()} ₽</td>
                    <td>
                      {parsedDate
                        ? parsedDate.toLocaleDateString("ru-RU")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* прогноз */}
      {data.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>📈 Прогноз ФОТ</h3>

          {monthlyFot.map((m, i) => (
            <p key={i}>
              {m.month}: <b>{m.fot.toLocaleString()} ₽</b>
            </p>
          ))}
        </div>
      )}
    </main>
  );
}