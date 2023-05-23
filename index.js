// Import the Express library and create an instance of it
const express = require('express');
const app = express();

// Import the database connection object from the db.js file

// Set up a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome');
});

// Use the express.json() middleware to parse incoming JSON requests
app.use(express.json());

// Use body-parser middleware to parse incoming URL-encoded form data
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: "8mb" }));
app.use(bodyParser.json());

// Import the user router and register it with the app
const userRouter = require('./user');
app.use('/user', userRouter);

// Import the urgance router to fetch the data
const urganceRouter = require('./urgance');
app.use( urganceRouter);
// Import the urgance router to fetch the data
const subUrganceRouter = require('./sub-urgance');
app.use( subUrganceRouter);
// Import the users router to fetch the data
const usersRouter = require('./fetchUsers');
app.use( usersRouter);



// Start the Express app and listen on port 3000
app.listen(3000, "192.168.1.26", () => {
  console.log('Server is running on port 3000');
});
