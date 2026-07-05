import { Employee } from "@/lib/types";

interface Props {

  employee: Employee | null;

  onClose: () => void;

}

export function EmployeeDrawer({

  employee,

  onClose,

}: Props) {

  if (!employee) {
    return null;
  }

  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 420,
        height: "100vh",
        background: "#fff",
        borderLeft: "1px solid #ddd",
        padding: 24,
        overflowY: "auto",
        zIndex: 1000,
        boxShadow: "-6px 0 20px rgba(0,0,0,.08)",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >

        <h2 style={{ margin: 0 }}>
          Employee
        </h2>

        <button
          className="btn"
          onClick={onClose}
        >
          ✕
        </button>

      </div>

      <Info
        label="Name"
        value={employee.name}
      />

      <Info
        label="Department"
        value={employee.department}
      />

      <Info
        label="Hire Date"
        value={String(employee.hire_date ?? "")}
      />

      <Info
        label="Termination"
        value={String(employee.termination_date ?? "")}
      />

      <Info
        label="Salary"
        value={employee.salary}
      />

      <Info
        label="Monthly Bonus"
        value={employee.monthly_bonus}
      />

      <Info
        label="Quarterly Bonus"
        value={employee.quarterly_bonus}
      />

      <Info
        label="Annual Bonus"
        value={employee.annual_bonus}
      />

    </div>

  );

}

function Info({

  label,

  value,

}: {

  label: string;

  value: any;

}) {

  return (

    <div
      style={{
        marginBottom: 18,
      }}
    >

      <div
        style={{
          fontSize: 13,
          color: "#666",
        }}
      >

        {label}

      </div>

      <div
        style={{
          marginTop: 4,
          fontWeight: 600,
        }}
      >

        {String(value ?? "")}

      </div>

    </div>

  );

}