// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
// const { Pool } = require("pg");
// const path = require("path");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "denisMotors",
//   password: "sala4492",
//   port: 5432,
// });

// pool.on("error", (err, client) => {
//   console.error("Unexpected error in idle client");
//   process.exit(-1);
// });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Route to fetch JSON data
// app.get("/api/cars", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("SELECT * FROM cars");
//     const cars = result.rows;
//     client.release();
//     res.json(cars);
//   } catch (error) {
//     console.error("Error fetching cars:", error);
//     res.status(500).json({ error: "Error fetching cars" });
//   }
// });

// // Route to serve HTML file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "admin.html"));
// });

// const PORT = 4001;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
