"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {

  values: string[];

  selected: string[];

  onApply: (values: string[]) => void;

  onClose: () => void;

  position?: {
    top: number;
    left: number;
  };

}

export function TableFilterMenu({

  values,

  selected,

  onApply,

  onClose,

  position,

}: Props) {


  const [search, setSearch] =
    useState("");


  const [localSelection, setLocalSelection] =
    useState<string[]>(selected);


  useEffect(() => {

    setLocalSelection(selected);

  }, [selected]);


  const filteredValues = useMemo(() => {

    if (!search.trim()) {

      return values;

    }

    const q =
      search.toLowerCase();


    return values.filter(value =>
      value.toLowerCase().includes(q)
    );


  }, [values, search]);


  function toggle(value:string) {

    setLocalSelection(prev => {

      if (prev.includes(value)) {

        return prev.filter(
          item => item !== value
        );

      }


      return [
        ...prev,
        value
      ];

    });

  }


  function selectAll() {

    setLocalSelection(values);

  }


  function clearAll() {

    setLocalSelection([]);

  }


  return (

    <div

      style={{

        position: "fixed",

        top: position?.top ?? 0,

        left: position?.left ?? 0,

        width: 260,

        background:"#ffffff",

        border:"1px solid #d1d5db",

        borderRadius:10,

        boxShadow:
          "0 8px 24px rgba(0,0,0,.15)",

        padding:12,

        zIndex:9999,

      }}

    >


      <input

        value={search}

        onChange={e =>
          setSearch(e.target.value)
        }

        placeholder="Search..."

        style={{

          width:"100%",

          padding:8,

          marginBottom:10,

        }}

      />


      <div
        style={{
          display:"flex",
          gap:8,
          marginBottom:10,
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

          maxHeight:260,

          overflowY:"auto",

        }}

      >

        {filteredValues.map(value => (

          <label

            key={value}

            style={{

              display:"flex",

              gap:8,

              padding:"4px 0",

            }}

          >

            <input

              type="checkbox"

              checked={
                localSelection.includes(value)
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

          display:"flex",

          justifyContent:"flex-end",

          gap:8,

          marginTop:12,

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