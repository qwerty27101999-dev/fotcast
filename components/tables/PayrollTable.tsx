export function PayrollTable({ payroll, months }: any) {
  return (
    <table className="table">

      <thead>
        <tr>
          <th>Name</th>

          {months.map((m: any, i: number) => (
            <th key={i}>
              {m.toLocaleString("ru", { month: "short" })}
            </th>
          ))}

          <th>Total</th>
        </tr>
      </thead>

      <tbody>

        {payroll.map((p: any, i: number) => (
          <tr key={i}>
            <td>{p.name}</td>

            {p.rows.map((r: any, j: number) => (
              <td key={j}>
                {r.total}
              </td>
            ))}

            <td>
              {p.rows.reduce((s: number, r: any) => s + r.total, 0)}
            </td>
          </tr>
        ))}

      </tbody>

    </table>
  );
}