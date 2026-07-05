"use client";

import { useMemo, useState } from "react";

import { buildPayroll } from "@/lib/payrollEngine";
import { buildHeadcount } from "@/lib/headcountEngine";

import { buildCompany } from "@/lib/company/companyEngine";

import { parseExcelDate } from "@/utils/date";
import { exportPayroll } from "@/utils/exportExcel";

import { baseScenario } from "@/lib/scenario";
import { Employee } from "@/lib/types";

import { Toolbar } from "@/components/layout/Toolbar";

import { Sidebar } from "@/components/navigation/Sidebar";
import { PageContainer } from "@/components/navigation/PageContainer";

import { DashboardPage } from "@/components/pages/DashboardPage";
import { PayrollPage } from "@/components/pages/PayrollPage";
import { HeadcountPage } from "@/components/pages/HeadcountPage";
import { ScenarioPage } from "@/components/pages/ScenarioPage";
import { CompanyPage } from "@/components/pages/CompanyPage";
import { ExportPage } from "@/components/pages/ExportPage";

type AppPage =
  | "dashboard"
  | "payroll"
  | "headcount"
  | "scenario"
  | "company"
  | "export";

export default function Page() {

  const [data, setData] =
    useState<Employee[]>([]);

  const [year, setYear] =
    useState(new Date().getFullYear());

  const [page, setPage] =
    useState<AppPage>("dashboard");

  const [scenario, setScenario] =
    useState(baseScenario);

  const months = useMemo(
    () =>
      Array.from(
        { length: 12 },
        (_, i) => new Date(year, i, 1)
      ),
    [year]
  );

  const company = useMemo(
    () => buildCompany(data),
    [data]
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

  const handleExport = () => {
    exportPayroll(
      payroll,
      months,
      year
    );
  };

  return (
    <div className="app-layout">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <PageContainer>

        <Toolbar
          data={data}
          setData={setData}
          year={year}
          setYear={setYear}
          payroll={payroll}
          months={months}
          onExport={handleExport}
        />

        {page === "dashboard" && (
          <DashboardPage
            payroll={payroll}
            headcount={headcount}
          />
        )}

        {page === "payroll" && (
          <PayrollPage
            payroll={payroll}
            months={months}
          />
        )}

        {page === "headcount" && (
          <HeadcountPage
            headcount={headcount}
            months={months}
          />
        )}

        {page === "scenario" && (
          <ScenarioPage
            scenario={scenario}
            setScenario={setScenario}
          />
        )}

        {page === "company" && (
          <CompanyPage
            company={company}
          />
        )}

        {page === "export" && (
          <ExportPage />
        )}

      </PageContainer>

    </div>
  );
}