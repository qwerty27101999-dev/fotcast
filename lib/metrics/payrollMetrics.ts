import { PayrollEmployee } from "../types";

export function getTotalCost(payroll: PayrollEmployee[]) {
  return payroll.reduce(
    (sum, employee) =>
      sum +
      employee.rows.reduce(
        (s, row) => s + row.total,
        0
      ),
    0
  );
}

export function getTotalFOT(payroll: PayrollEmployee[]) {
  return payroll.reduce(
    (sum, employee) =>
      sum +
      employee.rows.reduce(
        (s, row) => s + row.fot,
        0
      ),
    0
  );
}

export function getTotalInsurance(payroll: PayrollEmployee[]) {
  return payroll.reduce(
    (sum, employee) =>
      sum +
      employee.rows.reduce(
        (s, row) => s + row.insurance.total,
        0
      ),
    0
  );
}