// fetch('http://localhost:3004/cars')
//   .then(response => response.json())
//   .then(cars => {
//     const swiperWrapper = document.querySelector('.swiper-wrapper');

//     if (cars.length > 0) {
//       cars.forEach(car => {
//         const slide = document.createElement('div');
//         slide.classList.add('swiper-slide');

//         slide.innerHTML = `
//           <img src="../public/admin/${car.image}" alt="${car.maker} ${car.model}">
//           <h2>${car.maker} ${car.model}</h2>
//           <p>Engine: ${car.engine}</p>
//           <p>Mileage: ${car.mileage}</p>
//           <p>Price: ${car.price}</p>
//         `;
//         swiperWrapper.appendChild(slide);
//       });
//     }

//     const swiper = new Swiper('.swiper-container', {
//       slidesPerView: 5,
//       spaceBetween: 10,
//       loop: true,
//       pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//       },
//     });
// function fetchAndDisplayReviews() {
  
     // Get the form element
//const carForm = document.getElementById('carForm');

// Add event listener for form submission

 
// Call the fetchAndDisplayCars function to load and display the initial car data

// Function to fetch and display the customer reviews
// Fetch and display reviews
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

