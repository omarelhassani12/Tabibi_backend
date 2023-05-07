# parse-body
A simple body parsing function for node.js

## Installation
`npm install parse-body`

## Example
    const parseBody = require('parse-body');

    parseBody(req, 1e6, function(err, body) {
      if (err) return console.log(err);

      console.log(body); // {somekey: 'somedata'}
    });

## Methodology
Handles standard form-urlencoded and json POST requests.  Does not handle multipart/form data.

Detects content type via `Content-Type` HTTP header.  If there is no `Content-Type` header, assumes payload is a Buffer and converts it to a string.

## Test
    npm test

To run tests in dev mode (so you can see the console.logs) run

    npm run dev-test

## API
### `parseBody(req, limit, callback)`

### Params

    req {Object} Usual node request object.
    limit {Number} The max size of the POST body in bytes.
    callback {Function} Called with the parsed POST body on success.

## License
MIT
