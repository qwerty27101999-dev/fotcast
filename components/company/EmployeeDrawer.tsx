import { useState } from "react";

import { Employee } from "@/lib/types";

import { formatMoney } from "@/utils/formatMoney";
import { formatDate } from "@/utils/formatDate";

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
const [editing, setEditing] = useState(false);

const [draft, setDraft] = useState({
  ...employee,
});
  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 420,
        height: "100vh",
        background: "#ffffff",
        color: "#111827",
        borderLeft: "1px solid #d1d5db",
        padding: 24,
        overflowY: "auto",
        zIndex: 1000,
        boxShadow: "-8px 0 24px rgba(0,0,0,.12)",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >

        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
  }}
>
  <h2
    style={{
      margin: 0,
      color: "#111827",
    }}
  >
    {editing ? "Editing employee" : employee.name}
  </h2>
</div>

<div
  style={{
    display: "flex",
    gap: 8,
  }}
>
  {!editing ? (
    <button
      className="btn"
      onClick={() => setEditing(true)}
    >
      Edit
    </button>
  ) : (
    <>
      <button
        className="btn"
        onClick={() => {
          // позже здесь будет сохранение
          setEditing(false);
        }}
      >
        Save
      </button>

      <button
        className="btn"
        onClick={() => {
          setDraft({ ...employee });
          setEditing(false);
        }}
      >
        Cancel
      </button>
    </>
  )}

  <button
    className="btn"
    onClick={onClose}
  >
    ✕
  </button>
</div>

      </div>

      <Info
        label="Department"
        value={employee.department}
      />

      <Info
        label="Hire Date"
        value={formatDate(employee.hire_date)}
      />

      <Info
        label="Termination"
        value={formatDate(employee.termination_date)}
      />

      <Info
        label="Salary"
        value={`${formatMoney(employee.salary)} ₽`}
      />

      <Info
        label="Monthly Bonus"
        value={`${formatMoney(employee.monthly_bonus)} ₽`}
      />

      <Info
        label="Quarterly Bonus"
        value={`${formatMoney(employee.quarterly_bonus)} ₽`}
      />

      <Info
        label="Annual Bonus"
        value={`${formatMoney(employee.annual_bonus)} ₽`}
      />

    </div>

  );

}

function Info({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div
      style={{
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: "1px solid #ececec",
      }}
    >

      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: ".05em",
        }}
      >

        {label}

      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#111827",
        }}
      >

        {value}

      </div>

    </div>

  );

}