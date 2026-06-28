"use client";

import { useMemo, useState } from "react";

import { buildPayroll } from "@/lib/payrollEngine";
import { buildHeadcount } from "@/lib/headcountEngine";
import { parseExcelDate } from "@/utils/date";
import { exportPayroll } from "@/utils/exportExcel";

import { getScenario } from "@/lib/scenario";

import { Toolbar } from "@/components/layout/Toolbar";
import { DashboardCards } from "@/components/layout/DashboardCards";
import { Tabs } from "@/components/layout/Tabs";

import { PayrollTable } from "@/components/tables/PayrollTable";
import { HeadcountTable } from "@/components/tables/HeadcountTable";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const [tab, setTab] =
    useState<"payroll" | "headcount">("payroll");

  // Build 2.1
  const scenario = getScenario("base");

  const months = useMemo(
    () =>
      Array.from(
        { length: 12 },
        (_, i) => new Date(year, i, 1)
      ),
    [year]
  );

  const payroll = useMemo(
    () =>
      buildPayroll(
        data,
        months,
        parseExcelDate,
        scenario
      ),
    [data, months, scenario]
  );

  const headcount = useMemo(
    () =>
      buildHeadcount(
        data,
        months,
        parseExcelDate
      ),
    [data, months]
  );

  return (
    <main className="app">

      <Toolbar
        data={data}
        setData={setData}
        year={year}
        setYear={setYear}
        payroll={payroll}
        months={months}
        onExport={exportPayroll}
      />

      <DashboardCards
        payroll={payroll}
        headcount={headcount}
      />

      <Tabs
        tab={tab}
        setTab={setTab}
      />

      {tab === "payroll" && (
        <PayrollTable
          payroll={payroll}
          months={months}
        />
      )}

      {tab === "headcount" && (
        <HeadcountTable
          headcount={headcount}
          months={months}
        />
      )}

    </main>
  );
}