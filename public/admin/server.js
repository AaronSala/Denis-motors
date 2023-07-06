const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');


// Connect to MongoDB
mongoose.connect('mongodb://localhost/denis', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Create a car schema
const carSchema = new mongoose.Schema({
  maker: String,
  model: String,
  year: Number,
  image: String,
  price: Number,
  category: String,
  shape: String,
  description: String,
  engine: String,
  mileage: String,
});

// Create a car model
const Car = mongoose.model('Car', carSchema);

// Create a storage configuration for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads'); // Specify the destination folder for uploaded files
  },
  filename: function(req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Create the multer middleware using the storage configuration
const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the HTML file for the root path
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Set the MIME type for JavaScript files
app.use('/server.js', (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript');
  next();
});

// Handle POST request for creating a new car
app.post('/cars', upload.single('image'), function(req, res) {
  const { maker, model, image, year, price, mileage, category, engine, description, shape } = req.body;
  const imagePath = req.file ?'/uploads/'+ req.file.filename : ' '; // Get the file name from the uploaded image

  // Create a new car object
  const car = new Car({
    maker,
    model,
    image,
    year,
    price,
    mileage,
    category,
    engine,
    description,
    shape,
    image: imagePath // Assign the file name to the image field
  });

  // Save the car object to the database
  car.save()
    .then(() => {
      console.log('Car saved:', car);
      res.redirect('/');
    })
    .catch(error => console.error('Error saving car:', error));
});
// Handle DELETE request for deleting a car
app.delete('/cars/:id', function(req, res) {
  const carId = req.params.id;

  // Find the car by ID and delete it
  Car.findByIdAndRemove(carId)
    .then(() => {
      console.log('Car deleted:', carId);
      res.sendStatus(204); // Send a success status without content
    })
    .catch(error => {
      console.error('Error deleting car:', error);
      res.status(500).json({ error: 'Error deleting car' });
    });
});


// Handle PUT request for updating a car
app.put('/cars/:id', function(req, res) {
  const carId = req.params.id;
  const { maker, model, year, price, shape, mileage, description, engine, category } = req.body;

  // Find the car by its ID and update the fields
  Car.findByIdAndUpdate(carId, { maker, model, year, price,shape, mileage, description, engine, category  }, { new: true })
    .then(updatedCar => {
      if (updatedCar) {
        console.log('Car updated:', updatedCar);
        res.json(updatedCar);
      } else {
        console.error('Car not found');
        res.status(404).json({ error: 'Car not found' });
      }
    })
    .catch(error => {
      console.error('Error updating car:', error);
      res.status(500).json({ error: 'Error updating car' });
    });
});


// ... existing code ...


// Handle GET request for retrieving all cars
app.get('/cars', function(req, res) {
  Car.find()
    .then(cars => {
      res.json(cars);
    })
    .catch(error => {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Error fetching cars' });
    });
});

// Start the server
app.listen(3001, function() {
  console.log('Server listening on port 3001');
});

// login form
