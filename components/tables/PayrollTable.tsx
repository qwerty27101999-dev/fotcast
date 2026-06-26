type Props = {
  payroll: any[];
  months: Date[];
};

export function PayrollTable({ payroll, months }: Props) {
  return (
    <div style={{ marginTop: 20, overflowX: "auto" }}>
      <table className="table">

        <thead>
          <tr>
            <th>Employee</th>

            {months.map((m, i) => (
              <th key={i}>
                {m.toLocaleString("ru", { month: "short" })}
              </th>
            ))}

            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {payroll.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>

              {p.rows.map((r: any, j: number) => (
                <td key={j}>
                  <div style={{ fontWeight: 500 }}>
                    {r.total}
                  </div>

                  <div style={{ fontSize: 10, opacity: 0.7 }}>
                    FOT: {r.fot} | INS: {r.ins}
                  </div>
                </td>
              ))}

              <td>
                {p.rows.reduce((s: number, r: any) => s + r.total, 0)}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}