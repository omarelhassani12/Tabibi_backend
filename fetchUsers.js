// Import the required modules and dependencies
const express = require('express');
const usersRouter = express.Router();
const db = require('./db'); // Replace with your actual database module

usersRouter.get('/patients', (req, res) => {
    // Create a SQL query to fetch user data with role = 'Patient' from the database
    const sqlQuery = 'SELECT * FROM users WHERE role = "Patient"';
  
    // Call the database to execute the query
    db.query(sqlQuery, (error, results) => {
      if (error) {
        // If there was an error retrieving the user data, send an error response
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        // If the query was successful, send the user data as the response
        res.json({ success: true, users: results });
      }
    });
  });

  
usersRouter.get('/doctors', (req, res) => {
    // Create a SQL query to fetch user data with role = 'Doctor' from the database
    const sqlQuery = 'SELECT * FROM users WHERE role = "doctor"';
  
    // Call the database to execute the query
    db.query(sqlQuery, (error, results) => {
      if (error) {
        // If there was an error retrieving the user data, send an error response
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        // If the query was successful, send the user data as the response
        res.json({ success: true, users: results });
      }
    });
  });
  

module.exports = usersRouter;