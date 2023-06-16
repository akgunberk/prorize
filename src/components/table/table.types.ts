export interface TableProps<
  T extends Record<string, string | number>,
  K extends keyof T
> {
  data: T[];
  columns: {
    key: K;
    header: string;
    isSortable?: boolean;
    isFilterable?: boolean;
    isSearchable?: boolean;
    display?: [boolean, boolean, boolean];
  }[];
}

export type SortDirection = "asc" | "desc";

export type SortingState = {
  id: string;
  desc: boolean;
};

export type ColumnFiltersState = ColumnFilter[];

export type ColumnFilter = {
  id: string;
  value: unknown;
};

export type SearchState = {
  id: string;
  value: string;
};
