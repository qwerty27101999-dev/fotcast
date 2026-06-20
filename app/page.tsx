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

  const [filters, setFilters] = useState({
    department: "ALL",
    name: "ALL",
  });

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

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

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Date(year, i, 1)),
    [year]
  );

  const monthLabels = useMemo(
    () => months.map((m) => m.toLocaleString("ru", { month: "short" })),
    [months]
  );

  const baseFiltered = useMemo(() => {
    return data.filter((emp: any) => {
      const dep = emp.department || "—";
      return filters.department === "ALL" || filters.department === dep;
    });
  }, [data, filters.department]);

  const departmentOptions = useMemo(
    () => Array.from(new Set(data.map((d: any) => d.department || "—"))),
    [data]
  );

  const nameOptions = useMemo(
    () => Array.from(new Set(baseFiltered.map((d: any) => d.name))),
    [baseFiltered]
  );

  const filteredData = useMemo(() => {
    return data.filter((emp: any) => {
      const depOk =
        filters.department === "ALL" || filters.department === emp.department;

      const nameOk =
        filters.name === "ALL" || filters.name === emp.name;

      return depOk && nameOk;
    });
  }, [data, filters]);

  const payroll = useMemo(
    () => buildPayroll(filteredData, months, CAP, RATE_LOW, RATE_HIGH, parseExcelDate),
    [filteredData, months]
  );

  const headcount = useMemo(
    () => buildHeadcount(filteredData, months, parseExcelDate),
    [filteredData, months]
  );

  const payrollTotals = useMemo(() => {
    const monthly = Array(12).fill(0);

    payroll.forEach((p: any) => {
      p.rows.forEach((r: any, i: number) => {
        monthly[i] += r.total;
      });
    });

    return monthly;
  }, [payroll]);

  const headcountTotals = useMemo(() => {
    const monthly = Array(12).fill(0);

    headcount.forEach((r: any) => {
      months.forEach((_, i) => {
        monthly[i] += r[i];
      });
    });

    return monthly;
  }, [headcount, months]);

  return (
    <main className="app">
      <h1>ФОТкаст (build 0.1)</h1>

      <input type="file" onChange={handleFile} />

      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={saveMemory}>
  Сохранить
</button>

<button className="btn" onClick={clearMemory}>
  Очистить
</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(
            (y) => (
              <option key={y}>{y}</option>
            )
          )}
        </select>

        <button className="btn" onClick={() => exportPayroll(payroll, monthLabels, year)}>
  Export
</button>
      </div>

{/* TABS */}

<div style={{ marginTop: 20, display: "flex", gap: 8 }}>
  <button
    className={`btn btn-tab ${tab === "payroll" ? "btn-tab-active" : ""}`}
    onClick={() => setTab("payroll")}
  >
    Payroll
  </button>

  <button
    className={`btn btn-tab ${tab === "headcount" ? "btn-tab-active" : ""}`}
    onClick={() => setTab("headcount")}
  >
    Headcount
  </button>
</div>

      {/* FILTERS */}
      <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
        <select
          value={filters.department}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              department: e.target.value,
              name: "ALL",
            }))
          }
        >
          <option value="ALL">All departments</option>
          {departmentOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={filters.name}
          onChange={(e) =>
            setFilters((f) => ({ ...f, name: e.target.value }))
          }
        >
          <option value="ALL">All names</option>
          {nameOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* PAYROLL */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
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
                    <td key={j}>
                      <div>
                        {/* 🔥 MAIN VALUE */}
                        <div style={{ fontWeight: 500 }}>
                          {formatMoney(r.total)}
                        </div>

                        {/* 🔥 RESTORED BREAKDOWN */}
                        <div style={{ fontSize: 10, opacity: 0.7 }}>
                          FOT: {formatMoney(r.fot)} | INS: {formatMoney(r.ins)}
                        </div>
                      </div>
                    </td>
                  ))}

                  <td>
                    {formatMoney(sum(p.rows.map((r: any) => r.total)))}
                  </td>
                </tr>
              ))}

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

        <tr style={{ fontWeight: 600, background: "#f5f7fa" }}>
          <td>TOTAL</td>

          {headcountTotals.map((v, i) => (
            <td key={i}>{v}</td>
          ))}
        </tr>
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
      `}</style>
    </main>
  );
}