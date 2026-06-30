interface Props {

  year: number;

  setYear: (year: number) => void;

  view: "monthly" | "quarterly" | "yearly";

  setView: (
    view: "monthly" | "quarterly" | "yearly"
  ) => void;

}

export function FilterBar({

  year,

  setYear,

  view,

  setView,

}: Props) {

  return (

    <div className="dashboard-filter">

      <div>

        <label>Year</label>

        <select
          value={year}
          onChange={(e)=>
            setYear(Number(e.target.value))
          }
        >

          {[2024,2025,2026,2027,2028].map(y=>

            <option key={y} value={y}>
              {y}
            </option>

          )}

        </select>

      </div>

      <div>

        <label>Aggregation</label>

        <select
          value={view}
          onChange={(e)=>

            setView(
              e.target.value as
              "monthly"|
              "quarterly"|
              "yearly"
            )

          }
        >

          <option value="monthly">
            Monthly
          </option>

          <option value="quarterly">
            Quarterly
          </option>

          <option value="yearly">
            Yearly
          </option>

        </select>

      </div>

    </div>

  );

}