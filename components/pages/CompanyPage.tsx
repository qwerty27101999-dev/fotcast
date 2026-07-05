"use client";

import { useMemo, useState } from "react";

import { Employee } from "@/lib/types";
import { CompanyDataset } from "@/lib/company/companyTypes";

import { CompanyHeader } from "../company/CompanyHeader";
import { CompanyToolbar } from "../company/CompanyToolbar";
import { CompanyTable } from "../company/CompanyTable";
import { EmployeeDrawer } from "../company/EmployeeDrawer";

interface CompanyPageProps {

  company: CompanyDataset;

}

export function CompanyPage({

  company,

}: CompanyPageProps) {

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("All");

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const filteredEmployees =
    useMemo(() => {

      return company.employees.filter(employee => {

        const matchName =
          employee.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchDepartment =
          department === "All"
            ? true
            : employee.department === department;

        return (
          matchName &&
          matchDepartment
        );

      });

    }, [
      company,
      search,
      department,
    ]);

  return (

    <>

      <h2>Company</h2>

      <CompanyHeader
        company={company}
      />

      <CompanyToolbar

        search={search}

        setSearch={setSearch}

        department={department}

        setDepartment={setDepartment}

        departments={company.departments}

        totalEmployees={
          company.employees.length
        }

        filteredEmployees={
          filteredEmployees.length
        }

      />

      <CompanyTable

        employees={filteredEmployees}

        onSelect={setSelectedEmployee}

      />

      <EmployeeDrawer

        employee={selectedEmployee}

        onClose={() =>
          setSelectedEmployee(null)
        }

      />

    </>

  );

}