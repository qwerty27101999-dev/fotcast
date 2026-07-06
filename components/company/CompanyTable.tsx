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

    render: employee => employee.name,

  },

  {

    id: "department",

    title: "Department",

    sortable: true,

    render: employee => employee.department,

  },

  {

    id: "hire_date",

    title: "Hire Date",

    sortable: true,

    render: employee => formatDate(employee.hire_date),

  },

  {

    id: "termination_date",

    title: "Termination",

    sortable: true,

    render: employee => formatDate(employee.termination_date),

  },

  {

    id: "salary",

    title: "Salary",

    sortable: true,

    align: "right",

    render: employee => formatMoney(employee.salary),

  },

  {

    id: "monthly_bonus",

    title: "Monthly Bonus",

    sortable: true,

    align: "right",

    render: employee =>

      formatMoney(employee.monthly_bonus),

  },

  {

    id: "quarterly_bonus",

    title: "Quarterly Bonus",

    sortable: true,

    align: "right",

    render: employee =>

      formatMoney(employee.quarterly_bonus),

  },

  {

    id: "annual_bonus",

    title: "Annual Bonus",

    sortable: true,

    align: "right",

    render: employee =>

      formatMoney(employee.annual_bonus),

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