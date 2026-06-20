"use client";

import { useState, useMemo } from "react";

import { buildPayroll } from "@/lib/payrollEngine";
import { buildHeadcount } from "@/lib/headcountEngine";
import { exportPayroll } from "@/utils/exportExcel";
import { parseExcelDate } from "@/utils/date";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  const CAP = 2_979_000;
  const RATE_LOW = 0.3;
  const RATE_HIGH = 0.151;

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const XLSX = require("xlsx");
      const wb = XLSX.read(event.target.result, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };

    reader.readAsBinaryString(file);
  };

  const months = useMemo(() => {
    return Array.from(
      { length: 12 },
      (_, i) => new Date(year, i, 1)
    );
  }, [year]);

  const monthLabels = useMemo(() => {
    return months.map(m =>
      m.toLocaleString("ru", { month: "short" })
    );
  }, [months]);

  const payroll = useMemo(() => {
    return buildPayroll(
      data,
      months,
      CAP,
      RATE_LOW,
      RATE_HIGH,
      parseExcelDate
    );
  }, [data, months, year]);

  const headcount = useMemo(() => {
    return buildHeadcount(data, months, parseExcelDate);
  }, [data, months, year]);

  return (
    <main style={{ padding: 40, fontFamily: "Calibri", fontSize: 12 }}>
      <h1>ФОТcast v0.04</h1>

      <input type="file" onChange={handleFile} />

      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) => CURRENT_YEAR + i).map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* PAYROLL */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Подразделение</th>

                {monthLabels.map((m, i) => (
                  <th key={i}>ФОТ {m}</th>
                ))}
                {monthLabels.map((m, i) => (
                  <th key={i}>INS {m}</th>
                ))}
                {monthLabels.map((m, i) => (
                  <th key={i}>TOTAL {m}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payroll.map((p: any, idx: number) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.department}</td>

                  {p.rows.map((r: any, i: number) => (
                    <td key={"f"+i}>{r.fot}</td>
                  ))}

                  {p.rows.map((r: any, i: number) => (
                    <td key={"i"+i}>{r.ins}</td>
                  ))}

                  {p.rows.map((r: any, i: number) => (
                    <td key={"t"+i}>{r.total}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HEADCOUNT */}
      {tab === "headcount" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                <th>Департамент</th>
                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {headcount.map((r: any, i: number) => (
                <tr key={i}>
                  <td>{r.dep}</td>
                  {months.map((_, j) => (
                    <td key={j}>{r[j]}</td>
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