import { CompanyDataset } from "@/lib/company/companyTypes";
import { parseExcelDate } from "@/utils/date";

interface CompanyPageProps {
  company: CompanyDataset;
}

function formatDate(value: any) {
  const date = parseExcelDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleDateString("ru-RU");
}

export function CompanyPage({
  company,
}: CompanyPageProps) {

  return (

    <>

      <h2>Company</h2>

      <div className="card">

        <div className="card-title">

          Company Summary

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            rowGap: 10,
            columnGap: 30,
            marginTop: 20,
            marginBottom: 30,
          }}
        >

          <strong>Employees</strong>
          <span>{company.employees.length}</span>

          <strong>Departments</strong>
          <span>{company.departments.length}</span>

          <strong>Imported</strong>
          <span>
            {company.metadata.importedAt.toLocaleString()}
          </span>

          <strong>Source file</strong>
          <span>
            {company.metadata.fileName ?? "Unknown"}
          </span>

        </div>

      </div>

      <div
        className="card"
        style={{ marginTop: 20 }}
      >

        <div className="card-title">

          Employees

        </div>

        <table className="table">

          <thead>

            <tr>

              <th>Name</th>

              <th>Department</th>

              <th>Hire</th>

              <th>Termination</th>

              <th>Salary</th>

              <th>Monthly Bonus</th>

              <th>Quarterly Bonus</th>

              <th>Annual Bonus</th>

            </tr>

          </thead>

          <tbody>

            {company.employees.map((employee, index) => (

              <tr key={index}>

                <td>{employee.name}</td>

                <td>{employee.department}</td>

                <td>
                  {formatDate(employee.hire_date)}
                </td>

                <td>
                  {formatDate(employee.termination_date)}
                </td>

                <td>{employee.salary}</td>

                <td>{employee.monthly_bonus}</td>

                <td>{employee.quarterly_bonus}</td>

                <td>{employee.annual_bonus}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>

  );

}