import { Employee } from "../types";

export interface CompanyMetadata {
  fileName?: string;
  importedAt: Date;
}

export interface CompanyDataset {
  metadata: CompanyMetadata;

  employees: Employee[];

  departments: string[];
}