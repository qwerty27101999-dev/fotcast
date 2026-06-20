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
  const [inputUser, setInputUser] = useState("");
  const [activeUser, setActiveUser] = useState("");

  // 📦 DATA
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  // 🎯 FILTERS
  const [depFilter, setDepFilter] = useState("ALL");
  const [nameFilter, setNameFilter] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  // ================= LOAD USER =================
  useEffect(() => {
    const last = localStorage.getItem("fotcast_last_user");
    if (last) setActiveUser(last);
  }, []);

  // ================= LOAD DATA =================
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

  // ================= SAVE =================
  const saveMemory = () => {
    if (!activeUser) return;

    localStorage.setItem(
      STORAGE_PREFIX + activeUser,
      JSON.stringify({ data, year, tab })
    );

    localStorage.setItem("fotcast_last_user", activeUser);

    alert("Saved ✔");
  };

  // ================= CLEAR =================
  const clearMemory = () => {
    if (!activeUser) return;

    localStorage.removeItem(STORAGE_PREFIX + activeUser);

    setData([]);
    setYear(new Date().getFullYear());
    setTab("payroll");
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

  // ================= FILTERS =================
  const departments = useMemo(() => {
    const set = new Set(data.map((d: any) => d.department || "—"));
    return ["ALL", ...Array.from(set)];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((emp: any) => {
      const dep = emp.department || "—";

      const salary = Number(
        String(emp.salary || 0)
          .replace(/\s/g, "")
          .replace(",", ".")
      );

      const matchDep =
        depFilter === "ALL" || dep === depFilter;

      const matchName =
        emp.name
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase());

      const matchMin =
        !minSalary || salary >= Number(minSalary);

      const matchMax =
        !maxSalary || salary <= Number(maxSalary);

      return matchDep && matchName && matchMin && matchMax;
    });
  }, [data, depFilter, nameFilter, minSalary, maxSalary]);

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

    return Array.from(map.entries()).map(([dep, months]) => ({
      dep,
      months,
      totalYear: months.reduce((a, b) => a + b, 0),
    }));
  }, [payroll]);

  // ================= LOGIN =================
  if (!activeUser) {
    return (
      <main className="app">
        <h1>ФОТcast</h1>

        <input
          placeholder="Enter username"
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
        />

        <button
          onClick={() => {
            if (!inputUser.trim()) return;
            setActiveUser(inputUser.trim());
          }}
        >
          Enter
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>ФОТcast v0.06</h1>

      {/* USER */}
      <div style={{ marginBottom: 20 }}>
        <b>User:</b> {activeUser}

        <button
          style={{ marginLeft: 10 }}
          onClick={() => setActiveUser("")}
        >
          Switch
        </button>
      </div>

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

        <button
          onClick={() => exportPayroll(payroll, monthLabels, year)}
          style={{ marginLeft: 10 }}
        >
          Export
        </button>

        <button onClick={saveMemory} style={{ marginLeft: 10 }}>
          Save
        </button>

        <button onClick={clearMemory} style={{ marginLeft: 10 }}>
          Clear
        </button>
      </div>

      {/* FILTERS */}
      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <select value={depFilter} onChange={(e) => setDepFilter(e.target.value)}>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <input
          placeholder="Search name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <input
          placeholder="Min salary"
          type="number"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />

        <input
          placeholder="Max salary"
          type="number"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
        />

        <button
          onClick={() => {
            setDepFilter("ALL");
            setNameFilter("");
            setMinSalary("");
            setMaxSalary("");
          }}
        >
          Reset
        </button>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* SUMMARY */}
          <div style={{ marginTop: 40 }}>
            <h3>Summary by Department</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  {monthLabels.map((m, i) => (
                    <th key={i}>{m}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {deptSummary.map((d, i) => (
                  <tr key={i}>
                    <td>{d.dep}</td>

                    {d.months.map((v, j) => (
                      <td key={j}>{formatMoney(v)}</td>
                    ))}

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
              {headcount.map((r, i) => (
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