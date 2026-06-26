export function HeadcountTable({ headcount, months }: any) {
  return (
    <table className="table">

      <thead>
        <tr>
          <th>Department</th>

          {months.map((m: Date, i: number) => (
            <th key={i}>
              {m.toLocaleString("ru", { month: "short" })}
            </th>
          ))}

        </tr>
      </thead>

      <tbody>

        {headcount.map((r: any, i: number) => (
          <tr key={i}>
            <td>{r.dep}</td>

            {months.map((_: Date, j: number) => (
              <td key={j}>{r[j]}</td>
            ))}

          </tr>
        ))}

      </tbody>

    </table>
  );
}