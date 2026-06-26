export interface Employee {
  name: string;
  department: string;

  hire_date: any;
  termination_date: any;

  salary: number | string;

  monthly_bonus?: number | string;
  quarterly_bonus?: number | string;
  annual_bonus?: number | string;
}

export interface InsuranceResult {
  ops: number;
  oms: number;
  vnim: number;
  nsipz: number;
  total: number;
}

export interface PayrollRow {
  fot: number;

  fixedPay: number;

  monthlyBonus: number;
  quarterlyBonus: number;
  annualBonus: number;

  insurance: InsuranceResult;

  total: number;
}

export interface PayrollEmployee {
  name: string;
  department: string;
  rows: PayrollRow[];
}