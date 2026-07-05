import { CompanyDataset } from "@/lib/company/companyTypes";

interface CompanySummaryProps {
  company: CompanyDataset | null;
}

export function CompanySummary({
  company,
}: CompanySummaryProps) {

  const employeeCount =
    company?.employees.length ?? 0;

  const departmentCount =
    company?.departments.length ?? 0;

  const importedAt =
    company?.metadata.importedAt;

  return (

    <div className="card">

      <div className="card-title">
        Company Dataset
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >

        <div>

          <div
            style={{
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            Employees
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {employeeCount}
          </div>

        </div>

        <div>

          <div
            style={{
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            Departments
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {departmentCount}
          </div>

        </div>

        <div>

          <div
            style={{
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            Imported
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {importedAt
              ? importedAt.toLocaleString()
              : "—"}
          </div>

        </div>

      </div>

    </div>

  );

}