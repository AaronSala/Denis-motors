const express = require('express');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
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


const reviewSchema = new mongoose.Schema({
  name: String,
  location: String,
  country: String,
  comments: String,
});

// Create a review model
const Review = mongoose.model('Review', reviewSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the HTML file for the root path
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname,  'public', 'index.html'));
});

// Set the MIME type for JavaScript files

// Handle POST request for creating a new review
app.post('/reviews', function(req, res) {
  const { name, location, country, comments } = req.body;
 
  // Create a new review object
  const review = new Review({
    name,
    location,
    country,
    comments
  });

  // Save the review object to the database
  review.save()
    .then(() => {
      console.log('Review saved:', comments);
      res.redirect('/');
    })
    .catch(error => console.error('Error saving review:', error));
});


// Define route to fetch car data

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
// Start the server
