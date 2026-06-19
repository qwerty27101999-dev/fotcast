"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const handleFile = async (e: any) => {
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

  return (
    <main style={{ padding: 50, fontFamily: "Arial" }}>
      <h1>FOTcast</h1>

      <h2>Сколько будет стоить ваша команда через 12 месяцев — уже сегодня</h2>

      <p>Загрузите Excel-файл и получите данные.</p>

      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}