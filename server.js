const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://dennis-motors.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/denis', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error)
  );

// Create a car schema
const carSchema = new mongoose.Schema({
  maker: String,
  model: String,
  year: Number,
  images: [String],
  price: Number,
  category: String,
  shape: String,
  mileage: String,
  engine: String,
  description: String,
});

// Create a car model
const Car = mongoose.model('Car', carSchema);

// Create a review schema
const reviewSchema = new mongoose.Schema({
  name: String,
  location: String,
  country: String,
  comments: String,
});

const Review = mongoose.model('Review', reviewSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to fetch car data
app.get('/cars', function (req, res) {
  Car.find()
    .then(cars => {
      res.json(cars);
    })
    .catch(error => {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Error fetching cars' });
    });
});

// Route to fetch reviews
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

// Add a route to handle POST requests for adding a review
app.post('/reviews', function(req, res) {
  // Retrieve the review data from the request body
  const { name, location, country, comments,rating } = req.body;

  // Create a new instance of the Review model
  const newReview = new Review({
    name,
    location,
    country,
    comments,
    rating
  });

  // Save the new review to the database
  newReview.save()
    .then(savedReview => {
      console.log('Review saved:', savedReview);
      res.json(savedReview); // Send the saved review as the response
    })
    .catch(error => {
      console.error('Error saving review:', error);
      res.status(500).json({ error: 'Error saving review' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
