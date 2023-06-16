## Sorting

Sorting feature can be used only with string or number fields in a given column.

To enable sorting, `columns` field should be given with isSortable property.

Sorting is not dependant on other features and displayed with an icon next to header of the column.

### Usage

```js
const TABLE_COLUMNS = [
  { key: "id", header: "Id" },
  { key: "white_id", header: "White", isSearchable: true },
  { key: "white_rating", header: "W-Rating", isSortable: true },
  { key: "black_id", header: "Black", isSearchable: true },
  { key: "black_rating", header: "B-Rating", isSortable: true },
];
```
