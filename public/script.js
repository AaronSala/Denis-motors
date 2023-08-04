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
          <h2>${review.name}:y 
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




//posting inquiries

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
  fetch('http://localhost:3000/inquiries',
   {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inquiryData)
  })
  .then(response => response.json())
  .then(savedInquiry => {
   // console.log('Inquiry saved:', savedInquiry);
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



    // Define the number of cars to display per page
    let currentPage = 1;
    let carsPerPage = 4; // Number of cars to display per page
    
    // Rest of your existing code...
    
    // Function to fetch and display cars
    function fetchAndDisplayCars(pageNumber, containerId, paginationButtonsContainerId, category) {
      fetch('http://localhost:3000/cars')
        .then(response => response.json())
        .then(cars => {
          // Calculate the number of cars to display based on the current screen size
          const screenWidth = window.innerWidth;
          if (screenWidth >= 1024) {
            carsPerPage = 4; // Show 6 cars per page on larger screens
          } else if (screenWidth >= 768) {
            carsPerPage = 4; // Show 4 cars per page on medium-sized screens
          } else {
            carsPerPage = 2; // Show 2 cars per page on smaller screens (e.g., mobile devices)
          }
    
          // Filter the cars based on the category (if applicable) and slice them for the current page
          let carsToShow;
          if (category === 'allCars') {
            carsToShow = cars.slice((pageNumber - 1) * carsPerPage, pageNumber * carsPerPage);
          } else {
            carsToShow = cars.filter(car => car.category === category).slice((pageNumber - 1) * carsPerPage, pageNumber * carsPerPage);
          }
    
          const carListContainer = document.getElementById(containerId);
          carListContainer.innerHTML = '';
          if (carsToShow.length > 0) {
            carsToShow.forEach(car => {
              const listItem = createCarListItem(car);
              listItem.addEventListener('click', () => {
                // Display images when the car item is clicked
                displayCarImages(car.images[0], car.images.slice(1), car.maker, car.model);
                window.scrollTo({
                  top: mainImageContainer.offsetTop,
                  behavior: 'smooth'
                });
    
                // Show the reserve button in the mainImageContainer
              });
              carListContainer.appendChild(listItem);
            });
    
            // Call addPaginationButtons with the updated carsPerPage value
            const totalPageCount = Math.ceil((category === 'allCars' ? cars.length : cars.filter(car => car.category === category).length) / carsPerPage);
            addPaginationButtons(totalPageCount, pageNumber, paginationButtonsContainerId, category);
          } else {
            carListContainer.innerHTML = '<p>No cars found.</p>';
          }
        })
        .catch(error => {
          console.error('Error fetching car data:', error);
        });
    }
    window.addEventListener('resize', () => {
      fetchAndDisplayCars(currentPage, 'carList', 'paginationButtonsCarList', 'allCars');
      // Add similar calls for other categories if needed
    });
    // Rest of your existing code...
    
  
    function getCategoryContainerId(category) {
      switch (category) {
        case 'allCars':
          return 'carList';
        case 'bestDeals':
          return 'bestList';
        case 'newArrivals':
          return 'newArrivals';
        default:
          return '';
      }
    }
    function createReserveButton(car) {
      const reserveButton = document.createElement('button');
      reserveButton.textContent = 'Reserve';
      reserveButton.classList.add('reserve-button');
    
      // Add a click event listener to handle the reservation process
      reserveButton.addEventListener('click', () => {
        
        console.log(`Reserved ${car.maker} ${car.model} for ${car.price}`);
      });
    
      return reserveButton;
    }
  
    // Initial fetch and display of cars on page load
    fetchAndDisplayCars(1, 'carList', 'paginationButtonsCarList', 'allCars');
    fetchAndDisplayCars(1, 'bestList', 'paginationButtonsBestList', 'bestDeals');
    fetchAndDisplayCars(1, 'newArrivals', 'paginationButtonsNewArrivals', 'newArrivals');
  
    function addPaginationButtons(totalPageCount, currentPage, paginationButtonsContainerId, category) {
      const paginationButtonsContainer = document.getElementById(paginationButtonsContainerId);
      paginationButtonsContainer.innerHTML = '';
  
      // Add the backward arrow
      if (currentPage > 1) {
        const backwardArrow = document.createElement('span');
        backwardArrow.textContent = '<<';
        backwardArrow.classList.add('pagination-arrow');
        backwardArrow.addEventListener('click', () => {
          fetchAndDisplayCars(currentPage - 1, getCategoryContainerId(category), paginationButtonsContainerId, category);
        });
        paginationButtonsContainer.appendChild(backwardArrow);
      }
  
      for (let i = 1; i <= totalPageCount; i++) {
        const dot = document.createElement('span');
        dot.textContent = '.';
        dot.classList.add('pagination-dot'); // Add the pagination-dot class
  
        // Highlight the currently selected page's dot
        if (i === currentPage) {
          dot.classList.add('active'); // Add the active class to the active dot
        }
  
        dot.addEventListener('click', () => {
          fetchAndDisplayCars(i, getCategoryContainerId(category), paginationButtonsContainerId, category);
        });
  
        paginationButtonsContainer.appendChild(dot);
      }
  
      // Add the forward arrow
      if (currentPage < totalPageCount) {
        const forwardArrow = document.createElement('span');
        forwardArrow.textContent = '>>';
        forwardArrow.classList.add('pagination-arrow');
        forwardArrow.addEventListener('click', () => {
          fetchAndDisplayCars(currentPage + 1, getCategoryContainerId(category), paginationButtonsContainerId, category);
        });
        paginationButtonsContainer.appendChild(forwardArrow);
      }
    }
  
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
    // ... (other parts of your code) ...

function displayCarImages(mainImage, otherImages, maker, model) {
  currentCarMaker = maker;
  currentCarModel = model;

  const mainImageContainer = document.getElementById('mainImageContainer');
  mainImageContainer.innerHTML = ''; // Clear previous content

  // Create a new img element for the main image and add it to the mainImageContainer
  const mainImageElement = document.createElement('img');
  mainImageElement.src = `admin/${mainImage}`;
  mainImageElement.classList.add('car-image');
  mainImageContainer.appendChild(mainImageElement);

  const additionalImageContainer = document.getElementById('additionalImageContainer');
  additionalImageContainer.innerHTML = '';

 

  otherImages.forEach((image, index) => {
    const additionalImage = document.createElement('img');
    additionalImage.src = `admin/${image}`;
    additionalImage.addEventListener('click', () => {
      // Update the main image with the clicked small image
    
      mainImageElement.src = `admin/${image}`;
      currentDisplayedImage = image; // Store the currently displayed image URL
     
    });
    additionalImageContainer.appendChild(additionalImage);
  });

  // Check if the reserve button already exists
  const existingReserveButton = mainImageContainer.querySelector('.reserve-button');
  if (!existingReserveButton) {
    // Create a reserve button and add it to the mainImageContainer if it doesn't exist
    const reserveButton = document.createElement('button');
    reserveButton.textContent = 'Reserve';
    reserveButton.classList.add('reserve-button');

    // Add a click event listener to handle the reservation process
    reserveButton.addEventListener('click', () => {
      // Call the function to display the reservation form
      showReservationForm(mainImage, maker, model);
    });

    // Append the reserve button to the mainImageContainer
    mainImageContainer.appendChild(reserveButton);
  }
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
   
  }
} addReserveButtonToMainImage()

    
    document.addEventListener('DOMContentLoaded', () => {
      // Fetch and display cars immediately on page load
      fetchAndDisplayCars();

      // Add event listener to the search button
     document.getElementById('searchButton').addEventListener('click', searchCars);
      //document.getElementById('searchForm').addEventListener('submit', handleFormSubmit);
      document.getElementById('additionalImageContainer').addEventListener('click', clearSearchResults);
      document.addEventListener('click', (event) => {
        // Check if the clicked element is an image
        if (event.target.tagName === 'IMG' && event.target.parentElement.id === 'additionalImageContainer') {
          // Scroll to the main image container
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
//reservation section
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
const error = document.getElementById('error')
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
     
      // Redirect to admin.html
      window.location.href = '/admin/public/admin.html';
    } else {
      password.style.border='1px solid red'
      error.innerHTML='wrong credentials'
      console.log('Login failed: Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

  
      