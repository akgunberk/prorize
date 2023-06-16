# Responsiveness

Responsiveness of the table is partyle dealed via `text-overflow:ellipsis`

Cells with overflowed data will be showns as `Data...` and when user hover a tooltip will be shown.

However, since the width of the table is highly unpredictable, developer and the **designer** should deal with the responsiveness ability of filtering features together.

Filtering features can take space can be disabled simply not providing the props such as `isSearchable` or popups can be triggered for searching/filtering for small size devices.

Popups for filtering/searching is not implemented since it is out of scope of this project.

## Example

```js
import { useMediaQuery } from 'usehooks-ts'

export default function CustomTable() {
  const matches = useMediaQuery('(min-width: 768px)')


const TABLE_COLUMNS = [
  { key: "id", header: "Id" },
  { key: "white_id", header: "White", isSearchable: matches ? true: false },
  { key: "white_rating", header: "W-Rating", isSortable: true },
  { key: "black_id", header: "Black", isSearchable: matches ? true : false },
  { key: "black_rating", header: "B-Rating", isSortable: true },
];

.......
```
