import { Employee } from "@/lib/types";

interface Props {

  employees: Employee[];

  onSelect: (employee: Employee) => void;

}

export function CompanyTable({

  employees,

  onSelect,

}: Props) {

  return (

    <div
      className="card"
      style={{ marginTop: 20 }}
    >

      <table className="table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Department</th>

            <th>Hire Date</th>

            <th>Termination</th>

            <th>Salary</th>

            <th>Monthly Bonus</th>

            <th>Quarterly Bonus</th>

            <th>Annual Bonus</th>

          </tr>

        </thead>

        <tbody>

          {employees.map((employee, index) => (

            <tr
              key={index}
              style={{
                cursor: "pointer",
              }}
              onClick={() =>
                onSelect(employee)
              }
            >

              <td>{employee.name}</td>

              <td>{employee.department}</td>

              <td>{String(employee.hire_date ?? "")}</td>

              <td>{String(employee.termination_date ?? "")}</td>

              <td>{employee.salary}</td>

              <td>{employee.monthly_bonus}</td>

              <td>{employee.quarterly_bonus}</td>

              <td>{employee.annual_bonus}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}