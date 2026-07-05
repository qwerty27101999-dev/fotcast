import { PayrollEmployee } from "@/lib/types";

import { formatNumber } from "@/utils/formatNumber";

interface PayrollTableProps {
  payroll: PayrollEmployee[];
  months: Date[];
}

export function PayrollTable({
  payroll,
  months,
}: PayrollTableProps) {
  return (
    <table className="table">

      <thead>

        <tr>

          <th>Name</th>

          {months.map((month) => (

            <th key={month.getMonth()}>

              {month.toLocaleString("ru", {
                month: "short",
              })}

            </th>

          ))}

          <th>Total</th>

        </tr>

      </thead>

      <tbody>

        {payroll.map((employee) => {

          const total = employee.rows.reduce(
            (sum, row) => sum + row.total,
            0
          );

          return (

            <tr key={employee.name}>

              <td>{employee.name}</td>

              {employee.rows.map((row, index) => (

                <td
                  key={index}
                  className="num"
                >
                  {formatNumber(row.total)}
                </td>

              ))}

              <td className="num">

                {formatNumber(total)}

              </td>

            </tr>

          );

        })}

      </tbody>

    </table>
  );
}