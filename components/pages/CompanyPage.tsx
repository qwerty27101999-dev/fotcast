import { CompanySummary } from "../company/CompanySummary";
import { CompanyDataset } from "@/lib/company/companyTypes";

interface CompanyPageProps {
  company: CompanyDataset | null;
}

export function CompanyPage({
  company,
}: CompanyPageProps) {

  return (

    <>

      <h2>Company Data</h2>

      <CompanySummary
        company={company}
      />

      <div
        className="card"
        style={{
          marginTop: 20,
        }}
      >

        <div className="card-title">
          Employees
        </div>

        <p>
          Employee table will appear here.
        </p>

      </div>

    </>

  );

}