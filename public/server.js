const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/denis', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema, 'users');

// Parse request body
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle user login request
app.post('/login', async(req, res) => {
  const { username, password } = req.body;

  try {
    // Find a user with the provided username and password
    const user = await User.findOne({ username, password });

    if (user) {
      
      // User found, send success status
      res.sendStatus(200);
    } else {
      // User not found, send unauthorized status
      res.sendStatus(401);
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(3002, () => {
  console.log('Server listening on port 3002');
});
