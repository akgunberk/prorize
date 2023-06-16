import "./_table.scss";

import { useState } from "react";

import { useTable } from "../../hooks";
import {
  ColumnFiltersState,
  SearchState,
  SortingState,
  TableProps,
} from "./table.types";
import TableHeader from "./table-header";
import { TableContext } from "./context";

export const Table = <
  T extends Record<string, string | number>,
  K extends keyof T
>({
  data,
  columns,
}: TableProps<T, K>) => {
  const [sorting, setSorting] = useState<SortingState | undefined>();
  const [filtering, setFiltering] = useState<ColumnFiltersState>([]);
  const [search, setSearch] = useState<SearchState | undefined>();

  const table = useTable({
    data,
    columns,
    state: { sorting, filtering, search },
    onSortingChange: setSorting,
    onFilteringChange: setFiltering,
    onSearchChange: setSearch,
  });

  return (
    <TableContext.Provider value={{ ...table }}>
      <table data-testid="table" className="table-box__table">
        <TableHeader />

        <tbody className="table-box__body">
          {table.prepareRows().map((row, index) => (
            <tr key={`row-${index}`} className="table-row">
              {columns.map((column, index2) => (
                <td
                  key={`cell-${index2}`}
                  className="table-row__cell"
                  title={row.getCell(column.key) as string}
                >
                  {row.getCell(column.key) as string}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContext.Provider>
  );
};
