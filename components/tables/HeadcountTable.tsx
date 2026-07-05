import { HeadcountRow } from "@/lib/headcountEngine";

interface HeadcountTableProps {
  headcount: HeadcountRow[];
  months: Date[];
}

export function HeadcountTable({
  headcount,
  months,
}: HeadcountTableProps) {
  return (
    <table className="table">

      <thead>

        <tr>

          <th>Department</th>

          {months.map((month) => (

            <th key={month.getMonth()}>

              {month.toLocaleString("ru", {
                month: "short",
              })}

            </th>

          ))}

        </tr>

      </thead>

      <tbody>

        {headcount.map((department) => (

          <tr key={department.dep}>

            <td>{department.dep}</td>

            {months.map((_, monthIndex) => (

              <td key={monthIndex}>

                {department[monthIndex]}

              </td>

            ))}

          </tr>

        ))}

      </tbody>

    </table>
  );
}