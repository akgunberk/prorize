## Pagination

Pagination is designed as standalone component because most of the data comes paginated from the API.

That's why it just gets the current page number and total pages and onPageChange callback to provide user feedback to the parent component.

### Usage

In current implementation, pagination info is parsed from the response `Link` header and fed into the pagination component.

In this way, paginated data is fetched by user activity.
To increase user experience, paginated data is cached in `App.tsx` to prevent unnecessary BE requests.

```js
<Pagination
  total={tableData.headers.total}
  current={tableData.headers.current}
  onPageChange={onPageChange}
/>
```
