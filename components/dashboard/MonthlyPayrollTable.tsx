import { formatNumber } from "@/utils/formatNumber";
import { PayrollEmployee } from "@/lib/types";

interface Props {
  payroll: PayrollEmployee[];
  months: Date[];
}

export function MonthlyPayrollTable({
  payroll,
  months,
}: Props) {

  const monthly = months.map((_, month) => {

    let payrollTotal = 0;
    let insuranceTotal = 0;
    let totalCost = 0;

    payroll.forEach(employee => {

      payrollTotal += employee.rows[month].fot;

      insuranceTotal +=
        employee.rows[month].insurance.total;

      totalCost +=
        employee.rows[month].total;

    });

    return {

      payroll: payrollTotal,

      insurance: insuranceTotal,

      total: totalCost,

    };

  });

  return (

    <div className="card">

      <div className="card-title">
        Monthly Cost
      </div>

      <table className="table">

        <thead>

          <tr>

            <th>Month</th>

            <th>Payroll</th>

            <th>Insurance</th>

            <th>Total</th>

          </tr>

        </thead>

        <tbody>

          {months.map((m, i) => (

            <tr key={i}>

              <td>
                {m.toLocaleString("en", {
                  month: "short",
                })}
              </td>

              <td className="num">
                {formatNumber(monthly[i].payroll)}
              </td>

              <td className="num">
                {formatNumber(monthly[i].insurance)}
              </td>

              <td className="num">
                {formatNumber(monthly[i].total)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}