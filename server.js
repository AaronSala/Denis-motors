const express = require('express');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const path = require('path');

// Database connection URL
const url = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'denis';
const collectionName = 'cars';

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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
