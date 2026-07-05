"use client";

import { useState } from "react";

import { CompanyDataset } from "@/lib/company/companyTypes";
import { Employee } from "@/lib/types";

import { useTable } from "@/lib/table/useTable";

import { companyColumns, CompanyTable } from "@/components/company/CompanyTable";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { EmployeeDrawer } from "@/components/company/EmployeeDrawer";

import { TableFilters } from "@/components/tables/TableFilters";

interface Props {

  company: CompanyDataset;

}

export function CompanyPage({

  company,

}: Props) {

  const [

    selectedEmployee,

    setSelectedEmployee,

  ] = useState<Employee | null>(null);

  const table = useTable(

    company.employees,

    companyColumns

  );

  return (

    <>

      <h2>

        Company

      </h2>

      <CompanyHeader

        company={company}

      />

      

      <TableFilters

        search={table.search}

        onSearchChange={table.setSearch}

        sortField={table.sortField}

        onSortFieldChange={table.setSortField}

        ascending={table.ascending}

        onAscendingChange={table.setAscending}

        sortOptions={companyColumns

          .filter(c => c.sortable)

          .map(c => ({

            value: String(c.id),

            label: c.title,

          }))}

      />

      <CompanyTable

        employees={table.rows}

        selectedEmployee={selectedEmployee}

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