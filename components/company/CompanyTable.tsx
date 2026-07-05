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

            break;

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
        padding: 0,
      }}
    >

      <table
        className="table"
        style={{
          background: "#fff",
          color: "#111827",
        }}
      >

        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "#f8fafc",
          }}
        >

          <tr>

            <th onClick={() => changeSort("name")} style={{ cursor: "pointer" }}>
              Name {Arrow("name")}
            </th>

            <th onClick={() => changeSort("department")} style={{ cursor: "pointer" }}>
              Department {Arrow("department")}
            </th>

            <th onClick={() => changeSort("hire_date")} style={{ cursor: "pointer" }}>
              Hire Date {Arrow("hire_date")}
            </th>

            <th>
              Termination
            </th>

            <th onClick={() => changeSort("salary")} style={{ cursor: "pointer" }}>
              Salary {Arrow("salary")}
            </th>

            <th>
              Monthly Bonus
            </th>

            <th>
              Quarterly Bonus
            </th>

            <th>
              Annual Bonus
            </th>

          </tr>

        </thead>

        <tbody>

          {sortedEmployees.map((employee, index) => {

            const selected =
              selectedEmployee?.name ===
              employee.name;

            return (

              <tr
  key={index}
  onClick={() => onSelect(employee)}
  className={
    selected
      ? "company-row company-row-selected"
      : "company-row"
  }
  style={{
    background:
      selected
        ? "#dbeafe"
        : index % 2
          ? "#f8fafc"
          : "#ffffff",
  }}
>

                <td style={{ color: "#111827" }}>
                  {employee.name}
                </td>

                <td style={{ color: "#111827" }}>
                  {employee.department}
                </td>

                <td style={{ color: "#111827" }}>
                  {formatDate(employee.hire_date)}
                </td>

                <td style={{ color: "#111827" }}>
                  {formatDate(employee.termination_date)}
                </td>

                <td
                  className="num"
                  style={{ color: "#111827" }}
                >
                  {formatMoney(employee.salary)}
                </td>

                <td
                  className="num"
                  style={{ color: "#111827" }}
                >
                  {formatMoney(employee.monthly_bonus)}
                </td>

                <td
                  className="num"
                  style={{ color: "#111827" }}
                >
                  {formatMoney(employee.quarterly_bonus)}
                </td>

                <td
                  className="num"
                  style={{ color: "#111827" }}
                >
                  {formatMoney(employee.annual_bonus)}
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );

}