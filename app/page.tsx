"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  // 📦 данные сотрудников
  const [data, setData] = useState<any[]>([]);

  // 📅 текущий год (ограничение: нельзя ниже текущего)
  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);

  // 🔀 вкладки
  const [tab, setTab] = useState<"payroll" | "headcount">("payroll");

  // 💰 формат денег
  const formatMoney = (v: number) =>
    new Intl.NumberFormat("ru-RU").format(v);

  // 📌 страховые параметры (фиксируем твою модель)
  const CAP = 2_979_000;
  const RATE_LOW = 0.30;
  const RATE_HIGH = 0.151;

  // 📌 Excel → Date
  const parseExcelDate = (value: any) => {
    if (!value) return null;
    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  // 📂 загрузка Excel
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

  // 🧠 PAYROLL ENGINE (FOT + INS + TOTAL)
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

        cumulative += monthFOT;

        // 🟢 зона до cap
        const base = Math.min(cumulative, CAP);

        // 🔴 превышение
        const excess = Math.max(cumulative - CAP, 0);

        // 📌 пропорция месяца (упрощённая модель)
        const baseShare = cumulative > 0 ? monthFOT * (base / cumulative) : 0;
        const excessShare = monthFOT - baseShare;

        const insurance =
          baseShare * RATE_LOW + excessShare * RATE_HIGH;

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

  // 👥 headcount pivot (департамент × месяцы)
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

  // 📤 EXPORT EXCEL
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const fotSheet = payroll.map(p => {
      const row: any = {
        ФИО: p.name,
        Подразделение: p.department,
      };

      months.forEach((_, i) => {
        row[`FOT_${i+1}`] = p.fot[i];
        row[`INS_${i+1}`] = p.ins[i];
        row[`TOTAL_${i+1}`] = p.total[i];
      });

      return row;
    });

    const headcountSheet = headcountMatrix.map(r => {
      const row: any = { Подразделение: r.dep };

      months.forEach((_, i) => {row[`M_${i+1}`] = r[i];
      });

      return row;
    });

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(fotSheet),
      "PAYROLL"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(headcountSheet),
      "HEADCOUNT"
    );

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

      {/* 📅 controls */}
      <div style={{ marginTop: 20 }}>
        <select
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) => CURRENT_YEAR + i).map(y => (
            <option key={y} value={y}>
              {y}
            </option>
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

      {/* 💰 PAYROLL TABLE */}
      {tab === "payroll" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table border={1} cellPadding={6}>
            <thead>
              <tr style={{ background: "#0abab5", color: "white" }}>
                <th>ФИО</th>
                <th>Подразделение</th>

                {months.map((_, i) => (
                  <>
                    <th key={"f"+i}>FOT {i+1}</th>
                    <th key={"i"+i}>INS {i+1}</th>
                    <th key={"t"+i}>TOTAL {i+1}</th>
                  </>
                ))}
              </tr>
            </thead>

            <tbody>
              {payroll.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.department}</td>

                  {months.map((_, i) => (
                    <>
                      <td>{formatMoney(p.fot[i])}</td>
                      <td>{formatMoney(p.ins[i])}</td>
                      <td>{formatMoney(p.total[i])}</td>
                    </>
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