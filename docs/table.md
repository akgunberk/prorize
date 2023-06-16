## Interactive Table Component

This repo shows the implementation of the **Interactive Table Component** with the features of:

- Pagination
- Sorting
- Filtering
- Searching

## Usage

Usage of the Table component depends on the related hook of `useTable` which enables the features above and organizes the data for the rendering in Table Component.

To keep the code clean and modular, it is decided to implement the hook and keep the logic and the ui seperate.

### Table and useTable inputs

**Table** component and **useTable** hook share the same inputs which are _data_ and _columns_.

- data: indicate the data which is array of the rows the table with given columns

data is an array of objects which supports only string or number for the filtering features to work properly.

```js
const TABLE_DATA = [
  {
    id: "TZJHLljE",
    rated: "X",
    created_at: 1504210000000,
    last_move_at: 1504210000000,
    turns: 13,
    victory_status: "outoftime",
    winner: "white",
    increment_code: "15+2",
    white_id: "bourgris",
    white_rating: 1500,
    black_id: "a-00",
    black_rating: 1191,
    moves: "d4 d5 c4 c6 cxd5 e6 dxe6 fxe6 Nf3 Bb4+ Nc3 Ba5 Bf4",
    opening_eco: "D10",
    opening_name: "Slav Defense: Exchange Variation",
    opening_ply: 5,
  },
  {
    id: "l1NXvwaE",
    rated: "✓",
    created_at: 1504130000000,
    last_move_at: 1504130000000,
    turns: 16,
    victory_status: "resign",
    winner: "black",
    increment_code: "5+10",
    white_id: "a-00",
    white_rating: 1322,
    black_id: "skinnerua",
    black_rating: 1261,
    moves: "d4 Nc6 e4 e5 f4 f6 dxe5 fxe5 fxe5 Nxe5 Qd4 Nc6 Qe5+ Nxe5 c4 Bb4+",
    opening_eco: "B00",
    opening_name: "Nimzowitsch Defense: Kennedy Variation",
    opening_ply: 4,
  },
];
```

- columns: indicate the columns of the table with the intended features selected from the data

  columns is an array which indicates the key, header of the field to display and provides filtering features for the given column.

```js
const TABLE_COLUMNS = [
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
```

### useTable hook

**useTable** hook functionality is simply:

- preparing the headers, for the features mentioned above
- implementing `prepareRows` function to get the rows of the table in the given state of `filtering state`

Since the data of the table can be changed via `pagination`, state and callback function of the state change should be given to the hook as shown below.

#### Usage

```js
const table = useTable({
  data,
  columns,
  state: { sorting, filtering, search },
  onSortingChange: setSorting,
  onFilteringChange: setFiltering,
  onSearchChange: setSearch,
});
```

### Table component

Table component renders the data of the table with given columns and provides ui components such as

- sorting button, filtering and searching input boxes to enables the using of the features in related columns
- renders the rows of the columns

#### Usage

```js
<Table data={TABLE_DATA} columns={TABLE_COLUMNS} />
```
