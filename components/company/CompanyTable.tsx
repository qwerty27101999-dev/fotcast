"use client";

import { Employee } from "@/lib/types";

import { DataTable } from "@/components/tables/v2/DataTable";
import { DataColumn } from "@/components/tables/v2/types";

import { formatMoney } from "@/utils/formatMoney";
import { formatDate } from "@/utils/formatDate";

interface Props {

  employees: Employee[];

  selectedEmployee: Employee | null;

  onSelect: (employee: Employee) => void;

}

export const companyColumns: DataColumn<Employee>[] = [

  {

    id: "name",

    title: "Name",

    sortable: true,
    filterable: true,

    render: employee => employee.name,

  },

  {

    id: "department",

    title: "Department",

    sortable: true,
    filterable: true,

    render: employee => employee.department,

  },

  {

    id: "hire_date",

    title: "Hire Date",

    sortable: true,
    filterable: true,

    render: employee => formatDate(employee.hire_date),
    formatFilterValue: value => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return formatDate(
      new Date((value - 25569) * 86400 * 1000)
    );
  }

  return formatDate(
    new Date(String(value))
  );
},
  },

  {

    id: "termination_date",

    title: "Termination",

    sortable: true,
    filterable: true,

    render: employee => formatDate(employee.termination_date),
    formatFilterValue: value => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return formatDate(
      new Date((value - 25569) * 86400 * 1000)
    );
  }

  return formatDate(
    new Date(String(value))
  );
},
  },

  {

    id: "salary",

    title: "Salary",

    sortable: true,
    filterable: true,

    align: "right",

    render: employee => formatMoney(employee.salary),
    formatFilterValue: value =>
    formatMoney(Number(value)),
  },

  {

    id: "monthly_bonus",

    title: "Monthly Bonus",

    sortable: true,
    filterable: true,

    align: "right",

    render: employee =>

      formatMoney(employee.monthly_bonus),
    formatFilterValue: value =>
    formatMoney(Number(value)),
  },

  {

    id: "quarterly_bonus",

    title: "Quarterly Bonus",

    sortable: true,
    filterable: true,

    align: "right",

    render: employee =>

      formatMoney(employee.quarterly_bonus),
    formatFilterValue: value =>
    formatMoney(Number(value)),
  },

  {

    id: "annual_bonus",

    title: "Annual Bonus",

    sortable: true,
    filterable: true,

    align: "right",

    render: employee =>

      formatMoney(employee.annual_bonus),
      formatFilterValue: value =>
    formatMoney(Number(value)),
  },

];

export function CompanyTable({

  employees,

  selectedEmployee,

  onSelect,

}: Props) {

  return (

    <DataTable

      rows={employees}

      columns={companyColumns}

      selectedRow={selectedEmployee}

      onRowClick={onSelect}

      getRowKey={(employee) => employee.name}

    />

  );

}