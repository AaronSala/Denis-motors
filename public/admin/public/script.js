// Get the form element
//const carForm = document.getElementById('carForm');

// Add event listener for form submission
carForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting and page refresh

  // Get the form data
  const formData = new FormData(carForm);

  // Create an object to hold the car data
  const carData = {
    maker: formData.get('maker'),
    model: formData.get('model'),
    year: formData.get('year'),
    price: formData.get('price'),
    image: [],
    mileage: formData.get('mileage'),
    shape: formData.get('shape'),
    category: formData.get('category'),
    description: formData.get('description'),
    engine: formData.get('engine')
  };

  // Get the image files from the form data
  const imageFiles = formData.getAll('image');

  // Iterate over the image files and add them to the carData object
  for (let i = 0; i < imageFiles.length; i++) {
    carData.image.push(imageFiles[i]);
  }

  // Send a POST request to the server to save the car data
  axios.post('/cars', carData)
    .then(function(response) {
      console.log('Car added:', response.data);
      carForm.reset(); // Reset the form
      fetchAndDisplayCars(); // Fetch and display the updated car data
    })
    .catch(function(error) {
      console.error('Error adding car:', error);
    });
});

// Function to fetch and display the car data
function fetchAndDisplayCars() {
  // Send a GET request to the server to retrieve the car data
  axios.get('/cars')
    .then(function(response) {
      const carList = response.data;

      // Clear previous car list
      const carListElement = document.getElementById('carList');
      carListElement.innerHTML = '';

      // Iterate over the car list and create HTML elements to display each car
      carList.forEach(function(car) {
        const carElement = document.createElement('div');
        carElement.classList.add('car');

        const carImageElement = document.createElement('img');
        carImageElement.src = car.image[0]; // Display the first image
        carElement.appendChild(carImageElement);

        const carInfoElement = document.createElement('div');
        carInfoElement.innerHTML = `
          <h2>${car.maker} ${car.model}</h2>
          <p>Year: ${car.year}</p>
          <p>Price: ${car.price}</p>
          <p>Mileage: ${car.mileage}</p>
          <p>Engine: ${car.engine}</p>
          <p>Description: ${car.description}</p>
          <p>Shape: ${car.shape}</p>
          <p>Category: ${car.category}</p>
        `;
        carElement.appendChild(carInfoElement);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
          openEditForm(car._id, car.maker, car.model, car.year, car.price, car.shape, car.engine, car.category, car.description, car.mileage);
        });
        carElement.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          deleteCar(car._id);
        });
        carElement.appendChild(deleteButton);

        carListElement.appendChild(carElement);
      });
    })
    .catch(function(error) {
      console.error('Error fetching cars:', error);
    });
}

// Call the fetchAndDisplayCars function to load and display the initial car data
fetchAndDisplayCars();

// Function to open the edit form
function openEditForm(carId, maker, model, year, price, shape, engine, category, description, mileage) {
  // Populate the form fields with existing car data
  document.getElementById('editCarId').value = carId;
  document.getElementById('editMaker').value = maker;
  document.getElementById('editModel').value = model;
  document.getElementById('editYear').value = year;
  document.getElementById('editPrice').value = price;
  document.getElementById('editMileage').value = mileage;
  document.getElementById('editShape').value = shape;
  document.getElementById('editEngine').value = engine;
  document.getElementById('editCategory').value = category;
  document.getElementById('editDescription').value = description;
  
  // Show the edit form
  document.getElementById('editFormContainer').style.display = 'block';
}

// Function to handle form submission for updating a car
document.getElementById('editCarForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting and page refresh

  // Get the form data
  const formData = new FormData(this); // Use "new FormData(this)" instead of "new FormData(event.target)"

  // Create an object to hold the car data
  const carData = {
    carId: formData.get('editCarId'), // Use "editCarId" instead of "carId"
    maker: formData.get('editMaker'), // Use "editMaker" instead of "maker"
    model: formData.get('editModel'), // Use "editModel" instead of "model"
    year: formData.get('editYear'), // Use "editYear" instead of "year"
    price: formData.get('editPrice'), // Use "editPrice" instead of "price"
    shape: formData.get('editShape'), // Use "editShape" instead of "shape"
    engine: formData.get('editEngine'), // Use "editEngine" instead of "engine"
    category: formData.get('editCategory'), // Use "editCategory" instead of "category"
    mileage: formData.get('editMileage'), // Use "editMileage" instead of "mileage"
    description: formData.get('editDescription') // Use "editDescription" instead of "description"
  };

  const carId = formData.get('editCarId'); // Use "editCarId" instead of "carId"
  const imageFile = formData.get('editImage');

  // Create a new FormData object
  const updatedFormData = new FormData();
  // Append the car data to the updated form data
  Object.entries(carData).forEach(([key, value]) => {
    updatedFormData.append(key, value);
  });
  // Append the image file to the updated form data
  updatedFormData.append('image', imageFile);
  // Send a PUT request to the server to update the car data
  axios.put(`/cars/${carId}`,updatedFormData)
    .then(function(response) {
      console.log('Car updated:', response.data);
      closeEditForm(); // Close the edit form
      fetchAndDisplayCars(); // Fetch and display the updated car data
    })
    .catch(function(error) {
      console.error('Error updating car:', error);
    });
});

// Function to close the edit form
function closeEditForm() {
  // Clear the form fields
  document.getElementById('editCarId').value = '';
  document.getElementById('editMaker').value = '';
  document.getElementById('editModel').value = '';
  document.getElementById('editYear').value = '';
  document.getElementById('editPrice').value = '';
  document.getElementById('editMileage').value = '';
  document.getElementById('editShape').value = '';
  document.getElementById('editEngine').value = '';
  document.getElementById('editCategory').value = '';
  document.getElementById('editDescription').value = '';

  // Hide the edit form
  document.getElementById('editFormContainer').style.display = 'none';
}

// Function to delete a car
function deleteCar(carId) {
  // Send a DELETE request to the server to delete the car
  axios.delete(`/cars/${carId}`)
    .then(function() {
      console.log('Car deleted:', carId);
      fetchAndDisplayCars(); // Fetch and display the updated car data
    })
    .catch(function(error) {
      console.error('Error deleting car:', error);
    });
}
function fetchAndDisplayReviews() {
  // Send a GET request to the server to retrieve the customer reviews
  axios.get('/reviews')
    .then(function(response) {
      const reviewList = response.data;

      // Clear previous review list
      const reviewListElement = document.getElementById('reviewList');
      reviewListElement.innerHTML = '';
      // Iterate over the review list and create HTML elements to display each review
      reviewList.forEach(function(review) {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');

        // Combine all items for the review in a single div
        reviewElement.innerHTML = `
          <h2>${review.name}</h2>
          <p>location: ${review.location}</p>
          <p>Country: ${review.country}</p>
          <p>Rating: ${review.rating}</p>
          <p>Comment: ${review.comments}</p>
        `;

        const editButton = document.createElement('button');
        editButton.textContent = 'Post';
        editButton.addEventListener('click', function() {
          updateRating(review._id);
        });
        reviewElement.appendChild(editButton);

        reviewListElement.appendChild(reviewElement);
      });
    })
    .catch(function(error) {
      console.error('Error fetching reviews:', error);
    });
}

// Function to update the rating in the database
function updateRating(reviewId) {
  // Send a PUT request to update the rating
  axios.put(`/reviews/${reviewId}`, { rating: 'good' })
    .then(function(response) {
      console.log('Rating updated:', response.data);
      fetchAndDisplayReviews(); // Fetch and display the updated reviews
    })
    .catch(function(error) {
      console.error('Error updating rating:', error);
    });
}

// Call the fetchAndDisplayReviews function to load and display the customer reviews
fetchAndDisplayReviews();
