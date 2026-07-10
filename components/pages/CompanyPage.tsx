"use client";

import { useState } from "react";

import { CompanyDataset } from "@/lib/company/companyTypes";
import { Employee } from "@/lib/types";

import {
  companyColumns,
  CompanyTable,
} from "@/components/company/CompanyTable";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { EmployeeDrawer } from "@/components/company/EmployeeDrawer";

interface Props {

  company: CompanyDataset;

  onEmployeesChange: (
    employees: Employee[]
  ) => void;

}

export function CompanyPage({
  company,
}: Props) {
  //
  // Теперь CompanyPage владеет данными
  //

  const [employees, setEmployees] = useState(
    company.employees
  );

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<Employee | null>(null);

  //
  // Сохранение изменений сотрудника
  //

  function handleSaveEmployee(
    updated: Employee
  ) {
    setEmployees(prev =>
      prev.map(employee =>
        employee.name === updated.name
          ? updated
          : employee
      )
    );

    setSelectedEmployee(updated);
  }

  return (
    <>
      <h2>Company</h2>

      <CompanyHeader company={company} />

      <CompanyTable
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelect={setSelectedEmployee}
      />

      <EmployeeDrawer
        employee={selectedEmployee}
        onClose={() =>
          setSelectedEmployee(null)
        }
        onSave={handleSaveEmployee}
      />
    </>
  );
}