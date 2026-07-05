"use client";

import { useMemo, useState } from "react";

import { Employee } from "@/lib/types";

import { formatMoney } from "@/utils/formatMoney";
import { formatDate } from "@/utils/formatDate";
import { parseExcelDate } from "@/utils/date";

interface Props {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee) => void;
}

type SortField =
  | "name"
  | "department"
  | "salary"
  | "hire_date";

export function CompanyTable({

  employees,

  selectedEmployee,

  onSelect,

}: Props) {

  const [sortField, setSortField] =
    useState<SortField>("name");

  const [ascending, setAscending] =
    useState(true);

  function changeSort(field: SortField) {

    if (field === sortField) {

      setAscending(!ascending);

      return;

    }

    setSortField(field);

    setAscending(true);

  }

  const sortedEmployees =
    useMemo(() => {

      const rows = [...employees];

      rows.sort((a, b) => {

        let result = 0;

        switch (sortField) {

          case "name":

            result =
              a.name.localeCompare(b.name);

            break;

          case "department":

            result =
              (a.department ?? "").localeCompare(
                b.department ?? ""
              );

            break;

          case "salary":

            result =
              Number(a.salary) -
              Number(b.salary);

            break;

          case "hire_date":

            result =
              (parseExcelDate(a.hire_date)?.getTime() ?? 0)

              -

              (parseExcelDate(b.hire_date)?.getTime() ?? 0);

        }

        return ascending
          ? result
          : -result;

      });

      return rows;

    }, [

      employees,

      sortField,

      ascending,

    ]);

  function Arrow(field: SortField) {

    if (field !== sortField)
      return "⇅";

    return ascending
      ? "▲"
      : "▼";

  }

  return (

    <div
      className="card"
      style={{
        marginTop: 20,
        overflow: "auto",
        maxHeight: "72vh",
      }}
    >

      <table className="table">

        <thead
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 10,
          }}
        >

          <tr>

            <th
              onClick={() =>
                changeSort("name")
              }
              style={{
                cursor: "pointer",
              }}
            >
              Name {Arrow("name")}
            </th>

            <th
              onClick={() =>
                changeSort("department")
              }
              style={{
                cursor: "pointer",
              }}
            >
              Department {Arrow("department")}
            </th>

            <th
              onClick={() =>
                changeSort("hire_date")
              }
              style={{
                cursor: "pointer",
              }}
            >
              Hire Date {Arrow("hire_date")}
            </th>

            <th>Termination</th>

            <th
              onClick={() =>
                changeSort("salary")
              }
              style={{
                cursor: "pointer",
              }}
            >
              Salary {Arrow("salary")}
            </th>

            <th>Monthly Bonus</th>

            <th>Quarterly Bonus</th>

            <th>Annual Bonus</th>

          </tr>

        </thead>

        <tbody>

          {sortedEmployees.map(

            (employee, index) => {

              const selected =
                selectedEmployee?.name ===
                employee.name;

              return (

                <tr

                  key={index}

                  onClick={() =>
                    onSelect(employee)
                  }

                  style={{

                    cursor: "pointer",

                    background:
                      selected
                        ? "#dbeafe"
                        : index % 2
                          ? "#fafafa"
                          : "#ffffff",

                    transition:
                      "background .15s",

                  }}

                  onMouseEnter={(e) => {

                    if (!selected)

                      e.currentTarget.style.background =
                        "#eef6ff";

                  }}

                  onMouseLeave={(e) => {

                    if (!selected)

                      e.currentTarget.style.background =
                        index % 2
                          ? "#fafafa"
                          : "#ffffff";

                  }}

                >

                  <td>{employee.name}</td>

                  <td>{employee.department}</td>

                  <td>{formatDate(employee.hire_date)}</td>

                  <td>{formatDate(employee.termination_date)}</td>

                  <td className="num">
                    {formatMoney(employee.salary)}
                  </td>

                  <td className="num">
                    {formatMoney(employee.monthly_bonus)}
                  </td>

                  <td className="num">
                    {formatMoney(employee.quarterly_bonus)}
                  </td>

                  <td className="num">
                    {formatMoney(employee.annual_bonus)}
                  </td>

                </tr>

              );

            }

          )}

        </tbody>

      </table>

    </div>

  );

}