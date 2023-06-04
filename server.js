const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your own secret key
const secretKey = 'my-secret-key';

// Mock user data for demonstration purposes
const users = [
  { id: 1, username: 'admin', password: 'Abc@123' },
  { id: 2, username: 'client', password: 'Abc@123' },
];

// Login endpoint to authenticate users
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the mock user data
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, secretKey);

    // Send the token back to the client
    res.json({ token: token,user: user });
  } else {
    // User not found or invalid credentials
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Middleware to protect the API routes
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

// Protected API endpoint
app.get('/api/todos', authenticateToken, (req, res) => {
  // Implement the logic to fetch and return todos for the authenticated user
  // You can use req.user to get the authenticated user's information

  // For demonstration purposes, return a sample response
  const todos = [
    { id: 1, title: 'Todo 1', completed: false },
    { id: 2, title: 'Todo 2', completed: true },
  ];

  res.json(todos);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
