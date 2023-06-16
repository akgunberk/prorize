### Api

json-server package is used to serve local json data which is `db.json`.

This package provides paginated data if request query params `_page` is given.
If data is paginated, `Link` header is provided in the response for the urls of other pages.

`parseLinkHeaders` util is used to get urls on the client side.

Default pagination number is 10 in the current implementation.
