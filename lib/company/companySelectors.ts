import { CompanyDataset } from "./companyTypes";
import { Employee } from "../types";

export function getEmployees(
  company: CompanyDataset | null
): Employee[] {

  return company?.employees ?? [];

}

export function getDepartments(
  company: CompanyDataset | null
): string[] {

  return company?.departments ?? [];

}

export function getEmployeeCount(
  company: CompanyDataset | null
): number {

  return company?.employees.length ?? 0;

}