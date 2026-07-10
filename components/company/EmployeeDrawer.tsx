import { useEffect, useState } from "react";

import { Employee } from "@/lib/types";

import { formatMoney } from "@/utils/formatMoney";
import { formatDate } from "@/utils/formatDate";

interface Props {
  employee: Employee | null;

  mode: "edit" | "create";

  onClose: () => void;

  onSave: (employee: Employee) => void;
}

export function EmployeeDrawer({

  employee,

  mode,

  onClose,

  onSave,

}: Props) {

const [editing, setEditing] = useState(false);

const [draft, setDraft] = useState<Employee | null>(null);

useEffect(() => {
  if (employee) {
    setDraft({ ...employee });
  }
}, [employee]);

if (!employee || !draft) {
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
    <h2
  style={{
    margin: 0,
    color: "#111827",
  }}
>
  {mode === "create"
    ? "New employee"
    : editing
    ? "Editing employee"
    : employee.name}
</h2>
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

  onSave(draft);

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
<SectionTitle>
  👤 General
</SectionTitle>      
<Info
  label="Name"
  value={draft.name}
  editing={editing}
  onChange={(value) =>
    setDraft({
      ...draft,
      name: value,
    })
  }
/>
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
  value={
    editing
      ? String(draft.hire_date ?? "")
      : formatDate(draft.hire_date)
  }
  editing={editing}
  type="date"
  onChange={(value) =>
    setDraft({
      ...draft,
      hire_date: value,
    })
  }
/>

      <Info
  label="Termination"
  value={
  editing
    ? String(draft.termination_date ?? "")
    : formatDate(draft.termination_date)
}
  editing={editing}
  type="date"
  onChange={(value) =>
    setDraft({
      ...draft,
      termination_date: value,
    })
  }
/>
<SectionTitle>
  💰 Compensation
</SectionTitle>
      <Info
  label="Salary"
  value={
    editing
      ? String(draft.salary)
      : formatMoney(Number(draft.salary))
  }
  editing={editing}
  type="number"
  onChange={(value) =>
    setDraft({
      ...draft,
      salary: Number(value),
    })
  }
/>

      <Info
  label="Monthly Bonus"
  value={
    editing
      ? String(draft.monthly_bonus ?? 0)
      : formatMoney(Number(draft.monthly_bonus ?? 0))
  }
  editing={editing}
  type="number"
  onChange={(value) =>
    setDraft({
      ...draft,
      monthly_bonus: Number(value),
    })
  }
/>

      <Info
  label="Quarterly Bonus"
  value={
    editing
      ? String(draft.quarterly_bonus ?? 0)
      : formatMoney(Number(draft.quarterly_bonus ?? 0))
  }
  editing={editing}
  type="number"
  onChange={(value) =>
    setDraft({
      ...draft,
      quarterly_bonus: Number(value),
    })
  }
/>

      <Info
  label="Annual Bonus"
  value={
    editing
      ? String(draft.annual_bonus ?? 0)
      : formatMoney(Number(draft.annual_bonus ?? 0))
  }
  editing={editing}
  type="number"
  onChange={(value) =>
    setDraft({
      ...draft,
      annual_bonus: Number(value),
    })
  }
/>
<SectionTitle>
  📈 Future revisions
</SectionTitle>

<div
  style={{
    color: "#9ca3af",
    fontSize: 14,
    padding: "8px 0",
  }}
>
  No revisions yet
</div>
    </div>

  );

}
function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 28,
        marginBottom: 18,
        paddingBottom: 8,
        borderBottom: "2px solid #e5e7eb",
        fontSize: 15,
        fontWeight: 700,
        color: "#374151",
      }}
    >
      {children}
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