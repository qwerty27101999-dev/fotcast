import { PayrollEmployee } from "@/lib/types";

import { PayrollTable } from "../tables/PayrollTable";

interface PayrollPageProps {
  payroll: PayrollEmployee[];
  months: Date[];
}

export function PayrollPage({
  payroll,
  months,
}: PayrollPageProps) {
  return (
    <>
      <h2>Payroll</h2>

      <PayrollTable
        payroll={payroll}
        months={months}
      />
    </>
  );
}