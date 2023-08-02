// Add event listener for form submission
// Function to handle form submission for adding a new car
// Prevent form from submitting and page refresh
const carForm = document.getElementById('carForm');

carForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the form inputs by their IDs
  const makerInput = document.getElementById('maker');
  const modelInput = document.getElementById('model');
  const yearInput = document.getElementById('year');
  const priceInput = document.getElementById('price');
  const categoryInput = document.getElementById('category');
  const shapeInput = document.getElementById('shape');
  const mileageInput = document.getElementById('mileage');
  const engineInput = document.getElementById('engine');
  const descriptionInput = document.getElementById('description');
  const imageInput = document.getElementById('image');

  // Create an object to hold the car data
  const carData = {
    maker: makerInput.value,
    model: modelInput.value,
    year: yearInput.value,
    price: priceInput.value,
    category: categoryInput.value,
    shape: shapeInput.value,
    mileage: mileageInput.value,
    engine: engineInput.value,
    description: descriptionInput.value
  };

  // Get the selected images from the file input
  const images = Array.from(imageInput.files);

  // Create a new FormData object
  const formData = new FormData();

  // Append the car data to the formData object
  for (const key in carData) {
    formData.append(key, carData[key]);
  }

  // Append the selected images to the formData object
  images.forEach((image, index) => {
    formData.append('images', image);
  });

  // Send a POST request to the server to save the car data
  axios.post('/cars', formData)
    .then(function(response) {
      console.log('Car added:', response.data);
      carForm.reset(); // Reset the form
    })
    .catch(function(error) {
      console.error('Error adding car:', error);
    });
});

//adding slider
const sliderForm = document.getElementById('sliderForm');

sliderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData();
  const imageInput = document.getElementById('imageInput');
  const image = imageInput.files[0]; // Get the first selected image

  formData.append('image', image); // Append the image to the formData
  axios
    .post('/slider', formData)
    .then(function (response) {
      const imagePath = response.data.imagePath;
      console.log('Image uploaded:', imagePath);
      sliderForm.reset(); // Reset the form
      fetchSliderImage(); // Fetch and display the updated slider image
    })
    .catch(function (error) {
      console.error('Error adding slider:', error);
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
        const imageFileNames = car.images[0].split('/').pop();
        const carElement = document.createElement('div');
        carElement.classList.add('car');

        const carImageElement = document.createElement('img');
        carImageElement.src =`uploads/${imageFileNames}`; // Display the first image
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

        const editButton = document.createElement('button1');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
          openEditForm(car._id, car.maker, car.model, car.year, car.price, car.shape, car.engine, car.category, car.description, car.mileage);
        });
        carElement.appendChild(editButton);

        const deleteButton = document.createElement('button2');
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

document.getElementById('editCarForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form from submitting and page refresh

  // Get the form data
  const formData = new FormData(this);

  // Create a new FormData object
  const updatedFormData = new FormData();

  // Append the car data to the updated form data
  updatedFormData.append('carId', formData.get('editCarId'));
  updatedFormData.append('maker', formData.get('editMaker'));
  updatedFormData.append('model', formData.get('editModel'));
  updatedFormData.append('year', parseInt(formData.get('editYear'), 10)); // Convert the year to a number
  updatedFormData.append('price', formData.get('editPrice'));
  updatedFormData.append('shape', formData.get('editShape'));
  updatedFormData.append('engine', formData.get('editEngine'));
  updatedFormData.append('category', formData.get('editCategory'));
  updatedFormData.append('mileage', formData.get('editMileage'));
  updatedFormData.append('description', formData.get('editDescription'));

  // Get the image file input
  const imageFileInput = document.getElementById('editImages');
  // Get the selected image files (if any)
  const selectedImageFiles = imageFileInput.files;

  for (let i = 0; i < selectedImageFiles.length; i++) {
    updatedFormData.append('images', selectedImageFiles[i]); // Append each image file separately using the same key 'images'
  }

  // Get the car ID
  const carId = formData.get('editCarId');

  // Send a PUT request to the server to update the car data
  axios.put(`/cars/${carId}`, updatedFormData)
    .then(function (response) {
      console.log('Car updated:', response.data);
      closeEditForm(); // Close the edit form
      fetchAndDisplayCars(); // Fetch and display the updated car data
    })
    .catch(function (error) {
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

// Function to fetch and display customer reviews
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
          <p>location: <span>${review.location}</span></p>
          <p>Country: <span>${review.country}</span></p>
          <p>Rating: <span>${review.rating}</span></p>
          <p>Comment: <span>${review.comments}</span></p>
        `;
        // posting button to the user side
        const editButton = document.createElement('button');
        editButton.textContent = 'Post';
        editButton.addEventListener('click', function() {
          updateRating(review._id);
        });
        reviewElement.appendChild(editButton);

        //delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          deleteReview(review._id);
        });
        reviewElement.appendChild(deleteButton);

        reviewListElement.appendChild(reviewElement);
      });
    })
    .catch(function(error) {
      console.error('Error fetching reviews:', error);
    });
}

// Call the fetchAndDisplayReviews function to load and display the customer reviews
fetchAndDisplayReviews();

// Function for deleting a review
function deleteReview(reviewId) {
  // Send a DELETE request to the server to delete the review
  axios.delete(`/reviews/${reviewId}`)
    .then(function() {
      console.log('Review deleted:', reviewId);
      fetchAndDisplayReviews(); // Fetch and display the updated reviews
    })
    .catch(function(error) {
      console.error('Error deleting review:', error);
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

// Function for fetching and displaying inquiries
function fetchAndDisplayInquiries() {
  fetch('/inquiries')
    .then(response => response.json())
    .then(inquiryList => {
      const inquiryListElement = document.getElementById('inquiryList');
      inquiryListElement.innerHTML = '';

      // Iterate over the inquiry list and create HTML elements to display each inquiry
      inquiryList.forEach(inquiry => {
        const inquiryElement = document.createElement('div');
        inquiryElement.classList.add('inquiry');

        // Populate the HTML elements with inquiry data
        inquiryElement.innerHTML = `
          <p>Maker: <span>${inquiry.maker}</span><p>
          <p>Model: <span>${inquiry.model}</span></p>
          <p>Contacts: <span>${inquiry.contacts}</span></p>
          <p>MinEngineSize: <span>${inquiry.minengine}</span></p>
          <p>MaxYear: <span>${inquiry.maxyear}</span></p>
          <p>MaxDistance: <span>${inquiry.maxdistance}</span></p>
          <p>MaxEngineSize: <span>${inquiry.maxengine}</span></p>
          <p>Comments: <span>${inquiry.comments}</span></p>
        `;

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteInquiry(inquiry._id));
        inquiryElement.appendChild(deleteButton);

        inquiryListElement.appendChild(inquiryElement);
      });
    })
    .catch(error => {
      console.error('Error fetching inquiries:', error);
    });
}

// Function for deleting an inquiry
function deleteInquiry(inquiryId) {
  fetch(`/inquiries/${inquiryId}`, {
    method: 'DELETE'
  })
    .then(() => {
      console.log('Inquiry deleted:', inquiryId);
      fetchAndDisplayInquiries(); // Fetch and display the updated inquiries
    })
    .catch(error => {
      console.error('Error deleting inquiry:', error);
    });
}

// Fetch and display inquiries immediately on page load
fetchAndDisplayInquiries();

//fetching reservations

function fetchAndDisplayReservations() {
  fetch('/reserves')
    .then(response => response.json()) // Parse the response as JSON
    .then(reservations => {
      const reservationListElement = document.getElementById('reservations');
      reservationListElement.innerHTML = '';

      // Iterate over the reservation list and create HTML elements to display each reservation
      reservations.forEach(reservation => {
        const reservationElement = document.createElement('div');
        reservationElement.classList.add('reservation');

        // Populate the HTML elements with reservation data
        reservationElement.innerHTML = `
          <p>Name: <span>${reservation.name}</span></p>
          <p>Phone: <span>${reservation.phone}</span></p>
          <p>Email: <span>${reservation.email}</span></p>
          <p>Maker: <span>${reservation.maker}</span></p>
          <p>Model: <span>${reservation.model}</span></p>
        `;

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteReservation(reservation._id));
        reservationElement.appendChild(deleteButton);

        reservationListElement.appendChild(reservationElement);
      });
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
    });
}

  // Fetch and display reservations immediately on page load
  fetchAndDisplayReservations();

// Add some console.log statements to track the flow of data and variable values
function deleteReservation(reservationId) {
  console.log('Reservation ID:', reservationId); // Check if reservationId is passed correctly
  fetch(`/reserves/${reservationId}`, {
    method: 'DELETE'
  })
    .then(() => {
      console.log('Reservation deleted:', reservationId);
      fetchAndDisplayReservations(); // Fetch and display the updated reservations
    })
    .catch(error => {
      console.error('Error deleting reservation:', error);
    });
}


  
  document.getElementById('logoutButton').addEventListener('click', handleLogout);
function handleLogout() {
  // Remove the token from Local Storage
  localStorage.removeItem('token');

  // Redirect the user to the login page or any other desired page
  window.location.href = './public/index.html'; 
}

//fetching and deleting sliders
function fetchSliderImages() {
  axios
    .get('/sliders')
    .then(function (response) {
      const imagePaths = response.data.imagePaths;
      

      // Get the slider container
      const sliderContainer = document.getElementById('sliders');
      sliderContainer.innerHTML = ''; // Clear the container

      
      imagePaths.forEach((imagePath) => {
        const imageFileName = imagePath.split('/').pop();
        // Create a wrapper div for each slider image
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        // Create an image element for the slider image
        const img = document.createElement('img');
        img.src = `uploads/${imageFileName}`;
        img.classList.add('slider-image');

        // Create a delete button for each slider image
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');

        // Add an event listener to the delete button
        deleteButton.addEventListener('click', () => {
          // When the delete button is clicked, trigger a request to delete the image
          deleteSliderImage(imagePath);
        });

        // Append the image and delete button to the wrapper div
        imageWrapper.appendChild(img);
        imageWrapper.appendChild(deleteButton);

        // Append the wrapper div to the slider container
        sliderContainer.appendChild(imageWrapper);
      });
    })
    .catch(function (error) {
      //console.error('Error fetching slider images:', error);
    });
}

// Rest of your client-side code.

// Function to delete the slider image
function deleteSliderImage(imagePath) {
  axios
    .post('/slider/delete', { imagePath })
    .then(function (response) {
      console.log('Slider image deleted:', imagePath);
      // After deleting the image, fetch the updated slider image again
      fetchSliderImage();
    })
    .catch(function (error) {
      console.error('Error deleting slider image:', error);
    });
}

// Call the fetchSliderImage function when the page loads to display the slider image
fetchSliderImages();
