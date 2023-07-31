const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const { MongoClient } = require('mongodb');
const path = require('path');
const mime = require('mime');
const bcrypt = require('bcrypt');


const uri = 'mongodb+srv://salaaron2:<sala4492>@denis.kbbmsou.mongodb.net/';
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://dennis-motors.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://dennis-motors.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


// Serve static files from the 'public' directory
app.use(express.static('public'));
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// Middleware to set the correct MIME type for static files

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/denis", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

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
const Car = mongoose.model("Car", carSchema);

// Create a review schema
const reviewSchema = new mongoose.Schema({
  name: String,
  location: String,
  country: String,
  comments: String,
});

const Review = mongoose.model("Review", reviewSchema);



// Route to fetch car data
app.get("/cars", function (req, res) {
  Car.find()
    .then((cars) => {
      res.json(cars);
    })
    .catch((error) => {
      console.error("Error fetching cars:", error);
      res.status(500).json({ error: "Error fetching cars" });
    });
});

// Route to fetch reviews
app.get("/reviews", function (req, res) {
  Review.find()
    .then((reviews) => {
      res.json(reviews);
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Error fetching reviews" });
    });
});

// Add a route to handle POST requests for adding a review
app.post("/reviews", function (req, res) {
  // Retrieve the review data from the request body
  const { name, location, country, comments, rating } = req.body;

  // Create a new instance of the Review model
  const newReview = new Review({
    name,
    location,
    country,
    comments,
    rating,
  });

  // Save the new review to the database
  newReview
    .save()
    .then((savedReview) => {
      console.log("Review saved:", savedReview);
      res.json(savedReview); // Send the saved review as the response
    })
    .catch((error) => {
      console.error("Error saving review:", error);
      res.status(500).json({ error: "Error saving review" });
    });
});
// posting enquiries
const inquirySchema = new mongoose.Schema({
  maker: String,
  model: String,
  contacts: String,
  minengine: String,
  maxyear: String,
  maxdistance: String,
  maxengine: String,
  comments: String,
});

// Create an Inquiry model
const Inquiry = mongoose.model("Inquiry", inquirySchema);



// Route to handle form submission
app.post("/inquiries", (req, res) => {
  // Retrieve the inquiry data from the request body
  const {
    maker,
    model,
    contacts,
    minengine,
    maxyear,
    maxdistance,
    maxengine,
    maxprice,
    comments,
  } = req.body;

  // Create a new instance of the Inquiry model
  const newInquiry = new Inquiry({
    maker,
    model,
    contacts,
    minengine,
    maxyear,
    maxprice,
    maxdistance,
    maxengine,
    comments,
  });

  // Save the new inquiry to the database
  newInquiry
    .save()
    .then((savedInquiry) => {
      console.log("Inquiry saved:", savedInquiry);
      res.json(savedInquiry); // Send the saved inquiry as the response
    })
    .catch((error) => {
      console.error("Error saving inquiry:", error);
      res.status(500).json({ error: "Error saving inquiry" });
    });
    
});


  //register
// Create a user schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle registration form submission
app.post('/', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Generate a salt to use for hashing (the higher the rounds, the more secure but slower)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.get("/admin/:imageName", function (req, res) {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, "public/uploads", imageName));
});

//car reserves
const reserveSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  maker:String,
  model:String,
});

// Create a User model
const Reserve = mongoose.model('Reserve', reserveSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle registration form submission
app.post('/reserves', (req, res) => {
  const { name, phone, email, model, maker } = req.body;

  const newReserve = new Reserve({
    name,
    phone,
    email,
    model,
    maker,
  });

  newReserve.save()
   
  .then(() => {
      res.json({ message: 'Reserve registered successfully!' });
    })
    .catch((error) => {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    });
});


//login

//Middleware to parse JSON in the request body
app.use(express.json());

// Login route
app.post('/users', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', req.body);
  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password with the stored hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords don't match, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    console.log('Login response sent:', { message: 'Login successful' });
    // If the password is correct, send a success message indicating successful login
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});