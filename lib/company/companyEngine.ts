import { Employee } from "../types";
import { CompanyDataset } from "./companyTypes";

export function buildCompany(
  employees: Employee[],
  fileName?: string
): CompanyDataset {

  const departments = Array.from(
    new Set(
      employees.map(
        employee => employee.department || "—"
      )
    )
  ).sort();

  return {
    metadata: {
      fileName,
      importedAt: new Date(),
    },

    employees,
    departments,
  };
}