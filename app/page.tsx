"use client";

import * as XLSX from "xlsx";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    console.log(json);

    // простая логика ФОТ
    let fot = 0;

    json.forEach((row) => {
      if (row.salary) fot += Number(row.salary);
    });

    setResult(fot);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>FOT MVP</h1>

      <input type="file" onChange={handleFile} />

      {result && (
        <h2>ФОТ: {result}</h2>
      )}
    </div>
  );
}