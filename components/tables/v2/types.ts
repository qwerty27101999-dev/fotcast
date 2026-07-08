import { ReactNode } from "react";

export type Align = "left" | "center" | "right";

export interface DataColumn<T> {
  id: keyof T | string;

  title: string;

  width?: number;

  align?: Align;

  sortable?: boolean;

  filterable?: boolean;

  render?: (row: T) => ReactNode;

  getValue?: (row: T) => unknown;
}

export interface SortState {

  field: string;

  direction: "asc" | "desc";

}
