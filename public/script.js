//const { redirect } = require("react-router-dom");




function fetchAndDisplayReviews() {
  // Send a GET request to the server to retrieve the reviews
  fetch('http://localhost:3000/reviews')
    .then(response => response.json())
    .then(reviews => {
      const reviewListElement = document.getElementById('reviewList');
      reviewListElement.innerHTML = ''; // Clear previous reviews

      reviews.forEach(review => {
        if (review.rating === 'good'){
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');

        reviewElement.innerHTML = `
          
          <div2>
          <h2>${review.name} From:
         ${review.location} ${review.country}
         </h2>
         <div3>
         <img src="images/quote.png">
          <p><span>${review.comments}</span></p>
          </div3>
          </div2>
        `;
// {<p>Rating: <span>${review.rating}</span></p>}
        reviewListElement.appendChild(reviewElement);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching reviews:', error);
    });
}

// Call the fetchAndDisplayReviews function to load and display the reviews
fetchAndDisplayReviews();


// Function to add a new reviews to database
function addReview() {
  // Get the input values
  const name = document.getElementById('nameInput').value;
  const location = document.getElementById('locationInput').value;
  const country = document.getElementById('countryInput').value;
  const comments = document.getElementById('commentsInput').value;

  // Create an object to hold the review data
  const reviewData = {
    name,
    location,
    country,
    comments,
    
  };

  // Send a POST request to the server to add the review
  fetch('http://localhost:3000/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  })
    .then(response => response.json())
    .then(newReview => {
      console.log('Review added:', newReview);
      // Clear the input fields
      document.getElementById('nameInput').value = '';
      document.getElementById('locationInput').value = '';
      document.getElementById('countryInput').value = '';
      document.getElementById('commentsInput').value = '';
      // Fetch and display the updated reviews
      fetchAndDisplayReviews();
    })
    .catch(error => {
      console.error('Error adding review:', error);
    });
}

// Add event listener for the form submission
document.getElementById('reviewForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission and page refresh
  addReview(); // Call the addReview function to add a new review
});

// Call the fetchAndDisplayReviews function to load and display the reviews
fetchAndDisplayReviews();



//posting inquiries
// Event listener for form submission
document.getElementById('inquiryForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the form data
  const maker = document.getElementById('maker').value;
  const model = document.getElementById('model').value;
  const contacts = document.getElementById('contacts').value;
  const minengine = document.getElementById('minengine').value;
  const maxyear = document.getElementById('maxyear').value;
  const maxdistance = document.getElementById('maxdistance').value;
  const maxengine = document.getElementById('maxengine').value;
  const comments = document.getElementById('comment').value;

  // Create an inquiry object
  const inquiryData = {
    maker,
    model,
    contacts,
    minengine,
    maxyear,
    maxdistance,
    maxengine,
    comments,
  };
  // Post the inquiry to the server
  fetch('/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inquiryData)
  })
  .then(response => response.json())
  .then(savedInquiry => {
    console.log('Inquiry saved:', savedInquiry);
    // Clear the input fields
    document.getElementById('maker').value = '';
    document.getElementById('model').value = '';
    document.getElementById('contacts').value = '';
    document.getElementById('minengine').value = '';
    document.getElementById('maxyear').value = '';
    document.getElementById('maxprice').value = '';
    document.getElementById('maxdistance').value = '';
    document.getElementById('maxengine').value = '';
    document.getElementById('comment').value = '';
  })
  .catch(error => {
    console.error('Error saving inquiry:', error);
  });
});
//for displaying all cars

// ... Rest of your code ...

function fetchAndDisplayCars() {
  fetch('http://localhost:3000/cars')
    .then(response => response.json())
    .then(cars => {
      const allCarsContainer = document.getElementById('carList');
      const bestDealsContainer = document.getElementById('bestList');
      const newArrivalsContainer = document.getElementById('newArrivals');

      allCarsContainer.innerHTML = '';
      bestDealsContainer.innerHTML = '';
      newArrivalsContainer.innerHTML = '';

      if (cars.length > 0) {
        cars.forEach(car => {
          const listItem = createCarListItem(car);

          // Add click event listener to each car item
          listItem.addEventListener('click', () => {
            displayCarImages(car.images[0], car.images.slice(1), car.maker, car.model);
            window.scrollTo({
              top: mainImageContainer.offsetTop,
              behavior: 'smooth'
            }); // Call the function to scroll to the main image container
          });

          allCarsContainer.appendChild(listItem);

          if (car.category === 'bestDeals') {
            const bestDealsItem = listItem.cloneNode(true);
            bestDealsItem.addEventListener('click', () => {
              displayCarImages(car.images[0], car.images.slice(1), car.maker, car.model);
              window.scrollTo({
                top: mainImageContainer.offsetTop,
                behavior: 'smooth'
              }); // Call the function to scroll to the main image container
            });
            bestDealsContainer.appendChild(bestDealsItem);
          } else if (car.category === 'newArrivals') {
            const newArrivalsItem = listItem.cloneNode(true);
            newArrivalsItem.addEventListener('click', () => {
              displayCarImages(car.images[0], car.images.slice(1), car.maker, car.model);
              window.scrollTo({
                top: mainImageContainer.offsetTop,
                behavior: 'smooth'
              }); // Call the function to scroll to the main image container
            });
            newArrivalsContainer.appendChild(newArrivalsItem);
          }
        });
      } else {
        allCarsContainer.innerHTML = '<p>No Toyota cars found.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching car data:', error);
    });
}

// ... Rest of your code ...


function createCarListItem(car) {
  const listItem = document.createElement('div');
  const mainImage = car.images[0];

  listItem.innerHTML = `
    <img src="admin/${mainImage}" class="car-image">
    <h2>${car.maker} ${car.model}</h2>
    <p>Engine: ${car.engine}</p>
    <p>Price: ${car.price}</p>
    <p>Mileage: ${car.mileage}</p>
  `;

  return listItem;
}

//reserve info
let currentDisplayedImage = null;
let currentCarModel = null;
let currentCarMaker = null;

function displayCarImages(mainImage, otherImages, maker, model) {
  currentCarMaker = maker; // Assign the maker to the global variable
  currentCarModel = model; // Assign the model to the global variable

  const mainImageContainer = document.getElementById('mainImageContainer');
  mainImageContainer.innerHTML = `<img src="admin/${mainImage}" class="car-image">`;

  const additionalImageContainer = document.getElementById('additionalImageContainer');
  additionalImageContainer.innerHTML = '';

  // Add the reservation button for the main image immediately
  addReserveButtonToMainImage();

  otherImages.forEach((image, index) => {
    const additionalImage = document.createElement('img');
    additionalImage.src = `admin/${image}`;
    additionalImage.addEventListener('click', () => {
      mainImageContainer.innerHTML = `<img src="admin/${image}" class="car-image">`;
      currentDisplayedImage = image; // Store the currently displayed image URL
      addReserveButtonToMainImage();
    });
    additionalImageContainer.appendChild(additionalImage);
  });
}

function addReserveButtonToMainImage() {
  const mainImageContainer = document.getElementById('mainImageContainer');
  const reserveButton = mainImageContainer.querySelector('button');
  
  if (!reserveButton && currentDisplayedImage) {
    // Create the reserve button and add it to the main image container if it doesn't exist
    const newReserveButton = document.createElement('button');
    newReserveButton.innerText = 'Reserve';
    newReserveButton.addEventListener('click', () => {
      showReservationForm(currentDisplayedImage, currentCarMaker, currentCarModel);
    });
    mainImageContainer.appendChild(newReserveButton);
  } else if (reserveButton && !currentDisplayedImage) {
    // Remove the reserve button if it exists but there is no current displayed image
    reserveButton.remove();
  }
}


    // ... Rest of your code remains the same ...

    document.addEventListener('DOMContentLoaded', () => {
      // Fetch and display cars immediately on page load
      fetchAndDisplayCars();

      // Add event listener to the search button
     document.getElementById('searchButton').addEventListener('click', searchCars);
      document.getElementById('searchForm').addEventListener('submit', handleFormSubmit);
      document.getElementById('additionalImageContainer').addEventListener('click', clearSearchResults);
      document.addEventListener('click', (event) => {
        // Check if the clicked element is an image
        if (event.target.tagName === 'IMG' && event.target.parentElement.id === 'additionalImageContainer') {
          scrollToMainImageContainer(); // Scroll to the main image container
        }
      });
    });

function searchCars() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  fetch('http://localhost:3000/cars')
    .then(response => response.json())
    .then(cars => {
      const allCarsContainer = document.getElementById('additionalImageContainer');
      allCarsContainer.innerHTML = ''; // Clear allCarsContainer before displaying filtered cars

      const filteredCars = cars.filter(car =>
        car.category.toLowerCase().includes(search) ||
        car.maker.toLowerCase().includes(search) ||
        car.year.toString().toLowerCase().includes(search) ||
        car.model.toLowerCase().includes(search) ||
        car.shape.toLowerCase().includes(search)
      );

      if (filteredCars.length > 0) {
        filteredCars.forEach((car, index) => {
          const listItem = createCarListItem(car);

          listItem.addEventListener('click', () => {
            displayCarImages(car.images[0], car.images.slice(1));
          });

          allCarsContainer.appendChild(listItem);
        });
      } else {
        allCarsContainer.innerHTML = '<p>No cars found.</p>';
      }
      document.getElementById('searchInput').value = '';
    })
    .catch(error => {
      console.error('Error fetching car data:', error);
    });
}

function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting
  searchCars();
}

function clearSearchResults(event) {
  const targetElement = event.target;

  // Check if the clicked element is an image inside the additionalImageContainer
  if (targetElement.tagName === 'IMG' && targetElement.parentElement.id === 'additionalImageContainer') {
    const mainImageContainer = document.getElementById('mainImageContainer');
    mainImageContainer.innerHTML = `<img src="${targetElement.src}" class="car-image">`;
  }
}
//let model=car.model; let maker=car.maker;
function showReservationForm(imageUrl, maker, model){
 
  const reservationFormContainer = document.getElementById('reservationFormContainer');
  reservationFormContainer.innerHTML = `
    <form id=reservationForm method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required><br>
      <label for="phone">Phone:</label>
      <input type="number" id="phone" name="phone" required><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br>
      <input type="hidden" id="carImageUrl" name="carImageUrl" value="${imageUrl}">
      <input type="hidden" id="maker" name="model" value="${maker}">
      <input type="hidden" id="model" name="model" value="${model}">
      <button type="submit">Reserve</button>
    </form>
  `;

  const reservationForm = document.getElementById('reservationForm');
  reservationForm.addEventListener('submit', handleReservationFormSubmit);
}

function handleReservationFormSubmit(event) {
  event.preventDefault();
  const phone = document.getElementById('phone').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const maker = document.getElementById('maker').value;
  const model = document.getElementById('model').value;

  // Create an object to hold the reservation data
  const reservationData = {
    phone,
    name,
    email,
    maker,
    model,
  };

  // Send a POST request to the server to add the reservation
  fetch('http://localhost:3000/reserves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservationData)
  })
  .then(response => response.json())
  .then(newReservation => {
    console.log('Reservation added:', newReservation);
    // Clear the reservation form
    const reservationForm = document.getElementById('reservationForm');
    reservationForm.reset();
  })
  .catch(error => {
    console.error('Error adding reservation:', error);
  });
}



//login
document.getElementById('login-form').addEventListener('submit', handleLogin);

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginData = {
    email,
    password
  };

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      // Login successful
      console.log('Login response:', response);
      const data = await response.json();
      console.log('Login data received:', data);
      // Redirect to admin.html
      window.location.href = '/admin/admin.html';
    } else {
      // If login failed, show an error message
      console.log('Login failed: Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

  
      