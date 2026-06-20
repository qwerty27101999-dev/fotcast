"use client";

import { useState, useMemo } from "react";

import { buildPayroll } from "@/lib/payrollEngine";
import { buildHeadcount } from "@/lib/headcountEngine";
import { exportPayroll } from "@/utils/exportExcel";
import { parseExcelDate } from "@/utils/date";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  const CAP = 2_979_000;
  const RATE_LOW = 0.3;
  const RATE_HIGH = 0.151;

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

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

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Date(year, i, 1)),
    [year]
  );

  const monthLabels = useMemo(
    () =>
      months.map((m) =>
        m.toLocaleString("ru", { month: "short" })
      ),
    [months]
  );

  const payroll = useMemo(
    () =>
      buildPayroll(
        data,
        months,
        CAP,
        RATE_LOW,
        RATE_HIGH,
        parseExcelDate
      ),
    [data, months]
  );

  const headcount = useMemo(
    () => buildHeadcount(data, months, parseExcelDate),
    [data, months]
  );

  // 💥 DEPARTMENT SUMMARY (NEW)
  const deptSummary = useMemo(() => {
    const map = new Map<string, number[]>();

    data.forEach((emp) => {
      const dep = emp.department || "—";
      if (!map.has(dep)) {
        map.set(dep, Array(12).fill(0));
      }
    });

    payroll.forEach((emp) => {
      const dep = emp.department || "—";
      const arr = map.get(dep)!;

      emp.rows.forEach((r: any, i: number) => {
        arr[i] += r.total;
      });
    });

    return Array.from(map.entries()).map(([dep, vals]) => ({
      dep,
      vals,
      totalYear: vals.reduce((a, b) => a + b, 0),
    }));
  }, [payroll]);

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "Calibri",
        fontSize: 12,
        background: "#0f1115",
        color: "#e6e6e6",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#ffffff" }}>ФОТcast v0.05</h1>

      <input type="file" onChange={handleFile} />

      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ background: "#1a1d24", color: "#fff" }}
        >
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>

        <button
          onClick={() => exportPayroll(payroll, monthLabels, year)}
          style={{ marginLeft: 10 }}
        >
          Export
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* ================= PAYROLL ================= */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={6}
            style={{
              borderCollapse: "collapse",
              width: "100%",
              background: "#161a22",
              color: "#e6e6e6",
            }}
          >
            <thead>
              <tr style={{ background: "#222836" }}>
                <th>ФИО</th>
                <th>Подразделение</th>

                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th> // ❌ убрали TOTAL
                ))}
              </tr>
            </thead>

            <tbody>
              {payroll.map((p: any, idx: number) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.department}</td>

                  {p.rows.map((r: any, i: number) => (
                    <td key={i}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontWeight: 600 }}>
                          {formatMoney(r.total)}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.7 }}>
                          {formatMoney(r.ins)} / {formatMoney(r.fot)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= HEADCOUNT ================= */}
      {tab === "headcount" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={6}
            style={{
              borderCollapse: "collapse",
              background: "#161a22",
              color: "#e6e6e6",
            }}
          >
            <thead>
              <tr style={{ background: "#222836" }}>
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

          {/* 💥 SUMMARY BLOCK */}
          <div style={{ marginTop: 40 }}>
            <h3>Summary by Department</h3>

            <table
              border={1}
              cellPadding={6}
              style={{
                borderCollapse: "collapse",
                width: "60%",
                background: "#161a22",
              }}
            >
              <thead>
                <tr style={{ background: "#222836" }}>
                  <th>Department</th>
                  <th>Total Year Cost</th>
                </tr>
              </thead>

              <tbody>
                {deptSummary.map((d, i) => (
                  <tr key={i}>
                    <td>{d.dep}</td>
                    <td>{formatMoney(d.totalYear)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}