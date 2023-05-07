// Import the Express library and the MySQL library
const express = require('express');
const mysql = require('mysql');

// Create a new connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',          // The hostname of the database server
    user: 'root',               // The MySQL username
    password: '',               // The MySQL password (if any)
    port: '3306',               // The port number to use for the connection
    database: 'loginRegisterApiNodejs',      // The name of the database to connect to
});

// Connect to the database
connection.connect(function(err) {
    if (err) throw err;         // If there's an error, throw an exception
    console.log('db connected');    // If the connection is successful, log a message
});

// Export the connection object so that it can be used in other parts of the application
module.exports = connection;
