"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  // 📦 данные из Excel
  const [data, setData] = useState<any[]>([]);

  // 📅 выбранный год расчёта
  const [year, setYear] = useState(2026);

  // 🔀 вкладки интерфейса
  const [tab, setTab] = useState<"fot" | "headcount">("fot");

  // 💰 формат денег
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("ru-RU").format(value);

  // 📌 Excel → JS дата
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
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };

    reader.readAsBinaryString(file);
  };

  // 📅 месяцы года
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  // 💰 расчёт ФОТ
  const employeeRows = useMemo(() => {
    return data.map((row) => {
      const hireDate = parseExcelDate(row.hire_date);
      const salary = Number(row.salary || 0);

      const monthly = months.map((m) => {
        if (!hireDate) return 0;

        const start = new Date(m.getFullYear(), m.getMonth(), 1);
        const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

        if (hireDate > end) return 0;
        if (hireDate <= start) return salary;

        const days = end.getDate();
        const worked = days - hireDate.getDate() + 1;

        return Math.round((salary * worked) / days);
      });

      return {
        name: row.name,
        department: row.department || "—",
        hireDate,
        salary,
        monthly,
        yearlyTotal: monthly.reduce((a, b) => a + b, 0),
      };
    });
  }, [data, months]);

  // 👥 headcount (общий)
  const headcountByMonth = useMemo(() => {
    return months.map((m) => {
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);

      return {
        month: m.toLocaleString("ru-RU", { month: "long", year: "numeric" }),
        count: data.filter((r) => {
          const d = parseExcelDate(r.hire_date);
          return d && d <= end;
        }).length,
      };
    });
  }, [data, months]);

  // 📤 EXPORT EXCEL (главная функция продукта)
  const exportToExcel = () => {
    // 📦 employees sheet
    const employeesSheet = data.map((r) => ({
      ФИО: r.name,
      Подразделение: r.department || "—",
      Дата_найма: r.hire_date,
      Оклад: r.salary,
    }));

    // 💰 FOT sheet
    const fotSheet = employeeRows.map((e) => {
      const row: any = {
        ФИО: e.name,
        Подразделение: e.department,
        Оклад: e.salary,
        Итого_год: e.yearlyTotal,
      };

      months.forEach((m, i) => {
        row[m.toLocaleString("ru-RU", { month: "short" })] = e.monthly[i];
      });

      return row;
    });

    // 👥 headcount sheet
    const headcountSheet = headcountByMonth.map((m) => ({
      Месяц: m.month,
      Численность: m.count,
    }));

    // 📘 workbook
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(employeesSheet),
      "Employees"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(fotSheet),
      "FOT"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(headcountSheet),
      "Headcount"
    );

    // 📥 download
    XLSX.writeFile(wb, `FOTcast_${year}.xlsx`);
  };

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "Calibri, Arial",
        fontSize: 12,
      }}
    >
      <h1>FOTcast</h1>

      {/* 📂 upload */}<input type="file" onChange={handleFile} />

      {/* 📅 year + EXPORT (GLOBAL BUTTON) */}
      <div style={{ marginTop: 20 }}>
        <label>Год: </label>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>

        {/* 📤 единственная кнопка экспорта */}
        <button
          onClick={exportToExcel}
          style={{
            marginLeft: 15,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          📤 Export Excel
        </button>
      </div>

      {/* 🔀 tabs */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("fot")} style={{ marginRight: 10 }}>
          ФОТ
        </button>
        <button onClick={() => setTab("headcount")}>
          Численность
        </button>
      </div>

      {/* 💰 FOT TABLE */}
      {tab === "fot" && (
        <table
          border={1}
          cellPadding={6}
          style={{
            marginTop: 30,
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr style={{ background: "#0abab5", color: "white" }}>
              <th>ФИО</th>
              <th>Подразделение</th>
              <th>Дата</th>
              <th>Оклад</th>

              {months.map((m, i) => (
                <th key={i}>
                  {m.toLocaleString("ru-RU", { month: "short" })}
                </th>
              ))}

              <th>Год</th>
            </tr>
          </thead>

          <tbody>
            {employeeRows.map((e, i) => (
              <tr key={i}>
                <td>{e.name}</td>
                <td>{e.department}</td>
                <td>
                  {e.hireDate?.toLocaleDateString("ru-RU") || "—"}
                </td>
                <td>{formatMoney(e.salary)}</td>

                {e.monthly.map((v, j) => (
                  <td key={j}>{formatMoney(v)}</td>
                ))}

                <td><b>{formatMoney(e.yearlyTotal)}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 👥 HEADCOUNT */}
      {tab === "headcount" && (
        <div style={{ marginTop: 30, overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={6}
            style={{
              borderCollapse: "collapse",
              width: "max-content",
            }}
          >
            <thead>
              <tr style={{ background: "#0abab5", color: "white" }}>
                <th>Месяц</th>
                <th>Численность</th>
              </tr>
            </thead>

            <tbody>
              {headcountByMonth.map((m, i) => (
                <tr key={i}>
                  <td>{m.month}</td>
                  <td><b>{m.count}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}