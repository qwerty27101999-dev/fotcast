"use client";

import { useState, useMemo, useEffect } from "react";

import { buildPayroll } from "@/lib/payrollEngine";
import { buildHeadcount } from "@/lib/headcountEngine";
import { exportPayroll } from "@/utils/exportExcel";
import { parseExcelDate } from "@/utils/date";

export default function Home() {
  const CAP = 2_979_000;
  const RATE_LOW = 0.3;
  const RATE_HIGH = 0.151;

  const STORAGE_PREFIX = "fotcast_user_";

  const [activeUser, setActiveUser] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  // Jira-style filters (simple text + multi)
  const [filters, setFilters] = useState({
    department: "",
    name: "",
  });

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  // ================= LOAD USER =================
  useEffect(() => {
    const last = localStorage.getItem("fotcast_last_user");
    if (last) setActiveUser(last);
  }, []);

  useEffect(() => {
    if (!activeUser) return;

    const raw = localStorage.getItem(STORAGE_PREFIX + activeUser);

    if (raw) {
      const parsed = JSON.parse(raw);
      setData(parsed.data || []);
      setYear(parsed.year || new Date().getFullYear());
      setTab(parsed.tab || "payroll");
    }
  }, [activeUser]);

  // ================= FILE =================
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

  // ================= SAVE / CLEAR =================
  const saveMemory = () => {
    if (!activeUser) return;

    localStorage.setItem(
      STORAGE_PREFIX + activeUser,
      JSON.stringify({ data, year, tab })
    );

    localStorage.setItem("fotcast_last_user", activeUser);
  };

  const clearMemory = () => {
    if (!activeUser) return;
    localStorage.removeItem(STORAGE_PREFIX + activeUser);
    setData([]);
  };

  // ================= MONTHS =================
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Date(year, i, 1)),
    [year]
  );

  const monthLabels = useMemo(
    () => months.map((m) => m.toLocaleString("ru", { month: "short" })),
    [months]
  );

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return data.filter((emp: any) => {
      const dep = emp.department || "—";

      const depOk =
        !filters.department ||
        dep.toLowerCase().includes(filters.department.toLowerCase());

      const nameOk =
        !filters.name ||
        emp.name?.toLowerCase().includes(filters.name.toLowerCase());

      return depOk && nameOk;
    });
  }, [data, filters]);

  // ================= ENGINE =================
  const payroll = useMemo(
    () =>
      buildPayroll(
        filteredData,
        months,
        CAP,
        RATE_LOW,
        RATE_HIGH,
        parseExcelDate
      ),
    [filteredData, months]
  );

  const headcount = useMemo(
    () => buildHeadcount(filteredData, months, parseExcelDate),
    [filteredData, months]
  );

  // ================= PAYROLL TOTALS =================
  const payrollTotals = useMemo(() => {
    const monthly = Array(12).fill(0);

    payroll.forEach((p: any) => {
      p.rows.forEach((r: any, i: number) => {
        monthly[i] += r.total;
      });
    });

    return monthly;
  }, [payroll]);

  // ================= HEADCOUNT TOTALS =================
  const headcountTotals = useMemo(() => {
    const monthly = Array(12).fill(0);

    headcount.forEach((r: any) => {
      months.forEach((_, i) => {
        monthly[i] += r[i];
      });
    });

    return monthly;
  }, [headcount, months]);

  // ================= UI =================
  return (
    <main className="app">
      <h1>ФОТcast v0.12</h1>

      <input type="file" onChange={handleFile} />

      {/* USER CONTROLS */}
      <div style={{ marginTop: 10 }}>
        <button onClick={saveMemory}>Save</button>
        <button onClick={clearMemory} style={{ marginLeft: 10 }}>
          Clear
        </button>
      </div>

      {/* YEAR */}
      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(
            (y) => (
              <option key={y}>{y}</option>
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

      {/* TABS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* ================= PAYROLL ================= */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          {/* Jira-style filters */}
          <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
            <input
              placeholder="Filter department..."
              value={filters.department}
              onChange={(e) =>
                setFilters((f) => ({ ...f, department: e.target.value }))
              }
            />

            <input
              placeholder="Filter name..."
              value={filters.name}
              onChange={(e) =>
                setFilters((f) => ({ ...f, name: e.target.value }))
              }
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Подразделение</th>

                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th>
                ))}

                <th>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {payroll.map((p: any, i: number) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.department}</td>

                  {p.rows.map((r: any, j: number) => (
                    <td key={j}>{formatMoney(r.total)}</td>
                  ))}

                  <td>
                    {formatMoney(sum(p.rows.map((r: any) => r.total)))}
                  </td>
                </tr>
              ))}

              {/* 🔥 RESTORED TOTAL ROW */}
              <tr style={{ fontWeight: 600, background: "#f5f7fa" }}>
                <td>TOTAL</td>
                <td />

                {payrollTotals.map((v, i) => (
                  <td key={i}>{formatMoney(v)}</td>
                ))}

                <td>{formatMoney(sum(payrollTotals))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ================= HEADCOUNT ================= */}
      {tab === "headcount" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Департамент</th>

                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th>
                ))}

                <th>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {headcount.map((r: any, i: number) => (
                <tr key={i}>
                  <td>{r.dep}</td>

                  {months.map((_, j) => (
                    <td key={j}>{r[j]}</td>
                  ))}

                  <td>{sum(months.map((_, j) => r[j]))}</td>
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr style={{ fontWeight: 600, background: "#f5f7fa" }}>
                <td>TOTAL</td>

                {headcountTotals.map((v, i) => (
                  <td key={i}>{v}</td>
                ))}

                <td>{sum(headcountTotals)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* STYLE */}
      <style jsx global>{`
        .app {
          padding: 40px;
          font-family: "Century Gothic", sans-serif;
          font-size: 12px;
        }

        .table {
          border-collapse: collapse;
          width: 100%;
          font-size: 12px;
        }

        .table th {
          background: #1a2a42;
          color: white;
          font-weight: 400;
          padding: 6px 10px;
          border: 1px solid #d0d7e2;
        }

        .table td {
          border: 1px solid #d0d7e2;
          padding: 6px 10px;
        }

        input {
          padding: 6px 8px;
          border: 1px solid #ccc;
          font-family: inherit;
          font-size: 12px;
        }

        button {
          padding: 6px 10px;
          font-size: 12px;
        }
      `}</style>
    </main>
  );
}