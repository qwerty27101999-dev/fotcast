"use client";

import { useState } from "react";

import { CompanyDataset } from "@/lib/company/companyTypes";
import { Employee } from "@/lib/types";

import { companyColumns, CompanyTable } from "@/components/company/CompanyTable";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { EmployeeDrawer } from "@/components/company/EmployeeDrawer";

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

  return (

    <>

      <h2>

        Company

      </h2>

      <CompanyHeader

        company={company}

      />

      <CompanyTable

        employees={company.employees}

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