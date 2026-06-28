import { PayrollTable } from "../tables/PayrollTable";

export function PayrollPage({
  payroll,
  months,
}: any) {

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