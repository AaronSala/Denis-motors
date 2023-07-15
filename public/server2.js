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

// Create a review schema
const reviewSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: String,
  comment: String,
});

const Review = mongoose.model('Review', reviewSchema);

app.get('/reviews', function (req, res) {
  Review.find()
    .then(reviews => {
      res.json(reviews);
    })
    .catch(error => {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Error fetching reviews' });
    });
});


// Define route to fetch car data

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
// Start the server






  // Start the server