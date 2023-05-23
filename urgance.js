// Import the required modules and dependencies
const express = require('express');
const urganceRouter = express.Router();
const db = require('./db'); // Replace with your actual database module

// Define the route to get urgance data
urganceRouter.get('/urgance', (req, res) => {
  // Create a SQL query to fetch urgance data from the database
  const sqlQuery = 'SELECT * FROM urgance';

  // Call the database to execute the query
  db.query(sqlQuery, (error, results) => {
    if (error) {
      // If there was an error retrieving the urgance data, send an error response
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      // If the query was successful, send the urgance data as the response
      res.json({ success: true, urgances: results });
    }
  });
});

// Export the urganceRouter
module.exports = urganceRouter;
