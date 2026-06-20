"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);

  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  const CAP = 2_979_000;
  const RATE_LOW = 0.3;
  const RATE_HIGH = 0.151;

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  const parseExcelDate = (value: any) => {
    if (!value) return null;
    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const wb = XLSX.read(event.target.result, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };

    reader.readAsBinaryString(file);
  };

  // 📅 months
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  const monthLabels = months.map(m =>
    m.toLocaleString("ru", { month: "short" })
  );

  const departments = useMemo(() => {
    return Array.from(new Set(data.map(d => d.department || "—")));
  }, [data]);

  // 🧠 ENGINE
  const payroll = useMemo(() => {
    return data.map(emp => {
      const hire = parseExcelDate(emp.hire_date);
      const salary = Number(emp.salary || 0);

      let cumulative = 0;

      const rows: any[] = [];

      for (let i = 0; i < 12; i++) {
        const m = months[i];
        const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        if (!hire || hire > monthEnd) {
          rows.push({
            fot: 0,
            ins: 0,
            total: 0,
          });
          continue;
        }

        const monthФОТ = salary;

        const prev = cumulative;
        const remainingCap = Math.max(CAP - prev, 0);

        let insurance = 0;

        if (remainingCap >= monthФОТ) {
          insurance = monthФОТ * RATE_LOW;
        } else {
          insurance =
            remainingCap * RATE_LOW +
            (monthФОТ - remainingCap) * RATE_HIGH;
        }

        cumulative += monthФОТ;

        rows.push({
          fot: monthФОТ,
          ins: Math.round(insurance),
          total: monthФОТ + Math.round(insurance),
        });
      }

      return {
        name: emp.name,
        department: emp.department || "—",
        rows,
      };
    });
  }, [data, months]);

  // 👥 headcount
  const headcountMatrix = useMemo(() => {
    return departments.map(dep => {
      const row: any = { dep };

      months.forEach((m, i) => {
        const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        row[i] = data.filter(emp => {
          const d = parseExcelDate(emp.hire_date);
          return (emp.department || "—") === dep && d && d <= end;
        }).length;
      });

      return row;
    });
  }, [data, months, departments]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const sheet = payroll.map(p => {
      const row: any = {
        ФИО: p.name,
        Подразделение: p.department,
      };

      p.rows.forEach((r: any, i: number) => {
        row[`ФОТ_${monthLabels[i]}`] = r.fot;
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

    XLSX.writeFile(wb, `ФОТcast_${year}.xlsx`);
  };

  return (
    <main style={{ padding: 40, fontFamily: "Calibri", fontSize: 12 }}>
      <h1>ФОТcast v0.03 (FLAT GRID)</h1>

      <input type="file" onChange={handleFile} />

      <div style={{ marginTop: 20 }}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>{Array.from({ length: 3 }, (_, i) => CURRENT_YEAR + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={exportToExcel} style={{ marginLeft: 10 }}>
          Export
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* 💰 PAYROLL */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={6}
            style={{
              borderCollapse: "collapse",
              tableLayout: "auto",
              width: "100%",
              fontFamily: "Calibri",
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ background: "#0abab5", color: "white" }}>
                <th>ФИО</th>
                <th>Подразделение</th>

                {monthLabels.map((m, i) => (
                  <th key={"f"+i}>ФОТ {m}</th>
                ))}
                {monthLabels.map((m, i) => (
                  <th key={"i"+i}>INS {m}</th>
                ))}
                {monthLabels.map((m, i) => (
                  <th key={"t"+i}>TOTAL {m}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payroll.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.department}</td>

                  {p.rows.map((r: any, i: number) => (
                    <td key={"f"+i}>{formatMoney(r.fot)}</td>
                  ))}

                  {p.rows.map((r: any, i: number) => (
                    <td key={"i"+i}>{formatMoney(r.ins)}</td>
                  ))}

                  {p.rows.map((r: any, i: number) => (
                    <td key={"t"+i}>{formatMoney(r.total)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 👥 HEADCOUNT */}
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
              {headcountMatrix.map((r, i) => (
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