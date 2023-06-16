import "./_app.scss";

import spinner from "./assets/spinner.svg";

import { useEffect, useRef, useState } from "react";

import { Table } from "./components";
import { PaginationHeaders, parseLinkHeader } from "./utils";
import { Pagination } from "./components/pagination";

const INITIAL_API_URL = "http://localhost:3000/games?_page=1";

export const TABLE_COLUMNS = [
  { key: "id", header: "Id" },
  { key: "rated", header: "Rated", isFilterable: true },
  { key: "winner", header: "Winner", isFilterable: true },
  { key: "white_id", header: "White", isSearchable: true },
  { key: "white_rating", header: "W-Rating", isSortable: true },
  { key: "black_id", header: "Black", isSearchable: true },
  { key: "black_rating", header: "B-Rating", isSortable: true },
  { key: "opening_eco", header: "Opening" },
  { key: "opening_ply", header: "Play", isSortable: true },
];

export function App() {
  const cacheRef = useRef<
    Record<string, { data: ChessGame[]; headers: PaginationHeaders }>
  >({});
  const [apiUrl, setApiUrl] = useState(INITIAL_API_URL);
  const [tableData, setTableData] = useState<{
    data: ChessGame[];
    headers: PaginationHeaders;
  }>();

  useEffect(() => {
    const abortController = new AbortController();

    getChessGames().catch(console.error);

    return () => abortController.abort();

    async function getChessGames() {
      if (cacheRef.current && cacheRef.current[apiUrl]) {
        const tableData = cacheRef.current[apiUrl];

        setTableData(tableData);

        return;
      }

      const tableData = await fetch(apiUrl, {
        signal: abortController.signal,
      }).then(async (res) => {
        const linkHeader = res.headers.get("Link") as string;
        const headers = parseLinkHeader(linkHeader);
        const data = (await res.json()) as ChessGame[];

        return { headers, data };
      });

      cacheRef.current[apiUrl] = tableData;
      setTableData(tableData);
    }
  }, [apiUrl]);

  if (!tableData)
    return <img data-testid="spinner" src={spinner} alt="spinner" />;

  return (
    <div className="table-box">
      <Table data={tableData.data} columns={TABLE_COLUMNS} />

      <Pagination
        total={tableData.headers.total}
        current={tableData.headers.current}
        onPageChange={onPageChange}
      />
    </div>
  );

  function onPageChange(
    page: keyof Omit<PaginationHeaders, "total" | "current">
  ) {
    const url = tableData?.headers?.[page];

    if (!url) return;

    setApiUrl(url);
  }
}

export default App;
