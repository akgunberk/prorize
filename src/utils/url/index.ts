export type PaginationHeaders = {
  first: string;
  prev: string | undefined;
  next: string | undefined;
  last: string;
  current: number;
  total: number;
};

export function parseLinkHeader(header: string): PaginationHeaders {
  const linkHeaders = header.split(",");

  if (linkHeaders.length <= 0) throw Error("There is no link in headers");

  const [first, last] = [linkHeaders.shift(), linkHeaders.pop()].map((header) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    extractLink(header!)
  );

  let prev, next;

  for (const linkHeader of linkHeaders) {
    const link = extractLink(linkHeader);

    if (linkHeader.includes("next")) next = link;
    else if (linkHeader.includes("prev")) prev = link;
  }

  const total = Number(/\?_page=(\d+)/.exec(last)?.[1]);

  const current = prev
    ? Number(prev.split("=")[1]) + 1
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Number(next!.split("=")[1]) - 1;

  return {
    first,
    prev,
    next,
    last,
    total,
    current,
  };

  function extractLink(header: string) {
    return header.split(";")[0].replace(/[<>]/g, "").trim();
  }
}
