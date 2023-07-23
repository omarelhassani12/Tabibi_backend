const express = require('express');
const app = express();

// const http = require('http');


// const server = http.createServer(app);

// const io = require('socket.io')(server);
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
// Import the subUrganceRouter router to fetch the data
const subUrganceRouter = require('./sub-urgance');
app.use( subUrganceRouter);
// Import the responseRouter router to fetch the data
const responseRouter = require('./response');
app.use( responseRouter);
// Import the users router to fetch the data
const usersRouter = require('./fetchUsers');
app.use( usersRouter);


// /chat

const messageRouter = require('./message');
app.use( messageRouter);

//nodemailer

//channel 
// io.on("connection",(client)=>{
//   console.log("new client connected :");
//   console.log(client.id);
//   client.on("msg",(data)=>{
//     console.log(data.name);
//     // client.emit("res", "hello " + data.name + '  welcome !');//to send the message to jus thte client that send one message
//     io.emit("res", "hello " + data.name + '  welcome !');//to send the message to all client in group
//     client.broadcast.emit("res", "hello " + data.name + '  welcome !');//to send the message to all client in group without that one who send the message
//     io.to(client.id).emit("res", "hello " + data.name + '  welcome !');//send to that one who put the id in to()
//   });
// })


// Start the Express app and listen on port 3000
app.listen(3000, "192.168.1.26", () => {
  console.log('Server is running on port 3000');
});
// 192.168.43.166
// 192.168.1.26
