## Filtering

Filtering feature can be used on columns sharing limited number of values ideally.

To enable filtering, `columns` field should be given with isFilterable property.

useTable hook will provide **distinct** filter values on the ui which is selectable to user.

Filtering is prioritized over to searching to prevent confusion.

### Usage

For instance, on the current implementation of table which shows chess games

- if the game is rated or not
- winner is white or black

can be filterable.

```js
const TABLE_COLUMNS = [
  { key: "id", header: "Id" },
  { key: "rated", header: "Rated", isFilterable: true },
  { key: "winner", header: "Winner", isFilterable: true },
  { key: "white_id", header: "White", isSearchable: true },
  { key: "white_rating", header: "W-Rating", isSortable: true },
  { key: "black_id", header: "Black", isSearchable: true },
  { key: "black_rating", header: "B-Rating", isSortable: true },
];
```
