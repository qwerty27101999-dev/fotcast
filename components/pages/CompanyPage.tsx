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

          Company Summary

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            rowGap: 10,
            columnGap: 30,
            marginTop: 20,
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

    </>

  );

}