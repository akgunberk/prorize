import "./_table-header.scss";

import sortArrowSvg from "@/assets/sort-arrow.svg";

import clsx from "clsx";

import { noop } from "@/utils";
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { TableProps } from "../table.types";
import { useTableContext } from "../context";

export type TableHeaderProps<
  T extends Record<string, string | number>,
  K extends keyof T
> = Array<{
  data: {
    column: TableProps<T, K>["columns"][number];
    filterValues: T[K][] | null;
  };

  toggleSorting: () => void;
  filter: (value: string) => void;
  search: (value: string) => void;
}>;

export default function TableHeader() {
  const { headerProps } = useTableContext();

  const tableHeaderCellCn = (isSortable: boolean) =>
    clsx("table-header__cell", {
      "table-header__cell--sortable": isSortable,
    });

  return (
    <thead className="table-header">
      <tr className="table-header__row">
        {headerProps.map((header, headerIndex) => (
          <th
            key={`headCell-${header.data.column.header}-${headerIndex}`}
            className={tableHeaderCellCn(!!header.data.column.isSortable)}
          >
            <div className="flex">
              {header.data.column.header}

              {header.data.column.isSortable && (
                <button
                  data-testid={`sort-${header.data.column.key}`}
                  className="table-header__sort-button"
                  onClick={
                    header.data.column.isSortable ? header.toggleSorting : noop
                  }
                >
                  <img
                    width={16}
                    height={16}
                    src={sortArrowSvg}
                    alt="arrows indicate column is sortable"
                  />
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>

      <tr className="table-header__row">
        {headerProps.map((header, headerIndex) => (
          <th
            key={`headCell-${header.data.column.header}-${headerIndex}`}
            className={tableHeaderCellCn(!!header.data.column.isSortable)}
          >
            <span className="flex flex-col gap-4">
              {header.data.column.isFilterable && header.data.filterValues && (
                // this component is taken from shadcn/ui for time restrictions
                <Select onValueChange={header.filter}>
                  <SelectTrigger
                    className="w-auto"
                    data-testid={`filter-${header.data.column.key}`}
                  >
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup aria-pressed={"true"}>
                      {header.data.filterValues.map(
                        (filterValue, filterIndex) => (
                          <SelectItem
                            key={`filter-${filterValue}-${filterIndex}`}
                            value={filterValue as string}
                          >
                            {filterValue as string}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              {!header.data.column.isFilterable &&
                header.data.column.isSearchable && (
                  <>
                    <label
                      htmlFor={`search-${header.data.column.key}`}
                      className="sr-only"
                    >
                      Search {header.data.column.key}
                    </label>

                    {/*  this component is taken from shadcn/ui for time restrictions */}
                    <Input
                      id={`search-${header.data.column.key}`}
                      placeholder="Search"
                      onChange={(e) => header.search(e.currentTarget.value)}
                    />
                  </>
                )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}
