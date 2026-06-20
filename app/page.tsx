"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  // 📦 данные
  const [data, setData] = useState<any[]>([]);

  // 📅 год
  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);

  // 🔀 вкладки
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  // 💰 страховые параметры
  const CAP = 2_979_000;
  const RATE_LOW = 0.30;
  const RATE_HIGH = 0.151;

  // 💸 формат денег
  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  // 📅 Excel date
  const parseExcelDate = (value: any) => {
    if (!value) return null;
    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  // 📂 upload
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

  // 👥 departments
  const departments = useMemo(() => {
    return Array.from(new Set(data.map(d => d.department || "—")));
  }, [data]);

  // 🧠 PAYROLL ENGINE (FIXED CAP LOGIC)
  const payroll = useMemo(() => {
    return data.map(emp => {
      const hire = parseExcelDate(emp.hire_date);
      const salary = Number(emp.salary || 0);

      let cumulative = 0;

      const fot: number[] = [];
      const ins: number[] = [];
      const total: number[] = [];

      for (let i = 0; i < 12; i++) {
        const m = months[i];
        const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        if (!hire || hire > monthEnd) {
          fot.push(0);
          ins.push(0);
          total.push(0);
          continue;
        }

        const monthFOT = salary;

        const prev = cumulative;
        const next = prev + monthFOT;

        const remainingCap = Math.max(CAP - prev, 0);

        let insurance = 0;

        if (remainingCap >= monthFOT) {
          insurance = monthFOT * RATE_LOW;
        } else {
          const lowPart = remainingCap * RATE_LOW;
          const highPart = (monthFOT - remainingCap) * RATE_HIGH;
          insurance = lowPart + highPart;
        }

        cumulative = next;

        fot.push(monthFOT);
        ins.push(Math.round(insurance));
        total.push(monthFOT + Math.round(insurance));
      }

      return {
        name: emp.name,
        department: emp.department || "—",
        fot,
        ins,
        total,
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

  // 📤 export
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const sheet = payroll.map(p => {
      const row: any = {
        ФИО: p.name,
        Подразделение: p.department,
      };

      months.forEach((_, i) => {
        row[`FOT_${i + 1}`] = p.fot[i];
        row[`INS_${i + 1}`] = p.ins[i];
        row[`TOTAL_${i + 1}`] = p.total[i];
      });

      return row;
    });

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(sheet),
      "PAYROLL"
    );

    XLSX.writeFile(wb, `FOTcast_v0.02_FIX_${year}.xlsx`);
  };

  const handleYearChange = (y: number) => {
    if (y < CURRENT_YEAR) return;
    setYear(y);
  };
return (
    <main style={{ padding: 40, fontFamily: "Calibri", fontSize: 12 }}>
      <h1>FOTcast v0.02 FIX</h1>

      {/* 📂 upload */}
      <input type="file" onChange={handleFile} />

      {/* 📅 controls */}
      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) => CURRENT_YEAR + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={exportToExcel} style={{ marginLeft: 10 }}>
          📤 Export
        </button>
      </div>

      {/* 🔀 tabs */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("payroll")}>Payroll</button>
        <button onClick={() => setTab("headcount")}>Headcount</button>
      </div>

      {/* 💰 PAYROLL TABLE (FIXED LAYOUT) */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table border={1} cellPadding={6}>
            <thead>
              <tr style={{ background: "#0abab5", color: "white" }}>
                <th>ФИО</th>
                <th>Подразделение</th>

                <th colSpan={12}>FOT</th>
                <th colSpan={12}>INSURANCE</th>
                <th colSpan={12}>TOTAL</th>
              </tr>

              <tr style={{ background: "#0abab5", color: "white" }}>
                {months.map((m, i) => (
                  <th key={"f"+i}>
                    {m.toLocaleString("ru", { month: "short" })}
                  </th>
                ))}
                {months.map((m, i) => (
                  <th key={"i"+i}>
                    {m.toLocaleString("ru", { month: "short" })}
                  </th>
                ))}
                {months.map((m, i) => (
                  <th key={"t"+i}>
                    {m.toLocaleString("ru", { month: "short" })}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payroll.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.department}</td>

                  {p.fot.map((v, i) => (
                    <td key={"f"+i}>{formatMoney(v)}</td>
                  ))}

                  {p.ins.map((v, i) => (
                    <td key={"i"+i}>{formatMoney(v)}</td>
                  ))}

                  {p.total.map((v, i) => (
                    <td key={"t"+i}>{formatMoney(v)}</td>
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
                {months.map((_, i) => (
                  <th key={i}>{i + 1}</th>
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
