interface Props {

  search: string;

  setSearch: (value: string) => void;

  department: string;

  setDepartment: (value: string) => void;

  departments: string[];

  totalEmployees: number;

  filteredEmployees: number;

}

export function CompanyToolbar({

  search,

  setSearch,

  department,

  setDepartment,

  departments,

  totalEmployees,

  filteredEmployees,

}: Props) {

  return (

    <div
      className="card"
      style={{ marginTop: 20 }}
    >

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >

        <input

          className="input"

          placeholder="Search employee..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

        />

        <select

          className="input"

          value={department}

          onChange={(e) =>
            setDepartment(
              e.target.value
            )
          }

        >

          <option>All</option>

          {departments.map(dep => (

            <option
              key={dep}
              value={dep}
            >
              {dep}
            </option>

          ))}

        </select>

        <div
          style={{
            marginLeft: "auto",
            fontWeight: 600,
          }}
        >

          Showing{" "}

          {filteredEmployees}

          {" / "}

          {totalEmployees}

        </div>

      </div>

    </div>

  );

}