## Installation

- Clone the repo and install the necessary node_modules

```bash
$ git clone https://github.com/akgunberk/prorize.git

$ cd prorize

$ npm install
```

## Running Application

Since json-server is used for mock BE, server should be up and running first.

```bash
npm run server
```

Then, client can be serverd via the command

```bash
npm run dev
```

## Docs

You can find docs for the features and limitations of the table component in `docs` folder.

## Test

Tests of the **Table** implementation can be found in `App.test.tsx`.

- Vitest, React-Testing-Library and MSW(for mocking server) is used for testing.

Other components rather than Table, such as `Input`/`Select` is taken from [shadcn/ui](https://ui.shadcn.com/) for time restrictions.

- Hence, these components are not tested.

Only one util is used for the project which is `parseLinkHeaders`, to parse `Link` header for pagaination purposes.

- The util is tested under `utils/url/url.test.ts`
