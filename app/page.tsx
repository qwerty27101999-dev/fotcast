"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

type Employee = {
  name: string;
  department: string;
  salary: number;
  hireDate: Date | null;
  fireDate: Date | null;
};

export default function Home() {
  const [data, setData] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("fotcast");
    return saved ? JSON.parse(saved) : [];
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  const CAP = 2_979_000;
  const RATE_LOW = 0.3;
  const RATE_HIGH = 0.151;

  // ----------------------------
  // FORMAT
  // ----------------------------
  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(v));

  // ----------------------------
  // SAVE / CLEAR
  // ----------------------------
  useEffect(() => {
    localStorage.setItem("fotcast", JSON.stringify(data));
  }, [data]);

  const clearData = () => {
    localStorage.removeItem("fotcast");
    setData([]);
  };

  // ----------------------------
  // DATE PARSER (FIXED)
  // ----------------------------
  const parseExcelDate = (value: any): Date | null => {
    if (!value) return null;

    if (typeof value === "number") {
      const d = XLSX.SSF.parse_date_code(value);
      return new Date(d.y, d.m - 1, d.d);
    }

    if (typeof value === "string") {
      const [dd, mm, yyyy] = value.split(".");
      if (!dd  !mm  !yyyy) return null;
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }

    return null;
  };

  // ----------------------------
  // FILE LOAD
  // ----------------------------
  const handleFile = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const wb = XLSX.read(event.target.result, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  // ----------------------------
  // NORMALIZATION
  // ----------------------------
  const employees: Employee[] = useMemo(() => {
    return data.map((emp) => ({
      name: emp.name,
      department: (emp.department || "—").trim(),
      salary: Number(emp.salary || 0),
      hireDate: parseExcelDate(emp.hire_date),
      fireDate: parseExcelDate(emp.fire_date),
    }));
  }, [data]);

  // ----------------------------
  // MONTHS
  // ----------------------------
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  const monthLabels = useMemo(
    () => months.map((m) => m.toLocaleString("ru", { month: "short" })),
    [months]
  );

  // ----------------------------
  // WORKED DAYS (FIXED CORE)
  // ----------------------------
  const getWorkedDays = (
    hire: Date | null,
    fire: Date | null,
    month: Date
  ) => {
    if (!hire) return 0;

    const startMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const start = hire > startMonth ? hire : startMonth;
    const end = fire && fire < endMonth ? fire : endMonth;

    if (start > end) return 0;

    return end.getDate() - start.getDate() + 1;
  };

  // ----------------------------
  // PAYROLL ENGINE (FIXED)
  // ----------------------------
  const payroll = useMemo(() => {
    return employees.map((emp) => {
      let cumulative = 0;

      const rows: any[] = [];

      for (const m of months) {
        const daysInMonth = new Date(
          m.getFullYear(),
          m.getMonth() + 1,
          0
        ).getDate();

        const workedDays = getWorkedDays(
          emp.hireDate,
          emp.fireDate,
          m
        );

        if (workedDays === 0) {
          rows.push({ fot: 0, ins: 0, total: 0 });
          continue;
        }

        const fot = emp.salary * (workedDays / daysInMonth);const remaining = Math.max(CAP - cumulative, 0);

        const taxedLow = Math.min(remaining, fot);
        const taxedHigh = Math.max(fot - remaining, 0);

        const ins =
          taxedLow * RATE_LOW + taxedHigh * RATE_HIGH;

        cumulative += fot;

        rows.push({
          fot,
          ins,
          total: fot + ins,
        });
      }

      return {
        name: emp.name,
        department: emp.department,
        rows,
      };
    });
  }, [employees, months]);

  // ----------------------------
  // DEPARTMENTS
  // ----------------------------
  const departments = useMemo(() => {
    return Array.from(
      new Set(employees.map((e) => e.department))
    );
  }, [employees]);

  // ----------------------------
  // HEADCOUNT (FIXED)
  // ----------------------------
  const headcountMatrix = useMemo(() => {
    return departments.map((dep) => {
      const row: any = { dep };

      const emps = employees.filter(
        (e) => e.department === dep
      );

      for (let i = 0; i < months.length; i++) {
        const end = new Date(
          months[i].getFullYear(),
          months[i].getMonth() + 1,
          0
        );

        let count = 0;

        for (const e of emps) {
          const hire = e.hireDate;
          const fire = e.fireDate;

          if (
            hire &&
            hire <= end &&
            (!fire || fire >= end) // важно: включаем день увольнения
          ) {
            count++;
          }
        }

        row[i] = count;
      }

      return row;
    });
  }, [employees, departments, months]);

  // ----------------------------
  // EXPORT
  // ----------------------------
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const sheet = payroll.map((p) => {
      const row: any = {
        ФИО: p.name,
        Подразделение: p.department,
      };

      p.rows.forEach((r: any, i: number) => {
        row[`FOT_${monthLabels[i]}`] = r.fot;
        row[`INS_${monthLabels[i]}`] = r.ins;
        row[`TOTAL_${monthLabels[i]}`] = r.total;
      });

      return row;
    });

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(sheet),
      "PAYROLL"
    );

    XLSX.writeFile(wb, `FOTcast_${year}.xlsx`);
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <main style={{ padding: 30, fontFamily: "Calibri", fontSize: 12 }}>
      <h2>FOTcast v1.0 (FIXED ENGINE)</h2>

      <input type="file" onChange={handleFile} />

      <button onClick={clearData} style={{ marginLeft: 10 }}>
        Clear
      </button>

      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[0, 1, 2].map((i) => {
            const y = new Date().getFullYear() + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <button onClick={exportToExcel} style={{ marginLeft: 10 }}>
          Export
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>
          Payroll
        </button>
        <button onClick={() => setTab("headcount")}>
          Headcount
        </button>
      </div>

      {/* PAYROLL */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={6}
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr style={{ background: "#0abab5", color: "white" }}>
                <th>ФИО</th>
                <th>Подразделение</th>
                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payroll.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td><td>{p.department}</td>

                  {p.rows.map((r: any, j: number) => (
                    <td key={j}>
                      <div>{formatMoney(r.fot)}</div>
                      <div style={{ opacity: 0.6, fontSize: 10 }}>
                        {formatMoney(r.ins)}
                      </div>
                    </td>
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
              <tr style={{ background: "#0abab5", color: "white" }}>
                <th>Департамент</th>
                {monthLabels.map((m, i) => (
                  <th key={i}>{m}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {headcountMatrix.map((r: any, i: number) => (
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