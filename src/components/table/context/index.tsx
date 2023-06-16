import { createContext, useContext } from "react";

import { TableHeaderProps } from "../table-header";

export const TableContext = createContext({});

export function useTableContext<
  T extends Record<string, string | number>,
  K extends keyof T
>() {
  const context = useContext(TableContext) as {
    headerProps: TableHeaderProps<T, K>;
    prepareRows: () => Array<{ row: T; getCell: (columnId: K) => T[K] }>;
  };

  return context;
}
