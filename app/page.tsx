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

  // 👤 USER
  const [activeUser, setActiveUser] = useState("");

  // 📦 DATA
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  // 🎯 EXCEL-LIKE FILTERS (multi-select per column)
  const [filters, setFilters] = useState<{
    department: string[];
    name: string[];
  }>({
    department: [],
    name: [],
  });

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  // ================= LOAD =================
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
    } else {
      setData([]);
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

  // ================= MONTHS =================
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Date(year, i, 1)),
    [year]
  );

  const monthLabels = useMemo(
    () => months.map((m) => m.toLocaleString("ru", { month: "short" })),
    [months]
  );

  // ================= FILTER OPTIONS =================
  const departmentOptions = useMemo(() => {
    return Array.from(new Set(data.map((d: any) => d.department || "—")));
  }, [data]);

  const nameOptions = useMemo(() => {
    return Array.from(new Set(data.map((d: any) => d.name)));
  }, [data]);

  // ================= APPLY FILTERS =================
  const filteredData = useMemo(() => {
    return data.filter((emp: any) => {
      const dep = emp.department || "—";

      const depOk =
        filters.department.length === 0 ||
        filters.department.includes(dep);

      const nameOk =
        filters.name.length === 0 || filters.name.includes(emp.name);

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

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  // ================= FILTER UI =================
  const toggleFilter = (key: "department" | "name", value: string) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const clearFilters = () =>
    setFilters({ department: [], name: [] });

  return (
    <main className="app">
      <h1>ФОТcast v0.10</h1>

      <input type="file" onChange={handleFile} />

      {/* CONTROLS */}
      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) =>
            new Date().getFullYear() + i
          ).map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button onClick={clearFilters} style={{ marginLeft: 10 }}>
          Clear Filters
        </button>

        <button
          onClick={() => exportPayroll(payroll, monthLabels, year)}
          style={{ marginLeft: 10 }}
        >
          Export
        </button>
      </div>

      {/* FILTER PANEL (Excel style) */}
      <div style={{ marginTop: 20 }}>
        <b>Filters:</b>

        <div style={{ marginTop: 10 }}>
          <div>Department</div>
          {departmentOptions.map((d) => (
            <label key={d} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={filters.department.includes(d)}
                onChange={() => toggleFilter("department", d)}
              />
              {d}
            </label>
          ))}
        </div>

        <div style={{ marginTop: 10 }}>
          <div>Name</div>
          {nameOptions.map((n) => (
            <label key={n} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={filters.name.includes(n)}
                onChange={() => toggleFilter("name", n)}
              />
              {n}
            </label>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* ================= PAYROLL ================= */}
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
                    <td key={j}>{formatMoney(r.total)}</td>
                  ))}

                  <td>
                    {formatMoney(sum(p.rows.map((r: any) => r.total)))}
                  </td>
                </tr>
              ))}
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

                {months.map((_, j) => (
                  <td key={j}>
                    {sum(headcount.map((r: any) => r[j]))}
                  </td>
                ))}
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
      `}</style>
    </main>
  );
}