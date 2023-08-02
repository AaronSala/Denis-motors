const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime');



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://dennis-motors.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


// Middleware to set the correcst MIME type for static files
app.use((req, res, next) => {
  const filePath = req.url.split('?')[0]; // Remove query parameters from URL
  const mimeType = mime.getType(filePath);

  if (mimeType) {
    res.set('Content-Type', mimeType);
  }

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
  description:String,
});

// Create a car model
const Car = mongoose.model('Car', carSchema);

// Create a storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

// Create the multer middleware using the storage configuration
const upload = multer({ storage: storage });

// Middleware

//Serve the HTML file for the root path
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});
//CORS Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Create a schema for sliders
// Create a schema for sliders
const sliderSchema = new mongoose.Schema({
  imagePath: String,
});

// Create a model for sliders
const Slider = mongoose.model('Slider', sliderSchema);

// Route to post a slider image
app.post('/slider', upload.single('image'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No image was uploaded.');
  }

  const imagePath = file.path;
  const slider = new Slider({ imagePath });

  slider
    .save()
    .then(() => {
      res.json({ imagePath });
    })
    .catch((error) => {
      console.error('Error adding slider:', error);
      res.status(500).send('Error adding slider.');
    });
});

// Route to get all slider images
app.get('/sliders', (req, res) => {
  Slider.find()
    .select('imagePath')
    .exec()
    .then((sliders) => {
      const imagePaths = sliders.map((slider) => slider.imagePath);
      res.json({ imagePaths });
    })
    .catch((error) => {
      console.error('Error fetching slider images:', error);
      res.status(500).send('Error fetching slider images.');
    });
});

// Route to delete a specific slider image
app.post('/slider/delete', (req, res) => {
  const imagePath = req.body.imagePath;

  Slider.findOneAndDelete({ imagePath })
    .then(() => {
      res.send('Slider image deleted successfully.');
    })
    .catch((error) => {
      console.error('Error deleting slider image:', error);
      res.status(500).send('Error deleting slider image.');
    });
});

// Rest of your server-side code.



// Handle POST request for creating a new car
app.post('/cars', function (req, res) {
  upload.array('images')(req, res, function (error) {
    if (error) {
      console.error('Error uploading images:', error);
      return res.status(500).send('Error uploading images');
    }

    const { maker, model, year, price, category, shape, mileage, engine,description } = req.body;
    const imagePaths = req.files.map(file => file.path);

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
    car.save()
      .then(() => {
        console.log('Car saved:', car);
        res.redirect('/');
      })
      .catch(error => console.error('Error saving car:', error));
  });
});


// Start the server


// Handle DELETE request for deleting a car
app.delete('/cars/:id', function (req, res) {
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
app.put('/cars/:id', upload.array('images'), function (req, res) {
  const carId = req.params.id;
  const { maker, model, year, price, shape, description, engine, category, mileage } = req.body;
  const imagePaths = req.files.map(file => file.path);

  // Find the car by its ID and update the fields
  Car.findByIdAndUpdate(carId, {
    maker,
    model,
    year,
    price,
    shape,
    description,
    engine,
    category,
    mileage,
    images: imagePaths
  }, { new: true })
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


// Handle GET request for retrieving all cars
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

// Fetching reviews for admin from the database
const reviewSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: String,
  comment: String,
});

const Review = mongoose.model('Review', reviewSchema);

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

// Handle PUT request for updating a review rating
app.put('/reviews/:id', function (req, res) {
  const reviewId = req.params.id;
  const newRating = 'good'; // Update the rating value as desired

  // Find the review by its ID and update the rating field
  Review.findByIdAndUpdate(reviewId, { rating: newRating }, { new: true })
    .then(updatedReview => {
      if (updatedReview) {
        console.log('Review updated:', updatedReview);
        res.json(updatedReview);
      } else {
        console.error('Review not found');
        res.status(404).json({ error: 'Review not found' });
      }
    })
    .catch(error => {
      console.error('Error updating rating:', error);
      res.status(500).json({ error: 'Error updating rating' });
    });
});
// Handle DELETE request for deleting a review
app.delete('/reviews/:id', function(req, res) {
  const reviewId = req.params.id;

  // Find the review by ID and delete it
  Review.findByIdAndRemove(reviewId)
    .then(() => {
      console.log('Review deleted:', reviewId);
      res.sendStatus(204); // Send a success status without content
    })
    .catch(error => {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Error deleting review' });
    });
});

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


//fetching enquireies
const Inquiries = mongoose.model('Inquiries', inquirySchema);

app.get('/inquiries', function (req, res) {
  Inquiries.find()
    .then(inquiries => {
      res.json(inquiries);
    })
    .catch(error => {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({ error: 'Error fetching inquiries' });
    });
});
// Delete an inquiry by ID
app.delete('/inquiries/:inquiryId', function(req, res) {
  const inquiryId = req.params.inquiryId;

  Inquiries.findByIdAndRemove(inquiryId)
    .then(deletedInquiry => {
      if (!deletedInquiry) {
        // Inquiry not found
        res.status(404).json({ error: 'Inquiry not found' });
      } else {
        console.log('Inquiry deleted:', deletedInquiry);
        res.json({ message: 'Inquiry deleted successfully' });
      }
    })
    .catch(error => {
      console.error('Error deleting inquiry:', error);
      res.status(500).json({ error: 'Error deleting inquiry' });
    });
});

// Assuming you have the 'reserves' model defined and imported
const reservationSchema = new mongoose.Schema({
  phone: String,
  name:  String,
  email: String,
  maker: String,
  model: String,
});

const Reserve = mongoose.model('Reserve', reservationSchema);

// Route to fetch and display reservations
app.get('/reserves', function (req, res) {
  Reserve.find()
    .then(reservations => {
      res.json(reservations);
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ error: 'Error fetching reservations' });
    });
});

// Route to delete a reservation by ID
app.delete('/reserves/:reservationId', function (req, res) {
  const reservationId = req.params.reservationId;

  Reserve.findByIdAndRemove(reservationId)
    .then(deletedReservation => {
      if (!deletedReservation) {
        // Reservation not found
        res.status(404).json({ error: 'Reservation not found' });
      } else {
        console.log('Reservation deleted:', deletedReservation);
        res.json({ message: 'Reservation deleted successfully' });
      }
    })
    .catch(error => {
      console.error('Error deleting reservation:', error);
      res.status(500).json({ error: 'Error deleting reservation' });
    });
});

// Start the server
app.listen(3005, function () {
  console.log('Server listening on port 3005');
});





