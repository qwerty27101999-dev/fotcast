"use client";

export function DashboardFilters({

  year,

  period,

  department,

  departments,

  setYear,

  setPeriod,

  setDepartment,

}: any) {

  return (

    <div className="dashboard-filters">

      <div>

        <label>Year</label>

        <select

          value={year}

          onChange={(e) =>
            setYear(Number(e.target.value))
          }

        >

          {[2025, 2026, 2027].map((y) => (

            <option key={y} value={y}>

              {y}

            </option>

          ))}

        </select>

      </div>

      <div>

        <label>Period</label>

        <select

          value={period}

          onChange={(e) =>
            setPeriod(e.target.value)
          }

        >

          <option value="YEAR">
            Year
          </option>

          <option value="Q1">
            Q1
          </option>

          <option value="Q2">
            Q2
          </option>

          <option value="Q3">
            Q3
          </option>

          <option value="Q4">
            Q4
          </option>

          <option value="YTD">
            YTD
          </option>

        </select>

      </div>

      <div>

        <label>Department</label>

        <select

          value={department}

          onChange={(e) =>
            setDepartment(e.target.value)
          }

        >

          <option value="ALL">
            All Departments
          </option>

          {departments.map((d: string) => (

            <option
              key={d}
              value={d}
            >
              {d}
            </option>

          ))}

        </select>

      </div>

    </div>

  );

}