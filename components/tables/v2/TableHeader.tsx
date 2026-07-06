"use client";

import { useState } from "react";

import { DataColumn } from "./types";
import { TableFilterMenu } from "./TableFilterMenu";


interface Props<T> {

  columns: DataColumn<T>[];

  rows: T[];

  sortField: string | null;

  sortDirection: "asc" | "desc";

  onSort: (field: string) => void;

  columnFilters: Record<string, string[]>;

  onFilterChange: (
    columnId: string,
    values: string[]
  ) => void;

  getAvailableValues: (
    field: string
  ) => string[];

}


export function TableHeader<T>({
  columns,
  rows,
  sortField,
  sortDirection,
  onSort,
  columnFilters,
  onFilterChange,
  getAvailableValues,

}: Props<T>) {


  const [openedFilter, setOpenedFilter] =
    useState<string | null>(null);


  const [filterPosition, setFilterPosition] =
    useState({
      top: 0,
      left: 0,
    });



  return (

    <thead>

      <tr>

        {columns.map(column => {


          const values =
            getAvailableValues(
              String(column.id)
            );


          const selected =
            columnFilters[String(column.id)] ??
            values;


          const filtered =
            selected.length !== values.length;



          return (

            <th

              key={String(column.id)}

              style={{

                width: column.width,

                position: "relative",

                whiteSpace: "nowrap",

              }}

            >


              <div

                style={{

                  display:"flex",

                  justifyContent:"space-between",

                  alignItems:"center",

                  gap:6,

                }}

              >


                <span

                  style={{

                    cursor:
                      column.sortable
                        ? "pointer"
                        : "default",

                  }}

                  onClick={() =>

                    column.sortable &&
                    onSort(
                      String(column.id)
                    )

                  }

                >

                  {column.title}


                  {" "}


                  {
                    sortField === String(column.id)

                      ? sortDirection === "asc"

                        ? "▲"

                        : "▼"

                      : ""

                  }


                </span>



                {column.filterable && (

                  <button

                    type="button"

                    onClick={(e) => {


                      const id =
                        String(column.id);


                      if (openedFilter === id) {

                        setOpenedFilter(null);

                        return;

                      }


                      const rect =
                        e.currentTarget
                          .getBoundingClientRect();


                      setFilterPosition({

                        top:
                          rect.bottom + 6,

                        left:
                          rect.left,

                      });


                      setOpenedFilter(id);


                    }}


                    style={{


                      border:"none",

                      background:"transparent",

                      cursor:"pointer",

                      color:

                        filtered

                          ? "#2563eb"

                          : "#6b7280",


                    }}

                  >

                    ⏷


                  </button>

                )}


              </div>



              {openedFilter === String(column.id) && (

                <TableFilterMenu

                  values={values}

                  selected={selected}

                  position={filterPosition}

                  onApply={(next) =>

                    onFilterChange(

                      String(column.id),

                      next

                    )

                  }

                  onClose={() =>

                    setOpenedFilter(null)

                  }

                />

              )}


            </th>

          );


        })}


      </tr>


    </thead>

  );

}