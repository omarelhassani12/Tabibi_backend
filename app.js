const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_database',
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Middlewares
app.use(bodyParser.json());

// User registration endpoint
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  pool.query(sql, [email, hashedPassword], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

// User authentication endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email }, 'my-secret-key');
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  });
});

// User data endpoint (requires authentication)
app.get('/user', verifyToken, (req, res) => {
  const email = req.email;
  const sql = 'SELECT id, email FROM users WHERE email = ?';
  pool.query(sql, [email], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'User not found' });
    } else {
      const user = results[0];
      res.status(200).json(user);
    }
  });
});

// Helper function to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'my-secret-key', (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

