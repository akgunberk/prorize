import "./_pagination.scss";

import { PAGINATION_SYMBOLS } from "./pagination.contants";

export type PaginationButton = "first" | "prev" | "last" | "next";

type PaginationProps = {
  onPageChange: (page: PaginationButton) => void;
  current: number;
  total: number;
};

export function Pagination({ onPageChange, current, total }: PaginationProps) {
  return (
    <div className="pagination">
      <span>{`${current} of ${total}`}</span>

      <ul className="pagination__list">
        {(Object.keys(PAGINATION_SYMBOLS) as PaginationButton[]).map(
          (key, pageIndex) => (
            <li key={`page-${pageIndex}`}>
              <button
                className="pagination__button"
                onClick={handlePageChange(key)}
                disabled={isDisabled(key)}
              >
                {PAGINATION_SYMBOLS[key as PaginationButton]}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );

  function handlePageChange(page: PaginationButton) {
    return () => onPageChange(page);
  }

  function isDisabled(page: PaginationButton) {
    if (current === 1)
      return Object.keys(PAGINATION_SYMBOLS).slice(0, 2).includes(page);
    if (current === total)
      return Object.keys(PAGINATION_SYMBOLS).slice(2).includes(page);

    return false;
  }
}
