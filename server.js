const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mysql = require("mysql"); // or mariadb
const async = require("async"); // Import the async library
const fs = require("fs");

// MariaDB (MySQL) connection configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Change this to your MariaDB username
  password: "sala4492", // Change this to your MariaDB password
  database: "denisMotors",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
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
app.get("/cars", (req, res) => {
  connection.query("SELECT * FROM cars", (error, results, fields) => {
    if (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ error: "Error fetching cars" });
      return;
    }
    res.json(results);
  });
});

// Route to fetch reviews
app.get("/reviews", (req, res) => {
  connection.query("SELECT * FROM reviews", (error, results, fields) => {
    if (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Error fetching reviews" });
      return;
    }
    res.json(results);
  });
});

app.post("/reviews", (req, res) => {
  // Retrieve the review data from the request body
  const { name, location, country, comments, rating } = req.body;

  // Define the SQL query to insert a new review into the "reviews" table
  const query = {
    sql: "INSERT INTO reviews (name, location, country, comments, rating) VALUES (?, ?, ?, ?, ?)",
    values: [name, location, country, comments, rating],
  };

  // Execute the SQL query
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error saving review:", error);
      res.status(500).json({ error: "Error saving review" });
      return;
    }

    // Extract the inserted review ID from the results
    const savedReviewId = results.insertId;
    console.log("Review saved with ID:", savedReviewId);

    // Send the saved review ID as the response
    res.json({ id: savedReviewId });
  });
});

// Route to add a new inquiry
app.post("/inquiries", (req, res) => {
  try {
    // Retrieve the inquiry data from the request body
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

    // Define the SQL query to insert a new inquiry into the "inquiries" table
    const query = {
      sql: "INSERT INTO inquiries (maker, model, maxprice, minprice, comments, minengine, maxengine, maxyear, contacts, maxdistance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error("Error saving inquiry:", error);
        res.status(500).json({ error: "Error saving inquiry" });
        return;
      }

      // Extract the inserted inquiry ID from the results
      const savedInquiryId = results.insertId;
      console.log("Inquiry saved with ID:", savedInquiryId);

      // Send the saved inquiry ID as the response
      res.json({ id: savedInquiryId });
    });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({ error: "Error saving inquiry" });
  }
});

// Route for user registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("Registration request received:", req.body);
  try {
    // Check if the user already exists
    const userCheckQuery = `SELECT * FROM users WHERE email = ?`;
    connection.query(userCheckQuery, [email], async (error, results) => {
      if (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user into the database
      const insertQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;
      connection.query(insertQuery, [email, hashedPassword], (error) => {
        if (error) {
          console.error("Error during registration:", error);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        console.log("User registered successfully");
        res.json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to handle user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", req.body);
  try {
    // Query to find the user by email in the database
    const query = `SELECT * FROM users WHERE email = ?`;
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // If the user does not exist, return an error
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];

      // Compare the password with the stored hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If the passwords don't match, return an error
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      console.log("Login response sent:", { message: "Login successful" });
      // If the password is correct, send a success message indicating successful login
      res.json({ message: "Login successful" });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search route
app.get("/cars", async (req, res) => {
  const { search } = req.query;

  try {
    const regex = `%${search}%`; // Use % for wildcard search in MariaDB
    const query = `SELECT * FROM cars WHERE category LIKE ? OR maker LIKE ? OR year LIKE ? OR model LIKE ? OR shape LIKE ?`;
    const filteredCars = await connection.query(query, [
      regex,
      regex,
      regex,
      regex,
      regex,
    ]);
    res.json(filteredCars);
  } catch (error) {
    console.error("Error fetching car data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching car data." });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Use the original filename
    cb(null, file.originalname);
  },
});

// Route to handle file uploads
const upload = multer({ storage: storage });
app.post("/cars", upload.array("images"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const tempPaths = req.files.map((file) => file.path);
  const targetPaths = req.files.map((file) =>
    path.join(__dirname, "./images/", file.originalname)
  );

  // Move the uploaded files to the target directory
  async.eachOf(
    tempPaths,
    (tempPath, index, callback) => {
      fs.rename(tempPath, targetPaths[index], (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return callback(err);
        }
        callback();
      });
    },
    (err) => {
      if (err) {
        console.error("Error moving files:", err);
        return res.status(500).json({ error: "Error uploading files" });
      }
      res.json({ message: "Files uploaded successfully" });
    }
  );
});

/// Handle POST request for creating a new car
app.post("/admin/cars", upload.array("images"), function (req, res) {
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

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const imageNames = req.files.map((file) => file.originalname);
  const imageNamesString = JSON.stringify(imageNames);

  // Inserting car data into the MariaDB database in admin
  const query = `INSERT INTO cars (maker, model, year, price, category, shape, mileage, engine, description, image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    imageNamesString,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting car into database:", err);
      return res.status(500).send("Error inserting car into database");
    }
    console.log("Car inserted into database");
    res.redirect("/");
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

  // Define the SQL query to update the car information
  const query = `
    UPDATE cars
    SET maker = ?, model = ?, year = ?, price = ?, shape = ?, description = ?, engine = ?, category = ?, mileage = ?, image = ?
    WHERE id = ?
  `;

  // Define the values to be inserted into the query
  const values = [
    maker,
    model,
    year,
    price,
    shape,
    description,
    engine,
    category,
    mileage,
    imagePaths.join(","), // Convert array to comma-separated string
    carId,
  ];

  // Execute the SQL query
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating car:", err);
      return res.status(500).json({ error: "Error updating car" });
    }
    console.log("Car updated successfully");
    res.json({ message: "Car updated successfully" });
  });
});
// Handle DELETE request for deleting a car
app.delete("/admin/cars/:id", async (req, res) => {
  const carId = req.params.id;

  try {
    // Define the SQL query to delete the car by ID
    const query = `DELETE FROM cars WHERE id = ?`;

    // Execute the SQL query
    connection.query(query, [carId], (err, result) => {
      if (err) {
        console.error("Error deleting car:", err);
        return res.status(500).json({ error: "Error deleting car" });
      }

      // Check if a car was deleted
      if (result.affectedRows === 1) {
        console.log("Car deleted:", carId);
        res.sendStatus(204); // Send a success status without content
      } else {
        console.error("Car not found:", carId);
        res.status(404).json({ error: "Car not found" });
      }
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Error deleting car" });
  }
});

// Route to fetch all cars
app.get("/admin/cars", async (req, res) => {
  try {
    // Define the SQL query to fetch all cars
    const query = "SELECT * FROM cars";

    // Execute the SQL query
    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching cars:", err);
        return res.status(500).json({ error: "Error fetching cars" });
      }

      // Send the fetched cars as a JSON response
      res.json(result);
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// Fetch all slider images
// Fetch slider images with pagination
app.get("/sliders", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  try {
    // Define the SQL query with pagination
    const query = "SELECT * FROM sliders LIMIT ? OFFSET ?";
    const values = [limit, (page - 1) * limit];

    // Execute the SQL query
    connection.query(query, values, (error, result) => {
      if (error) {
        console.error("Error fetching slider images:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Extract slider image paths from the query result
      const sliderImages = result.map((row) => row.imagepath);

      // Send the slider images as a JSON response
      res.json({ sliderImages });
    });
  } catch (error) {
    console.error("Error fetching slider images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/sliders", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No image was uploaded.");
  }

  // Remove the "image-" prefix from the filename
  const filenameWithoutPrefix = file.filename.replace(/^image-/, "");

  const imagePath = filenameWithoutPrefix; // Using the modified filename

  const query = "INSERT INTO sliders (imagepath) VALUES (?)";
  const values = [imagePath];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error("Error adding slider:", error);
      return res.status(500).send("Error adding slider.");
    }

    res.json({ imagePath });
  });
});

// Delete a specific slider image
app.post("/slider/delete", async (req, res) => {
  try {
    const imagePath = req.body.imagePath;

    // Construct the query to delete the slider image from the database
    const query = "DELETE FROM sliders WHERE imagepath = ?";
    const values = [imagePath];

    await connection.query(query, values);

    res.send("Slider image deleted successfully.");
  } catch (error) {
    console.error("Error deleting slider image:", error);
    res.status(500).send("Error deleting slider image.");
  }
});

// Route to fetch inquiries
app.get("/inquiries", (req, res) => {
  try {
    const query = "SELECT * FROM inquiries";
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Error fetching inquiries:", error);
        return res.status(500).json({ error: "Error fetching inquiries" });
      }

      const inquiries = result;

      res.json(inquiries);
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ error: "Error fetching inquiries" });
  }
});

// Route to post reservations
app.post("/reserves", (req, res) => {
  // Retrieve the reservation data from the request body
  const { email, name, phone, maker, model } = req.body;

  // Define the SQL query to insert a new reservation into the "reservations" table
  const query = {
    sql: "INSERT INTO reserves (email, name, phone, maker, model) VALUES (?, ?, ?, ?, ?)",
    values: [email, name, phone, maker, model],
  };

  // Execute the SQL query
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error saving reservation:", error);
      res.status(500).json({ error: "Error saving reservation" });
      return;
    }

    // Send a success response
    res.json({ message: "Reservation saved successfully" });
  });
});

// Route to fetch reservations
app.get("/reserves", (req, res) => {
  try {
    const query = "SELECT * FROM reserves";
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Error fetching reservations:", error);
        return res.status(500).json({ error: "Error fetching reservations" });
      }

      const reservations = result;

      res.json(reservations);
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Error fetching reservations" });
  }
});

// Handle PUT request for updating a review rating
app.put("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const newRating = "good"; // Update the rating value as desired

  try {
    // Construct the query to update the rating for the review with the specified ID
    const query = {
      sql: "UPDATE reviews SET rating = ? WHERE id = ?",
      values: [newRating, reviewId],
    };

    // Execute the query to update the rating in the database
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Error updating rating:", error);
        return res.status(500).json({ error: "Error updating rating" });
      }

      if (result.affectedRows === 0) {
        // Review not found
        console.error("Review not found");
        res.status(404).json({ error: "Review not found" });
      } else {
        console.log("Review updated");
        res.sendStatus(200); // Success status
      }
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Error updating rating" });
  }
});

// Handle DELETE request for deleting a review
app.delete("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;

  try {
    // Construct the query to delete the review by ID from the database
    const query = {
      sql: "DELETE FROM reviews WHERE id = ?",
      values: [reviewId],
    };

    // Execute the query to delete the review
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ error: "Error deleting review" });
      }

      if (result.affectedRows === 0) {
        // Review not found
        console.error("Review not found");
        res.status(404).json({ error: "Review not found" });
      } else {
        console.log("Review deleted:", reviewId);
        res.sendStatus(204); // Send a success status without content
      }
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

// Route to delete a reservation by ID
app.delete("/reserves/:reservationId", function (req, res) {
  const reservationId = req.params.reservationId;

  try {
    // Construct the query to delete the reservation by ID from the database
    const query = {
      sql: "DELETE FROM reserves WHERE id = ?",
      values: [reservationId],
    };

    // Execute the query to delete the reservation
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Error deleting reservation:", error);
        return res.status(500).json({ error: "Error deleting reservation" });
      }

      if (result.affectedRows === 0) {
        // Reservation not found
        console.error("Reservation not found");
        res.status(404).json({ error: "Reservation not found" });
      } else {
        console.log("Reservation deleted:", reservationId);
        res.json({ message: "Reservation deleted successfully" });
      }
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Error deleting reservation" });
  }
});

// Delete an inquiry by ID
app.delete("/inquiries/:inquiryId", async (req, res) => {
  const inquiryId = req.params.inquiryId;

  try {
    // Construct the query to delete the inquiry by ID from the database
    const query = {
      sql: "DELETE FROM inquiries WHERE id = ?",
      values: [inquiryId],
    };

    // Execute the query
    connection.query(query, (error, result) => {
      if (error) {
        console.error("Error deleting inquiry:", error);
        return res.status(500).json({ error: "Error deleting inquiry" });
      }

      if (result.affectedRows === 0) {
        // Inquiry not found
        console.error("Inquiry not found");
        res.status(404).json({ error: "Inquiry not found" });
      } else {
        console.log("Inquiry deleted:", inquiryId);
        res.json({ message: "Inquiry deleted successfully" });
      }
    });
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
