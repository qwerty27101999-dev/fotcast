import { CompanyDataset } from "@/lib/company/companyTypes";

interface CompanyPageProps {
  company: CompanyDataset;
}

export function CompanyPage({
  company,
}: CompanyPageProps) {

  return (

    <>

      <h2>Company</h2>

      <div className="card">

        <div className="card-title">

          Company Information

        </div>

        <div style={{ marginBottom: 24 }}>

          <p>

            <strong>Source file:</strong>{" "}

            {company.metadata.fileName ?? "Unknown"}

          </p>

          <p>

            <strong>Imported:</strong>{" "}

            {company.metadata.importedAt.toLocaleString()}

          </p>

          <p>

            <strong>Employees:</strong>{" "}

            {company.employees.length}

          </p>

          <p>

            <strong>Departments:</strong>{" "}

            {company.departments.length}

          </p>

        </div>

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

            {company.employees.map((employee, index) => (

              <tr key={index}>

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

    </>

  );

}