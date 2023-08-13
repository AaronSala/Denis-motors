const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
//const { MongoClient } = require('mongodb');
const path = require('path');
const mime = require('mime');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Assign the MongoDB Atlas connection string to the 'uri' variable
const uri = "mongodb+srv://salaaron2:sala4492@denis.kbbmsou.mongodb.net/dbname?retryWrites=true&w=majority";

async function connectToMongoDB() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // You can now perform operations on the database using the client object.
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

connectToMongoDB();


app.use(cors()); 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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
      //yconsole.log("Inquiry saved:", savedInquiry);
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


//signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Sign-up request received:', req.body);

  try {
    // Hash the password using bcrypt before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt round

    // Save the user information to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Send a success message for sign-up
    console.log('Sign-up response sent:', { message: 'Sign-up successful' });
    res.json({ message: 'Sign-up successful' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
const Users= mongoose.model('users', userSchema);
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
// Middleware to parse JSON requests


// Search route
app.get('/cars', async (req, res) => {
  const { search } = req.query;

  try {
    const regex = new RegExp(search, 'i'); // Case-insensitive search regex
    const filteredCars = await Car.find({
      $or: [
        { category: regex },
        { maker: regex },
        { year: { $regex: regex } },
        { model: regex },
        { shape: regex }
      ]
    });
    res.json(filteredCars);
  } catch (error) {
    console.error('Error fetching car data:', error);
    res.status(500).json({ error: 'An error occurred while fetching car data.' });
  }
});

// for slider
const Slider = mongoose.model('sliders', { 
  imagePath: String,
});

app.use(express.static('public')); 

app.get('/getSliderImages', async (req, res) => {
  try {
    const sliderImages = await Slider.find();
    res.json({ sliderImages }); 
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});
// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});