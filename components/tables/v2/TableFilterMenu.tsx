"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {

  values: string[];

  selected: Set<string>;

  onApply: (values: Set<string>) => void;

  onClose: () => void;

}

export function TableFilterMenu({

  values,

  selected,

  onApply,

  onClose,

}: Props) {

  const [search, setSearch] = useState("");

  const [localSelection, setLocalSelection] = useState(
    new Set(selected)
  );

  useEffect(() => {

    setLocalSelection(new Set(selected));

  }, [selected]);

  const filteredValues = useMemo(() => {

    if (!search.trim()) return values;

    const q = search.toLowerCase();

    return values.filter(value =>
      value.toLowerCase().includes(q)
    );

  }, [values, search]);

  function toggle(value: string) {

    const next = new Set(localSelection);

    if (next.has(value)) {

      next.delete(value);

    } else {

      next.add(value);

    }

    setLocalSelection(next);

  }

  function selectAll() {

    setLocalSelection(new Set(values));

  }

  function clearAll() {

    setLocalSelection(new Set());

  }

  return (

    <div

      style={{

        position: "absolute",

        top: "100%",

        left: 0,

        width: 260,

        background: "#ffffff",

        border: "1px solid #d1d5db",

        borderRadius: 10,

        boxShadow:

          "0 8px 24px rgba(0,0,0,.15)",

        padding: 12,

        zIndex: 100,

      }}

    >

      <input

        value={search}

        onChange={e =>
          setSearch(e.target.value)
        }

        placeholder="Search..."

        style={{

          width: "100%",

          padding: 8,

          marginBottom: 10,

          borderRadius: 6,

          border: "1px solid #d1d5db",

        }}

      />

      <div

        style={{

          display: "flex",

          gap: 8,

          marginBottom: 10,

        }}

      >

        <button

          className="btn"

          onClick={selectAll}

        >

          All

        </button>

        <button

          className="btn"

          onClick={clearAll}

        >

          None

        </button>

      </div>

      <div

        style={{

          maxHeight: 260,

          overflowY: "auto",

          border:

            "1px solid #e5e7eb",

          borderRadius: 6,

          padding: 6,

        }}

      >

        {filteredValues.map(value => (

          <label

            key={value}

            style={{

              display: "flex",

              gap: 8,

              padding: "4px 0",

              cursor: "pointer",

            }}

          >

            <input

              type="checkbox"

              checked={
                localSelection.has(value)
              }

              onChange={() =>
                toggle(value)
              }

            />

            {value}

          </label>

        ))}

      </div>

      <div

        style={{

          display: "flex",

          justifyContent: "flex-end",

          gap: 8,

          marginTop: 12,

        }}

      >

        <button

          className="btn"

          onClick={onClose}

        >

          Cancel

        </button>

        <button

          className="btn"

          onClick={() => {

            onApply(localSelection);

            onClose();

          }}

        >

          Apply

        </button>

      </div>

    </div>

  );

}