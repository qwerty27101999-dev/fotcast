"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  // 📦 данные сотрудников
  const [data, setData] = useState<any[]>([]);

  // 📅 текущий год (ОГРАНИЧЕНИЕ: нельзя меньше текущего)
  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);

  // 🔀 вкладка
  const [tab, setTab] = useState<"fot" | "headcount">("fot");

  // 💰 формат денег
  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  // 📌 constants страховых
  const CAP = 2_979_000;
  const RATE_LOW = 0.30;
  const RATE_HIGH = 0.151;

  // 📌 Excel date parser
  const parseExcelDate = (value: any) => {
    if (!value) return null;
    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  // 📂 upload Excel
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

  // 📅 месяцы года
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  // 👥 департаменты
  const departments = useMemo(() => {
    return Array.from(new Set(data.map(d => d.department || "—")));
  }, [data]);

  // 💰 FOT + insurance model per employee
  const payroll = useMemo(() => {
    return data.map((emp) => {
      const hire = parseExcelDate(emp.hire_date);
      const salary = Number(emp.salary || 0);

      let cumulative = 0;

      const fot = [];
      const insurance = [];
      const total = [];

      for (let i = 0; i < 12; i++) {
        const m = months[i];

        if (!hire || hire > new Date(m.getFullYear(), m.getMonth() + 1, 0)) {
          fot.push(0);
          insurance.push(0);
          total.push(0);
          continue;
        }

        // 📌 месячный ФОТ (упрощённо)
        const monthFOT = salary;

        cumulative += monthFOT;

        // 🟢 зона до cap
        const base = Math.min(cumulative, CAP);

        // 🔴 превышение
        const excess = Math.max(cumulative - CAP, 0);

        // 📌 распределяем налог пропорционально месяцу (упрощённо)
        const baseShare = monthFOT * (base / cumulative || 0);
        const excessShare = monthFOT - baseShare;

        const ins =
          baseShare * RATE_LOW + excessShare * RATE_HIGH;

        fot.push(monthFOT);
        insurance.push(Math.round(ins));
        total.push(monthFOT + Math.round(ins));
      }

      return {
        name: emp.name,
        department: emp.department || "—",
        fot,
        insurance,
        total,
      };
    });
  }, [data, months]);

  // 👥 headcount pivot
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

  // 📂 export
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const fotSheet = payroll.map(p => ({
      ФИО: p.name,
      Подразделение: p.department,
      ...months.reduce((acc: any, m, i) => {
        acc[`FOT_${i+1}`] = p.fot[i];
        return acc;
      }, {})
    }));

    const insSheet = payroll.map(p => ({
      ФИО: p.name,
      Подразделение: p.department,
      ...months.reduce((acc: any, m, i) => {
        acc[`INS_${i+1}`] = p.insurance[i];
        return acc;
      }, {})
    }));

    const totalSheet = payroll.map(p => ({
      ФИО: p.name,
      Подразделение: p.department,
      ...months.reduce((acc: any, m, i) => {
        acc[`TOTAL_${i+1}`] = p.total[i];
        return acc;
      }, {})
    }));

    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fotSheet), "FOT");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(insSheet), "INSURANCE");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(totalSheet), "TOTAL");

    XLSX.writeFile(wb, `FOTcast_v0.02_${year}.xlsx`);
  };

  // 🚨 ограничение года
  const handleYearChange = (y: number) => {
    if (y < CURRENT_YEAR) return;
    setYear(y);
  };

  return (
    <main style={{ padding: 40, fontFamily: "Calibri", fontSize: 12 }}>
      <h1>FOTcast v0.02</h1>

      {/* 📂 upload */}
      <input type="file" onChange={handleFile} />

      {/* 📅 year control */}
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
        <button onClick={() => setTab("fot")}>ФОТ</button>
        <button onClick={() => setTab("headcount")}>Численность</button>
      </div>

      {/* 📊 HEADCOUNT */}
      {tab === "headcount" && (
        <table border={1} cellPadding={6}>
          <thead>
            <tr style={{ background: "#0abab5", color: "#fff" }}>
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
      )}
    </main>
  );
}