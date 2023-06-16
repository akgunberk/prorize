import { Dispatch, SetStateAction } from "react";

import {
  ColumnFiltersState,
  SearchState,
  SortingState,
  TableProps,
} from "@/components/table/table.types";
import { TableHeaderProps } from "@/components/table/table-header";
import { noop } from "@/utils";

export interface UseTableProps<
  T extends Record<string, string | number>,
  K extends keyof T
> extends TableProps<T, K> {
  state: {
    sorting?: SortingState;
    filtering?: ColumnFiltersState;
    search?: SearchState;
  };
  onSortingChange?: Dispatch<SetStateAction<SortingState | undefined>>;
  onFilteringChange?: Dispatch<SetStateAction<ColumnFiltersState>>;
  onSearchChange?: Dispatch<SetStateAction<SearchState | undefined>>;
}

export const useTable = <
  T extends Record<string, string | number>,
  K extends keyof T
>({
  data,
  columns,
  state: { sorting, filtering, search },
  onSortingChange,
  onFilteringChange,
  onSearchChange,
}: UseTableProps<T, K>): {
  headerProps: TableHeaderProps<T, K>;
  prepareRows: () => Array<{ row: T; getCell: (columnId: K) => T[K] }>;
} => {
  const headerProps = columns.map((column) => ({
    data: {
      column,
      filterValues: column.isFilterable ? getDistinctValues(column.key) : null,
    },
    toggleSorting: onSortingChange
      ? () => {
          onSortingChange((oldSortingState) => ({
            id: column.key.toString(),
            desc:
              oldSortingState?.id === column.key.toString()
                ? sorting?.desc
                  ? false
                  : true
                : true,
          }));
        }
      : noop,

    filter: onFilteringChange
      ? (value: string) => {
          onFilteringChange((oldFilteringState) => [
            ...oldFilteringState,
            { id: column.key.toString(), value },
          ]);
        }
      : noop,

    search: onSearchChange
      ? (value: string) => {
          onSearchChange(() => ({
            id: column.key.toString(),
            value,
          }));
        }
      : noop,
  }));

  return { headerProps, prepareRows };

  function getDistinctValues(columnId: K) {
    return [...new Set(data.map((row) => row[columnId]))];
  }

  function prepareRows() {
    let rows: T[] = [...data];

    if (filtering && filtering.length > 0) {
      rows = data.filter((row) =>
        filtering.every(
          (filterState) => row[filterState.id] === filterState.value
        )
      );
    }

    if (search) {
      rows = rows.filter((row) =>
        row[search.id]
          .toString()
          .toLowerCase()
          .includes(search.value.toLowerCase())
      );
    }

    if (sorting) {
      rows = rows.sort((rowA, rowB) => {
        const pair = sorting.desc ? [rowB, rowA] : [rowA, rowB];

        return pair[0][sorting.id] <= pair[1][sorting.id] ? -1 : 1;
      });
    }

    return rows.map((row) => ({
      row,
      getCell: (columnId: K) => row[columnId],
    }));
  }
};
