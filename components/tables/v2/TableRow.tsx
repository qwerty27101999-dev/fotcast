"use client";

import { DataColumn } from "./types";

interface Props<T> {

  row: T;

  columns: DataColumn<T>[];

  selected: boolean;

  onClick?: () => void;

}

export function TableRow<T>({

  row,

  columns,

  selected,

  onClick,

}: Props<T>) {

  return (

    <tr

      className={

        selected

          ? "company-row company-row-selected"

          : "company-row"

      }

      onClick={onClick}

      style={{

        cursor:

          onClick

            ? "pointer"

            : "default",

      }}

    >

      {columns.map(column => (

        <td

          key={String(column.id)}

          className={

            column.align === "right"

              ? "num"

              : ""

          }

          style={{

            textAlign:

              column.align ?? "left",

          }}

        >

          {column.render

            ? column.render(row)

            : String(

                (row as any)[column.id]

              )}

        </td>

      ))}

    </tr>

  );

}