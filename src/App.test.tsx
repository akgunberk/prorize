import { describe, expect, test } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { App, TABLE_COLUMNS } from "./App";

import db from "../db.json";
import { PAGINATION_SYMBOLS } from "./components/pagination/pagination.contants";

const games = (db as { games: ChessGame[] }).games.slice(0, 30);
const [PAGE1, PAGE2, PAGE3] = [
  games.slice(0, 10),
  games.slice(10, 20),
  games.slice(20, 30),
];

const MOCK_RESPONSES: Record<string, { data: ChessGame[]; header: string }> = {
  "1": {
    data: PAGE1,
    header: `<http://localhost:3000/games?_page=1>; rel="first", <http://localhost:3000/games?_page=2>; rel="next", <http://localhost:3000/games?_page=3>; rel="last"`,
  },
  "2": {
    data: PAGE2,
    header: `<http://localhost:3000/games?_page=1>; rel="first", <http://localhost:3000/games?_page=1>; rel="prev", <http://localhost:3000/games?_page=3>; rel="next", <http://localhost:3000/games?_page=3>; rel="last"`,
  },
  "3": {
    data: PAGE3,
    header: `<http://localhost:3000/games?_page=1>; rel="first", <http://localhost:3000/games?_page=2>; rel="prev", <http://localhost:3000/games?_page=3>; rel="last"`,
  },
};

// mock server
const server = setupServer(
  rest.get("/games", (req, res, ctx) => {
    const page = req.url.searchParams.get("_page");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { data, header } = MOCK_RESPONSES[page!];

    return res(ctx.set("Link", header), ctx.status(200), ctx.json(data));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

async function waitForSpinner() {
  const spinner = screen.getByTestId("spinner");

  expect(spinner).toBeInTheDocument();

  await waitForElementToBeRemoved(spinner);
}

describe("Table tests", () => {
  test("columns and rows should be rendered", async () => {
    render(<App />);

    await waitForSpinner();

    for (const column of TABLE_COLUMNS) {
      screen.getByRole("columnheader", {
        name: new RegExp(column.header),
      });
    }

    expect(screen.getAllByRole("cell").length).toBe(10 * TABLE_COLUMNS.length);
  });

  test("pagination", async () => {
    render(<App />);

    await waitForSpinner();

    // initial state
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.first })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.prev })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.next })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.last })
    ).toBeEnabled();

    // check only first row of page1
    expect(screen.getByRole("cell", { name: PAGE1[0].id })).toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: PAGE2[0].id })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.next })
    );

    // intermediary state
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.first })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.prev })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.next })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.last })
    ).toBeEnabled();

    // check only first row of page2
    expect(
      screen.queryByRole("cell", { name: PAGE1[0].id })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: PAGE2[0].id })).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.next })
    );

    // last state
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.first })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.prev })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.next })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.last })
    ).toBeDisabled();

    // check only first row of page3
    expect(
      screen.queryByRole("cell", { name: PAGE2[0].id })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: PAGE3[0].id })).toBeInTheDocument();

    // check previous button
    await userEvent.click(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.prev })
    );
    expect(screen.getByRole("cell", { name: PAGE2[0].id })).toBeInTheDocument();

    // check first button
    await userEvent.click(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.first })
    );
    expect(screen.getByRole("cell", { name: PAGE1[0].id })).toBeInTheDocument();

    // check last button
    await userEvent.click(
      screen.getByRole("button", { name: PAGINATION_SYMBOLS.last })
    );
    expect(screen.getByRole("cell", { name: PAGE3[0].id })).toBeInTheDocument();
  });

  test("sort", async () => {
    render(<App />);

    await waitForSpinner();

    // white_rating
    const sortTrigger = screen.getByTestId("sort-white_rating");

    // desc
    await userEvent.click(sortTrigger);
    const descendedItems = [...PAGE1].sort((rowA, rowB) =>
      rowB["white_rating"] - rowA["white_rating"] <= 0 ? -1 : 1
    );
    expect(
      [...PAGE1].sort((rowA, rowB) => {
        const nodeA = screen.getByRole("row", { name: new RegExp(rowA.id) });
        const nodeB = screen.getByRole("row", { name: new RegExp(rowB.id) });

        return nodeA.compareDocumentPosition(nodeB) ===
          Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : -1;
      })
    ).toEqual(descendedItems);

    // asc
    await userEvent.click(sortTrigger);
    const ascendedItems = [...PAGE1].sort((rowA, rowB) =>
      rowA["white_rating"] - rowB["white_rating"] <= 0 ? -1 : 1
    );
    expect(
      [...PAGE1].sort((rowA, rowB) => {
        const nodeA = screen.getByRole("row", { name: new RegExp(rowA.id) });
        const nodeB = screen.getByRole("row", { name: new RegExp(rowB.id) });

        return nodeA.compareDocumentPosition(nodeB) ===
          Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : -1;
      })
    ).toEqual(ascendedItems);
  });

  test("filter", async () => {
    render(<App />);

    await waitForSpinner();

    // Rated filter
    const selectTrigger = screen.getByTestId("filter-rated");
    await userEvent.click(selectTrigger);

    const optionX = screen.getByRole("option", { name: "X" });
    await userEvent.click(optionX);

    const filteredItems = PAGE1.filter((row) => row.rated === "X");
    expect(screen.getAllByRole("cell").length).toBe(
      filteredItems.length * TABLE_COLUMNS.length
    );

    // Winner filter
    const selectTrigger2 = screen.getByTestId("filter-winner");
    await userEvent.click(selectTrigger2);

    const optionWhite = screen.getByRole("option", { name: "white" });
    await userEvent.click(optionWhite);

    const filteredItems2 = filteredItems.filter(
      (row) => row.winner === "white"
    );
    expect(screen.getAllByRole("cell").length).toBe(
      filteredItems2.length * TABLE_COLUMNS.length
    );
  });

  test("search", async () => {
    render(<App />);

    await waitForSpinner();
    const input = screen.getByLabelText(`Search white_id`, {
      selector: "input",
    });

    // only 1 row
    await userEvent.type(input, PAGE1[0].white_id);
    expect(screen.getAllByRole("cell").length).toBe(1 * TABLE_COLUMNS.length);

    // multiple rows
    await userEvent.clear(input);
    const searchText = "a";

    await userEvent.type(input, searchText);

    const searchedItems = PAGE1.filter((row) =>
      row["white_id"].toLowerCase().includes(searchText)
    ).length;

    expect(screen.getAllByRole("cell").length).toBe(
      searchedItems * TABLE_COLUMNS.length
    );
  });
});
