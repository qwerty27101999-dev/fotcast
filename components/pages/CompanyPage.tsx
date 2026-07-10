"use client";

import { useState } from "react";

import { CompanyDataset } from "@/lib/company/companyTypes";
import { emptyEmployee } from "@/lib/company/emptyEmployee";
import { Employee } from "@/lib/types";

import { CompanyTable } from "@/components/company/CompanyTable";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { EmployeeDrawer } from "@/components/company/EmployeeDrawer";

interface Props {
  company: CompanyDataset;

  employees: Employee[];

  setEmployees: React.Dispatch<
    React.SetStateAction<Employee[]>
  >;
}

export function CompanyPage({
  company,
  employees,
  setEmployees,
}: Props) {
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [drawerMode, setDrawerMode] =
    useState<"edit" | "create">("edit");

  //
  // Сохранение сотрудника
  //

  function handleSaveEmployee(updated: Employee) {

  setEmployees(prev => {

    const exists = prev.some(
      employee => employee.id === updated.id
    );

    if (exists) {
      return prev.map(employee =>
        employee.id === updated.id
          ? updated
          : employee
      );
    }

    return [...prev, updated];

  });

  setSelectedEmployee(updated);

  //
  // если создавали нового сотрудника —
  // закрываем Drawer
  //

  if (drawerMode === "create") {

    setSelectedEmployee(null);

    setDrawerMode("edit");

  }

}
function handleDeleteEmployee(id: string) {

  if (
    !window.confirm(
      "Delete this employee?"
    )
  ) {
    return;
  }

  setEmployees(prev =>
    prev.filter(
      employee => employee.id !== id
    )
  );

  setSelectedEmployee(null);

}
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Company</h2>

        <button
          className="btn"
          onClick={() => {
            setDrawerMode("create");

            setSelectedEmployee({
              ...emptyEmployee,
              id: crypto.randomUUID(),
            });
          }}
        >
          + Employee
        </button>
      </div>

      <CompanyHeader company={company} />

      <CompanyTable
        employees={employees}
        selectedEmployee={
          selectedEmployee
        }
        onSelect={employee => {
          setDrawerMode("edit");
          setSelectedEmployee(
            employee
          );
        }}
      />

      <EmployeeDrawer

  employee={selectedEmployee}

  mode={drawerMode}

  onClose={() =>
    setSelectedEmployee(null)
  }

  onSave={handleSaveEmployee}

  onDelete={handleDeleteEmployee}

/>
    </>
  );
}