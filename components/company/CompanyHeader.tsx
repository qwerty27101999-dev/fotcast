import { CompanyDataset } from "@/lib/company/companyTypes";

interface Props {
  company: CompanyDataset;
}

export function CompanyHeader({
  company,
}: Props) {

  return (

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

          <strong>Total employees:</strong>{" "}

          {company.employees.length}

        </p>

        <p>

          <strong>Departments:</strong>{" "}

          {company.departments.length}

        </p>

      </div>

    </div>

  );

}