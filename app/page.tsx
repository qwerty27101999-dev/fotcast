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
    () => months.map((m) => m.toLocaleString("ru", { month: "short" })),
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

  const deptSummary = useMemo(() => {
    const map = new Map<string, number[]>();

    payroll.forEach((emp: any) => {
      const dep = emp.department || "—";

      if (!map.has(dep)) {
        map.set(dep, Array(12).fill(0));
      }

      const arr = map.get(dep)!;

      emp.rows.forEach((r: any, i: number) => {
        arr[i] += r.total;
      });
    });

    return Array.from(map.entries()).map(([dep, vals]) => ({
      dep,
      totalYear: vals.reduce((a, b) => a + b, 0),
    }));
  }, [payroll]);

  return (
    <main className="app">
      <h1>ФОТcast v0.04</h1>

      <input type="file" onChange={handleFile} />

      <div className="toolbar">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>

        <button onClick={() => exportPayroll(payroll, monthLabels, year)}>
          Export
        </button>
      </div>

      <div className="tabs">
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* PAYROLL */}
      {tab === "payroll" && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Подразделение</th>
                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th>
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
                      <div className="cell">
                        <div className="main">
                          {formatMoney(r.total)}
                        </div>
                        <div className="sub">
                          INS {formatMoney(r.ins)} | FOT {formatMoney(r.fot)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <h3>Summary by Department</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {deptSummary.map((d: any, i: number) => (
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

      {/* HEADCOUNT */}
      {tab === "headcount" && (
        <div className="table-wrap">
          <table className="table">
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

      <style jsx global>{`
        .app {
          padding: 40px;
          font-family: "Century Gothic", sans-serif;
          font-size: 12px;
        }

        .toolbar {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .tabs {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .table-wrap {
          margin-top: 30px;
          overflow-x: auto;
        }

        .table {
          border-collapse: collapse;
          width: 100%;
        }

        .table th {
          background: #1a2a42;
          color: white;
          font-weight: 400;
          padding: 6px 10px;
          border: 1px solid #d0d7e2;
          text-align: left;
        }

        .table td {
          border: 1px solid #d0d7e2;
          padding: 6px 10px;
          vertical-align: top;
        }

        .cell .main {
          font-weight: 400;
        }

        .cell .sub {
          font-size: 10px;
          opacity: 0.7;
        }

        .summary {
          margin-top: 40px;
        }
      `}</style>
    </main>
  );
}