"use client";

import { Employee } from "@/lib/types";

import { DataTable } from "@/components/tables/DataTable";

import { Column } from "@/lib/table/tableTypes";

import { formatMoney } from "@/utils/formatMoney";
import { formatDate } from "@/utils/formatDate";

interface Props {

  employees: Employee[];

  selectedEmployee: Employee | null;

  onSelect: (employee: Employee) => void;

}

export const companyColumns: Column<Employee>[] = [

  {

    id: "name",

    title: "Name",

    sortable: true,

    searchable: true,

  },

  {

    id: "department",

    title: "Department",

    sortable: true,

    searchable: true,

  },

  {

    id: "hire_date",

    title: "Hire Date",

    sortable: true,

    render: (row) => formatDate(row.hire_date),

  },

  {

    id: "termination_date",

    title: "Termination",

    sortable: true,

    render: (row) => formatDate(row.termination_date),

  },

  {

    id: "salary",

    title: "Salary",

    sortable: true,

    numeric: true,

    render: (row) => formatMoney(row.salary),

  },

  {

    id: "monthly_bonus",

    title: "Monthly Bonus",

    sortable: true,

    numeric: true,

    render: (row) => formatMoney(row.monthly_bonus),

  },

  {

    id: "quarterly_bonus",

    title: "Quarterly Bonus",

    sortable: true,

    numeric: true,

    render: (row) => formatMoney(row.quarterly_bonus),

  },

  {

    id: "annual_bonus",

    title: "Annual Bonus",

    sortable: true,

    numeric: true,

    render: (row) => formatMoney(row.annual_bonus),

  },

];

export function CompanyTable({

  employees,

  selectedEmployee,

  onSelect,

}: Props) {

  return (

    <DataTable

      columns={companyColumns}

      rows={employees}

      selectedRow={selectedEmployee}

      onRowClick={onSelect}

    />

  );

}