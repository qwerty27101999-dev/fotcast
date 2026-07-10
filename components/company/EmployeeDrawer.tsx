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
  value={draft.department}
  editing={editing}
  onChange={(value) =>
    setDraft({
      ...draft,
      department: value,
    })
  }
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

interface InfoProps {
  label: string;

  value: string;

  editing?: boolean;

  onChange?: (value: string) => void;

  type?: "text" | "number" | "date";
}

function Info({
  label,
  value,
  editing = false,
  onChange,
  type = "text",
}: InfoProps) {
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

      {editing ? (
        <input
  type={
    type === "number"
      ? "number"
      : type === "date"
      ? "date"
      : "text"
  }
  value={value}
  onChange={(e) =>
    onChange?.(e.target.value)
  }
  style={{
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 15,
  }}
/>
      ) : (
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}