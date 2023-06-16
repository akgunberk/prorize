## Searching

Columns can be searched with the given input field value for filtering.

To enable searching, `columns` field should be given with isSearchable property.

useTable hook will search in case insensitive way and provide the rows which includes the input value.

Filtering is prioritized over to searching and only one can be enabled.

### Usage

For instance, on the current implementation of table which shows chess games, any field can be searchable.

white_id and black_id is a searchable field in current implementation.

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
