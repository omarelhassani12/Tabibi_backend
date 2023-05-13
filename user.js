const express = require('express');
const router = express.Router();
const db = require('./db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', (req, res) => {
    // Extract data from the request body
    const { type, nomPrenom, email, cni, password, telephone, age, urgence, sexe } = req.body;

    // Check if the username field is not empty
    if (!nomPrenom) {
        res.status(400).json({ success: false, message: 'Username field cannot be empty' });
        return;
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            // If there's an error hashing the password, send an error response
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        } else {
            // Create a SQL query to insert a new user into the database
            const sqlQuery = "INSERT INTO users (role, username, email, cni, password, phone, age, urgence, sexe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            // Call the database to execute the query
            db.query(sqlQuery, ['Patient', nomPrenom, email, cni, hashedPassword, telephone, age, urgence, sexe], function(error, data, fields) {
                if (error) {
                    // If there was an error inserting the user, send an error response
                    console.error(error);
                    res.status(500).json({ success: false, message: 'Internal server error' });
                } else {
                    // If the query was successful, send a success response
                    res.json({ success: true, message: 'User registered successfully' });
                }
            });
        }
    });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database for the user with the given email
    const sqlQuery = "SELECT * FROM users WHERE email=?";
    db.query(sqlQuery, [email], function(error, data, fields) {
        if (error) {
            res.json({ success: false, message: error });
        } else {
            if (data.length > 0) {
                // Compare the password with the input password
                bcrypt.compare(password, data[0].password, function(err, result) {
                    if (result) {
                        // User authenticated, generate JWT token and send back to client
                        const token = jwt.sign({ email }, 'my-secret-key');
                        res.json({ success: true, data , token });
                    } else {
                        res.json({ success: false, message: 'Invalid email or password' });
                    }
                });
            } else {
                res.json({ success: false, message: 'Invalid email or password' });
            }
        }
    });
});



// // Define a route handler for the '/login' endpoint that accepts POST requests
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     // Query the database for the user with the given email
//     const sqlQuery = "SELECT * FROM users WHERE email=?";
//     db.query(sqlQuery, [email], function(error, data, fields) {
//         if (error) {
//             res.json({ success: false, message: error });
//         } else {
//             if (data.length > 0) {
//                 // Compare the password with the input password
//                 if (password === data[0].password) {
//                     // User authenticated, generate JWT token and send back to client
//                     const token = jwt.sign({ email }, 'my-secret-key');
//                     res.json({ success: true, data , token });
//                 } else {
//                     res.json({ success: false, message: 'Invalid email or password' });
//                 }
//             } else {
//                 res.json({ success: false, message: 'Invalid email or password' });
//             }
//         }
//     });
// });


  
  
module.exports = router;
