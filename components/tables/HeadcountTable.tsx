type Props = {
  headcount: any[];
  months: Date[];
};

export function HeadcountTable({ headcount, months }: Props) {
  return (
    <div style={{ marginTop: 20, overflowX: "auto" }}>
      <table className="table">

        <thead>
          <tr>
            <th>Department</th>

            {months.map((m, i) => (
              <th key={i}>
                {m.toLocaleString("ru", { month: "short" })}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {headcount.map((r, i) => (
            <tr key={i}>
              <td>{r.dep}</td>

              {months.map((_, j) => (
                <td key={j}>{r[j]}</td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}