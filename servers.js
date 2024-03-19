const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "denisMotors",
  password: "sala4492",
  port: 5432,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error in idle client");
  process.exit(-1); // Fixed typo here
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Invoking bodyParser.json()

app.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM cars");
    const cars = result.rows;
    client.release();
    console.log("Fetched cars:", cars);
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Error fetching cars" }); // Sending error response
  }
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
