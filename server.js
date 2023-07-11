const express = require('express');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Database connection URL
const url = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'denis';
const collectionName = 'cars';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://dennis-motors.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve static files from the "public" directory
app.use(express.static('public'));


// Define a route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define an API endpoint for fetching car data
app.get('/cars', async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all car documents from the collection
    const cars = await collection.find().toArray();

    // Send the car data as JSON response
    res.json(cars);

    // Close the database connection
    client.close();
  } catch (error) {
    console.error('Error retrieving car data:', error);
    res.status(500).send('Internal Server Error');
  }
});


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
app.use(express.static(path.join(__dirname, 'public, index.html')));

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



// Define route to fetch car data
app.get('/cars', async (req, res) => {
  let client; // Declare the client variable outside the try block

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://dennis-motors.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  try {
    // Connect to MongoDB
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch car data from MongoDB
    const cars = await collection.find().toArray();

    // Send car data as JSON response
    res.json(cars);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the MongoDB connection if it exists
    if (client) {
      client.close();
    }
  }
});

// Serve the cars.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server




// Start the server


// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
// Start the server
