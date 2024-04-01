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
  database: "denisMotors",
  password: "sala4492",
  port: 5432,
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Route to fetch car data
app.get("/api/cars", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM cars");
    const cars = result.rows;
    client.release();
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// Route to fetch reviews
app.get("/reviews", async (req, res) => {
  try {
    const query = "SELECT * FROM reviews"; // SQL query to select all records from the 'reviews' table
    const result = await pool.query(query);
    const reviews = result.rows;
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// Add a route to handle POST requests for adding a review
app.post("/reviews", async (req, res) => {
  try {
    // Retrieve the review data from the request body
    const { name, location, country, comments, rating } = req.body;

    // Define the SQL query to insert a new review into the "reviews" table
    const query = {
      text: "INSERT INTO reviews (name, location, country, comments, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      values: [name, location, country, comments, rating],
    };

    // Execute the SQL query
    const result = await pool.query(query);

    // Extract the inserted review from the query result
    const savedReview = result.rows[0];

    console.log("Review saved:", savedReview);
    res.json(savedReview); // Send the saved review as the response
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Error saving review" });
  }
});

// Route to add a new inquiry
app.post("/inquiries", async (req, res) => {
  try {
    // Retrieve the review data from the request body
    const {
      maker,
      model,
      maxprice,
      minprice,
      comments,
      maxyear,
      contacts,
      maxengine,
      minengine,
      maxdistance,
    } = req.body;

    // Define the SQL query to insert a new review into the "reviews" table
    const query = {
      text: "INSERT INTO inquiries (maker, model, maxprice, minprice, minengine,maxengine, comments, maxdistance, contacts,maxyear) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      values: [
        maker,
        model,
        maxprice,
        minprice,
        comments,
        minengine,
        maxengine,
        maxyear,
        contacts,
        maxdistance,
      ],
    };

    // Execute the SQL query
    const result = await pool.query(query);

    // Extract the inserted review from the query result
    const savedReview = result.rows[0];

    console.log("inquery saved:", savedReview);
    res.json(savedReview); // Send the saved review as the response
  } catch (error) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({ error: "Error saving inquiry" });
  }
});

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
app.get("/images/:imagepath", function (req, res) {
  const imagepath = req.params.imagepath;
  res.sendFile(path.join(__dirname, "images", imagepath)); //images are stored in a folder named 'images'
});

// Handle reservation form submission
app.post("/api/reserves", async (req, res) => {
  const { name, phone, email, model, maker } = req.body;

  const insertQuery =
    "INSERT INTO reserves (name, phone, email, model, maker) VALUES ($1, $2, $3, $4, $5)";
  const values = [name, phone, email, model, maker];

  try {
    await pool.query(insertQuery, values);
    res.json({ message: "Reserve registered successfully!" });
  } catch (error) {
    console.error("Error registering reservation:", error);
    res.status(500).json({ error: "Error registering reservation" });
  }
});

// Route for user sign-up
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Sign-up request received:", req.body);

  try {
    // Hash the password using bcrypt before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt round

    // Connect to the PostgreSQL database
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();

    // Insert the new user into the database
    const query = {
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      values: [username, email, hashedPassword],
    };
    const result = await client.query(query);

    // Close the database connection
    await client.end();

    // Check if the user was successfully inserted
    if (result.rowCount === 1) {
      // Send a success message for sign-up
      console.log("Sign-up response sent:", { message: "Sign-up successful" });
      res.json({ message: "Sign-up successful" });
    } else {
      // If insertion failed, send an error response
      console.error("Error inserting user into database");
      res.status(500).json({ error: "Error inserting user into database" });
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("Registration request received:", req.body);
  try {
    // Check if the user already exists
    const userCheckQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const userCheckResult = await pool.query(userCheckQuery);

    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const insertQuery = {
      text: "INSERT INTO users (email, password) VALUES ($1, $2)",
      values: [email, hashedPassword],
    };

    // Execute the insert query
    await pool.query(insertQuery);

    console.log("User registered successfully");

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", req.body);
  try {
    // Query to find the user by email in the database
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    // Execute the query
    const result = await pool.query(query);

    // If the user does not exist, return an error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

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

// Create a storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//admin routes
// Route to fetch all cars
// app.get("/admin/cars", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("SELECT * FROM cars");
//     client.release(); // Release the client back to the pool
//     res.json(result.rows); // Send the result (array of cars) as JSON response
//   } catch (err) {
//     console.error("Error executing query", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Create the multer middleware using the storage configuration
const upload = multer({ storage: storage });

// Handle POST request for creating a new car
app.post("/admin/cars", function (req, res) {
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

    // Extract only the file names without any directory prefixes
    const imageNames = req.files.map((file) =>
      path.basename(file.originalname)
    );

    // Inserting car data into the PostgreSQL database in admin
    const query = `INSERT INTO cars (maker, model, year, price, category, shape, mileage, engine, description, image) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const values = [
      maker,
      model,
      year,
      price,
      category,
      shape,
      mileage,
      engine,
      description,
      imageNames,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting car into database:", err);
        return res.status(500).send("Error inserting car into database");
      }
      console.log("Car inserted into database");
      res.redirect("/");
    });
  });
});
// Handle PUT request for updating a car
app.put("/admin/cars/:id", upload.array("images"), function (req, res) {
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
      image: imagePaths,
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
app.delete("/admin/cars/:id", async (req, res) => {
  const carId = req.params.id;

  try {
    // Delete the car by ID
    const query = {
      text: "DELETE FROM cars WHERE id = $1",
      values: [carId],
    };
    const result = await pool.query(query);

    if (result.rowCount === 1) {
      console.log("Car deleted:", carId);
      res.sendStatus(204); // Send a success status without content
    } else {
      console.error("Car not found:", carId);
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Error deleting car" });
  }
});

// Route to fetch all cars
app.get("/admin/cars", async (req, res) => {
  try {
    // Fetch all cars from the database
    const query = "SELECT * FROM cars";
    const result = await pool.query(query);
    const cars = result.rows;
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// Fetch all slider images
app.get("/sliders", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  try {
    const query = {
      text: "SELECT * FROM sliders OFFSET $1 LIMIT $2",
      values: [(page - 1) * limit, limit],
    };
    const result = await pool.query(query);
    const sliderImages = result.rows.map((row) => row.imagepath);
    res.json({ sliderImages }); // Ensure the key is 'sliderImages'
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

  // Remove the "image-" prefix from the filename
  const filenameWithoutPrefix = file.filename.replace(/^image-/, "");

  const imagePath = filenameWithoutPrefix; // Using the modified filename

  const query = {
    text: "INSERT INTO sliders (imagepath) VALUES ($1) RETURNING *",
    values: [imagePath],
  };

  pool
    .query(query)
    .then((result) => {
      const insertedImagePath = result.rows[0].imagepath;
      res.json({ imagePath: insertedImagePath });
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

    // Construct the query to delete the slider image from the database
    const query = {
      text: "DELETE FROM sliders WHERE imagepath = $1",
      values: [imagePath],
    };
    await pool.query(query);

    res.send("Slider image deleted successfully.");
  } catch (error) {
    console.error("Error deleting slider image:", error);
    res.status(500).send("Error deleting slider image.");
  }
});

/// Route to fetch inquiries
app.get("/inquiries", async (req, res) => {
  try {
    const query = "SELECT * FROM inquiries";
    const result = await pool.query(query);

    const inquiries = result.rows;

    res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ error: "Error fetching inquiries" });
  }
});

// Route to fetch and display reservations

app.get("/reserves", async (req, res) => {
  try {
    const query = "SELECT * FROM inquiries";
    const result = await pool.query(query);

    const inquiries = result.rows;

    res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ error: "Error fetching inquiries" });
  }
});

// Handle PUT request for updating a review rating
app.put("/reviews/:id", async (req, res) => {
  const reviewId = req.params.id;
  const newRating = "good"; // Update the rating value as desired

  try {
    // Construct the query to update the rating for the review with the specified ID
    const query = {
                 text: "UPDATE reviews SET rating = $1 WHERE id = $2 RETURNING *",
      values: [newRating, reviewId],
    };

    // Execute the query to update the rating in the database
    const result = await pool.query(query);  knk

    if (result.rowCount === 0) {
      // Review not found
      console.error("Review not found");
      res.status(404).json({ error: "Review not found" });
    } else {
      const updatedReview = result.rows[0];
      console.log("Review updated:", updatedReview);
      res.json(updatedReview);
    }
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Error updating rating" });
  }
});

// Handle DELETE request for deleting a review
app.delete("/reviews/:id", async (req, res) => {
  const reviewId = req.params.id;

  try {
    // Construct the query to delete the review by ID from the database
    const query = {
      text: "DELETE FROM reviews WHERE id = $1",
      values: [reviewId],
    };
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      // Review not found
      res.status(404).json({ error: "Review not found" });
    } else {
      console.log("Review deleted:", reviewId);
      res.sendStatus(204); // Send a success status without content
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
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
app.delete("/inquiries/:inquiryId", async (req, res) => {
  const inquiryId = req.params.inquiryId;

  try {
    // Construct the query to delete the inquiry by ID from the database
    const query = {
      text: "DELETE FROM inquiries WHERE id = $1 RETURNING *",
      values: [inquiryId],
    };

    // Execute the query
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      // Inquiry not found
      res.status(404).json({ error: "Inquiry not found" });
    } else {
      console.log("Inquiry deleted:", result.rows[0]);
      res.json({ message: "Inquiry deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ error: "Error deleting inquiry" });
  }
});

// Start the server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
