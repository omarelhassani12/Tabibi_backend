const express = require('express');
const messageRouter = express.Router();
const db = require('./db'); 


messageRouter.post('/messages', (req, res) => {
    // Extract the data from the request body
    const { sender_id, receiver_id, message } = req.body;
  
    // Create a new message object
    const messageData = {
      sender_id,
      receiver_id,
      message,
      created_at: new Date().toISOString(), // Convert the date to a string format compatible with the database
    };
  
    // Insert the data into the table
    db.query('INSERT INTO chat SET ?', messageData, (error, results) => {
      if (error) {
        console.error('Error inserting data into the table:', error);
        res.status(500).json({ error: 'An error occurred' });
        return;
      }
      console.log('Data inserted successfully');
      console.log('Inserted record ID:', results.insertId);
  
      res.status(200).json({ message: 'Data inserted successfully' });
    });
  });

  

  messageRouter.get('/GetMessages/:senderId/:receiverId', (req, res) => {
    const { senderId, receiverId } = req.params;
  
    // Retrieve messages from the database based on the sender and receiver IDs
    db.query(
      'SELECT * FROM chat WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
      [senderId, receiverId, receiverId, senderId],
      (error, results) => {
        if (error) {
          console.error('Error retrieving messages:', error);
          res.status(500).json({ error: 'An error occurred' });
          return;
        }
  
        console.log('Messages retrieved successfully');
  
        res.status(200).json(results);
      }
    );
  });
  


  messageRouter.get('/LastMessage/:senderId/:receiverId', (req, res) => {
    const { senderId, receiverId } = req.params;
  
    // Retrieve the last message from the database based on the sender and receiver IDs
    db.query(
      'SELECT * FROM chat WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY id DESC LIMIT 1',
      [senderId, receiverId, receiverId, senderId],
      (error, results) => {
        if (error) {
          console.error('Error retrieving last message:', error);
          res.status(500).json({ error: 'An error occurred' });
          return;
        }
  
        if (results.length === 0) {
          res.status(404).json({ error: 'No last message found' });
          return;
        }
  
        const lastMessage = results[0];
  
        console.log('Last message retrieved successfully');
  
        res.status(200).json(lastMessage);
      }
    );
  });
  


  module.exports = messageRouter;
