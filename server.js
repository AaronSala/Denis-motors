const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const multer = require("multer");

const path = require("path");

const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "sala4492",
  port: 5432, // Change if necessary
});

pool.on("error", (err, pool) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Route to fetch car data
app.get("/cars", async (req, res) => {
  try {
    const database =pool.db("denis");
    const collection = database.collection("cars");
    const cars = await collection.find({}).toArray();
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// Route to fetch reviews
app.get("/reviews", async (req, res) => {
  try {
    const database = pool.db("denis"); // Replace dbname with your DB name
    const collection = database.collection("reviews"); // Replace reviews with your collection name
    const reviews = await collection.find({}).toArray();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});
//const Review = require("./models/Review");
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

// Route to fetch inquiries
app.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await Inquiries.find({}); // Use the Inquiries model to find all inquiries
    res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ error: "Error fetching inquiries" });
  }
});

// Route to add a new inquiry
app.post("/inquiries", async (req, res) => {
  const {
    maker,
    model,
    contacts,
    minengine,
    maxyear,
    maxdistance,
    maxengine,
    comments,
  } = req.body;

  try {
    // Create a new instance of the Inquiries model
    const newInquiry = new Inquiries({
      maker,
      model,
      contacts,
      minengine,
      maxyear,
      maxdistance,
      maxengine,
      comments,
    });

    // Save the new inquiry to the database
    await newInquiry.save();

    res.json({ message: "Inquiry added successfully!" });
  } catch (error) {
    console.error("Error adding inquiry:", error);
    res.status(500).json({ error: "Error adding inquiry" });
  }
});

// Create a user schema



// Handle registration form submission
app.post("/register", async (req, res) => {
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
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Serve images by name
app.get("/images/:imageName", function (req, res) {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, "images", imageName)); // assuming images are stored in a folder named 'images'
});

//car reserves
const reserveSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  maker: String,
  model: String,
});

// Create a User model
const Reserve = mongoose.model("Reserve", reserveSchema);

// Handle registration form submission
app.post("/reserves", (req, res) => {
  const { name, phone, email, model, maker } = req.body;

  const newReserve = new Reserve({
    name,
    phone,
    email,
    model,
    maker,
  });

  newReserve
    .save()

    .then(() => {
      res.json({ message: "Reserve registered successfully!" });
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    });
});

//signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Sign-up request received:", req.body);

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
    console.log("Sign-up response sent:", { message: "Sign-up successful" });
    res.json({ message: "Sign-up successful" });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", req.body);
  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password with the stored hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords don't match, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    console.log("Login response sent:", { message: "Login successful" });
    // If the password is correct, send a success message indicating successful login
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search route
app.get("/cars", async (req, res) => {
  const { search } = req.query;

  try {
    const regex = new RegExp(search, "i"); // Case-insensitive search regex
    const filteredCars = await Cars.find({
      $or: [
        { category: regex },
        { maker: regex },
        { year: { $regex: regex } },
        { model: regex },
        { shape: regex },
      ],
    });
    res.json(filteredCars);
  } catch (error) {
    console.error("Error fetching car data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching car data." });
  }
});

// Create a car schema
const carsSchema = new mongoose.Schema({
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
const Cars = mongoose.model("Cars", carsSchema);

// Create a storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Create the multer middleware using the storage configuration
const upload = multer({ storage: storage });

// Handle POST request for creating a new car
app.post("/cars", function (req, res) {
  upload.array("images")(req, res, function (error) {
    if (error) {
      console.error("Error uploading images:", error);
      return res.status(500).send("Error uploading images");
    }

    const {
      maker,
      model,
      year,
      price,
      category,
      shape,
      mileage,
      engine,
      description,
    } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    // Create a new car object
    const car = new Car({
      maker,
      model,
      year,
      images: imagePaths,
      price,
      category,
      shape,
      mileage,
      engine,
      description,
    });

    // Save the car object to the database
    car
      .save()
      .then(() => {
        console.log("Car saved:", car);
        res.redirect("/");
      })
      .catch((error) => console.error("Error saving car:", error));
  });
});
// Handle PUT request for updating a car
app.put("/cars/:id", upload.array("images"), function (req, res) {
  const carId = req.params.id;
  const {
    maker,
    model,
    year,
    price,
    shape,
    description,
    engine,
    category,
    mileage,
  } = req.body;
  const imagePaths = req.files.map((file) => file.path);

  // Find the car by its ID and update the fields
  Cars.findByIdAndUpdate(
    carId,
    {
      maker,
      model,
      year,
      price,
      shape,
      description,
      engine,
      category,
      mileage,
      images: imagePaths,
    },
    { new: true }
  )
    .then((updatedCar) => {
      if (updatedCar) {
        console.log("Car updated:", updatedCar);
        res.json(updatedCar);
      } else {
        console.error("Car not found");
        res.status(404).json({ error: "Car not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating car:", error);
      res.status(500).json({ error: "Error updating car" });
    });
});

// Handle DELETE request for deleting a car
app.delete("/cars/:id", function (req, res) {
  const carId = req.params.id;

  // Find the car by ID and delete it
  Cars.findByIdAndRemove(carId)
    .then(() => {
      console.log("Car deleted:", carId);
      res.sendStatus(204); // Send a success status without content
    })
    .catch((error) => {
      console.error("Error deleting car:", error);
      res.status(500).json({ error: "Error deleting car" });
    });
});

app.get("/cars", function (req, res) {
  Cars.find()
    .then((cars) => {
      res.json(cars);
    })
    .catch((error) => {
      console.error("Error fetching cars:", error);
      res.status(500).json({ error: "Error fetching cars" });
    });
});

const sliderSchema = new mongoose.Schema({
  imagePath: String,
});

const Sliders = mongoose.model("sliders", sliderSchema);

// Fetch all slider images
app.get("/sliders", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const sliderImages = await Sliders.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("imagePath");
    res.json({ sliderImages });
  } catch (error) {
    console.error("Error fetching slider images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Upload a new slider image
app.post("/sliders", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No image was uploaded.");
  }

  const imagePath = `images/${file.filename}`;
  const slider = new Sliders({ imagePath });

  slider
    .save()
    .then(() => {
      res.json({ imagePath });
    })
    .catch((error) => {
      console.error("Error adding slider:", error);
      res.status(500).send("Error adding slider.");
    });
});

// Delete a specific slider image
app.post("/slider/delete", async (req, res) => {
  try {
    const imagePath = req.body.imagePath;
    await Sliders.findOneAndDelete({ imagePath });
    res.send("Slider image deleted successfully.");
  } catch (error) {
    console.error("Error deleting slider image:", error);
    res.status(500).send("Error deleting slider image.");
  }
});

//inquiry
const inquirSchema = new mongoose.Schema({
  maker: String,
  model: String,
  contacts: String,
  minengine: String,
  maxyear: String,
  maxdistance: String,
  maxengine: String,
  comments: String,
});

//fetching enquireies
const Inquiries = mongoose.model("Inquiries", inquirSchema);

app.get("/inquiries", function (req, res) {
  Inquiries.find()
    .then((inquiries) => {
      res.json(inquiries);
    })
    .catch((error) => {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ error: "Error fetching inquiries" });
    });
});
// reserves fetch
const reservationSchema = new mongoose.Schema({
  phone: String,
  name: String,
  email: String,
  maker: String,
  model: String,
});

const Reserves = mongoose.model("Reserves", reservationSchema);

// Route to fetch and display reservations
app.get("/reserves", function (req, res) {
  Reserves.find()
    .then((reservations) => {
      res.json(reservations);
    })
    .catch((error) => {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ error: "Error fetching reservations" });
    });
});

// Handle PUT request for updating a review rating
app.put("/reviews/:id", function (req, res) {
  const reviewId = req.params.id;
  const newRating = "good"; // Update the rating value as desired

  // Find the review by its ID and update the rating field
  Review.findByIdAndUpdate(reviewId, { rating: newRating }, { new: true })
    .then((updatedReview) => {
      if (updatedReview) {
        console.log("Review updated:", updatedReview);
        res.json(updatedReview);
      } else {
        console.error("Review not found");
        res.status(404).json({ error: "Review not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating rating:", error);
      res.status(500).json({ error: "Error updating rating" });
    });
});
// Handle DELETE request for deleting a review
app.delete("/reviews/:id", function (req, res) {
  const reviewId = req.params.id;

  // Find the review by ID and delete it
  Review.findByIdAndRemove(reviewId)
    .then(() => {
      console.log("Review deleted:", reviewId);
      res.sendStatus(204); // Send a success status without content
    })
    .catch((error) => {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Error deleting review" });
    });
});
// Route to delete a reservation by ID
app.delete("/reserves/:reservationId", function (req, res) {
  const reservationId = req.params.reservationId;

  Reserve.findByIdAndRemove(reservationId)
    .then((deletedReservation) => {
      if (!deletedReservation) {
        // Reservation not found
        res.status(404).json({ error: "Reservation not found" });
      } else {
        console.log("Reservation deleted:", deletedReservation);
        res.json({ message: "Reservation deleted successfully" });
      }
    })
    .catch((error) => {
      console.error("Error deleting reservation:", error);
      res.status(500).json({ error: "Error deleting reservation" });
    });
});
// Delete an inquiry by ID
app.delete("/inquiries/:inquiryId", function (req, res) {
  const inquiryId = req.params.inquiryId;

  Inquiries.findByIdAndRemove(inquiryId)
    .then((deletedInquiry) => {
      if (!deletedInquiry) {
        // Inquiry not found
        res.status(404).json({ error: "Inquiry not found" });
      } else {
        console.log("Inquiry deleted:", deletedInquiry);
        res.json({ message: "Inquiry deleted successfully" });
      }
    })
    .catch((error) => {
      console.error("Error deleting inquiry:", error);
      res.status(500).json({ error: "Error deleting inquiry" });
    });
});
// Start the server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
