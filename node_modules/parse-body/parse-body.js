'use strict';

const http = require('http');
const querystring = require('querystring');

/**
* @function parseBody
*
* Receive a POST body and output to JSON when finished.
*
* @param {Object} req - Usual Node request object.
* @param {Number} limit - The POST body max size in bytes.
* @param {Function} callback
*
* @return {undefined}
*/
function parseBody(req, limit, callback) {
  const body = [];

  function handleData(data) {
    body.push(data);

    /**
    Stop collecting data and call the callback with an error if request exceeds limit.
    Calling function should close the connection.
    */
    if (Buffer.concat(body).length > limit) {
      req.removeListener('data', handleData);
      req.removeListener('end', handleEnd);

      const error = new Error();
      error.httpCode = 413;
      error.message = http.STATUS_CODES[413];

      callback(error);
    }
  }

  function handleEnd() {
    const type = req.headers['content-type'];

    if (type === 'application/x-www-form-urlencoded') {
      callback(null, querystring.parse(Buffer.concat(body).toString()));

    } else if (type === 'application/json') {
      callback(null, JSON.parse(Buffer.concat(body).toString()));

    } else {
      callback(null, Buffer.concat(body).toString());
    }
  }

  req.on('data', handleData);
  req.on('end', handleEnd);
}

module.exports = parseBody;
