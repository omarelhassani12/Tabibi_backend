const express = require('express');
const router = express.Router();
var db = require('./db.js');

// Define a route handler for the '/register' endpoint that accepts POST requests
router.post('/register', (req, res) => {
    // Extract data from the request body
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    console.log(name);
    // Create a SQL query to insert a new user into the database
    var sqlQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    // Call the database to execute the query
    db.query(sqlQuery, [name, email, password], function(error, data, fields) {
        if (error) {
            // If there was an error, send an error response
            res.json({ success: false, message: error });
        } else {
            // If the query was successful, send a success response
            // console.log({ success: true, message: 'register' });
             res.json({ success: true, message: 'register' });
        }
    });
    console.log(name);
});
// Define a route handler for the '/login' endpoint that accepts POST requests
router.route('/login').post((req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    var sql = "SELECT * FROM users WHERE email=? AND password=?";
    console.log(email);
    //write engin
    db.query(sql,[email,password],function(err,data,fields){
        if(err){
            res.json({ success: false, message: err });
        }else{
            if(data.length > 0){
                res.json({ success: true, message: data });
                console.log(data);
            }else{
                res.json({ success: false, message: 'Empty Data' });
            }
        }
    });
});

module.exports = router;
