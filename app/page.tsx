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

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet);

      setData(json);
    };

    reader.readAsBinaryString(file);
  };

  // 💡 расчёты
  const fot = data.reduce((sum, row) => sum + Number(row.salary || 0), 0);
  const employees = data.length;
  const avgSalary = employees ? fot / employees : 0;

  return (
    <main style={{ padding: 50, fontFamily: "Arial" }}>
      <h1>FOTcast</h1>

      <h2>Прогноз фонда оплаты труда</h2>

      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

      {data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>📊 Результаты</h3>

          <p>Сотрудников: {employees}</p>
          <p>ФОТ сейчас: {fot.toLocaleString()} ₽</p>
          <p>Средняя зарплата: {avgSalary.toFixed(0)} ₽</p>
        </div>
      )}
    </main>
  );
}