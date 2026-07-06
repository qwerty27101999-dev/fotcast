"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {

  values: string[];

  selected: string[];

  onApply: (values: string[]) => void;

  onClose: () => void;

}

export function TableFilterMenu({

  values,

  selected,

  onApply,

  onClose,

}: Props) {

  const [search, setSearch] = useState("");

  const [localSelection, setLocalSelection] =

    useState<string[]>(selected);

  useEffect(() => {

    setLocalSelection(selected);

  }, [selected]);

  const filteredValues = useMemo(() => {

    if (!search.trim()) {

      return values;

    }

    const q = search.toLowerCase();

    return values.filter(v =>

      v.toLowerCase().includes(q)

    );

  }, [values, search]);

  function toggle(value: string) {

    if (localSelection.includes(value)) {

      setLocalSelection(

        localSelection.filter(

          v => v !== value

        )

      );

    } else {

      setLocalSelection([

        ...localSelection,

        value,

      ]);

    }

  }

  return (

    <div

      style={{

        position: "absolute",
        

        top: "100%",

        left: 0,

        width: 260,

        background: "#fff",

        border: "1px solid #d1d5db",

        borderRadius: 10,

        boxShadow:

          "0 8px 24px rgba(0,0,0,.15)",

        padding: 12,

        zIndex: 9999,

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

        }}

      />

      <div

        style={{

          maxHeight: 260,

          overflowY: "auto",

        }}

      >

        {filteredValues.map(value => (

          <label

            key={value}

            style={{

              display: "flex",

              gap: 8,

              padding: 4,

            }}

          >

            <input

              type="checkbox"

              checked={

                localSelection.includes(

                  value

                )

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