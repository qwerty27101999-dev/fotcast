"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

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

  const startDate = new Date();

  // 📊 ФОТ на год вперед
  const monthlyFot = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + monthIndex,
      1
    );

    const total = data.reduce((sum, row) => {
      const hireDate = new Date(row.hire_date);

      if (!row.salary || isNaN(hireDate.getTime())) return sum;

      // если сотрудник уже нанят к этому месяцу
      if (hireDate <= monthDate) {
        return sum + Number(row.salary);
      }

      return sum;
    }, 0);

    return {
      month: monthDate.toLocaleString("ru-RU", { month: "long", year: "numeric" }),
      fot: total,
    };
  });

  return (
    <main style={{ padding: 50, fontFamily: "Arial" }}>
      <h1>FOTcast</h1>

      <h2>Прогноз фонда оплаты труда на 12 месяцев</h2>

      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

      {monthlyFot.length > 0 && data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>📈 Прогноз</h3>

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