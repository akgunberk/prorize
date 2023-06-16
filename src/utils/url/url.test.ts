import { describe, expect, test } from "vitest";

import { PaginationHeaders, parseLinkHeader } from ".";

const LINK_HEADERS: Array<[string, PaginationHeaders]> = [
  [
    `<http://localhost:3000/games?_page=1>; rel="first", <http://localhost:3000/games?_page=2>; rel="next", <http://localhost:3000/games?_page=16>; rel="last"`,
    {
      first: "http://localhost:3000/games?_page=1",
      prev: undefined,
      next: "http://localhost:3000/games?_page=2",
      last: "http://localhost:3000/games?_page=16",
      current: 1,
      total: 16,
    },
  ],

  [
    `<http://localhost:3000/games?_page=1>; rel="first", <http://localhost:3000/games?_page=4>; rel="prev", <http://localhost:3000/games?_page=6>; rel="next", <http://localhost:3000/games?_page=16>; rel="last"`,
    {
      first: "http://localhost:3000/games?_page=1",
      prev: "http://localhost:3000/games?_page=4",
      next: "http://localhost:3000/games?_page=6",
      last: "http://localhost:3000/games?_page=16",
      current: 5,
      total: 16,
    },
  ],
  [
    `<http://localhost:3000/games?_page=1>; rel="first", <http://localhost:3000/games?_page=15>; rel="prev", <http://localhost:3000/games?_page=16>; rel="last"`,
    {
      first: "http://localhost:3000/games?_page=1",
      prev: "http://localhost:3000/games?_page=15",
      next: undefined,
      last: "http://localhost:3000/games?_page=16",
      current: 16,
      total: 16,
    },
  ],
];

describe("url utils/parseLinkHeader", () => {
  test("should parse link headers", () => {
    for (const [linkHeader, links] of LINK_HEADERS) {
      expect(parseLinkHeader(linkHeader)).toMatchObject(links);
    }
  });
});
