export interface Column<T> {

  id: keyof T | string;

  title: string;

  sortable?: boolean;

  searchable?: boolean;

  numeric?: boolean;

  width?: number;

  render?: (row: T) => React.ReactNode;

}

export interface TableState {

  search: string;

  sortBy: string;

  ascending: boolean;

}