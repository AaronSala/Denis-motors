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
          <p>Location: ${review.location}</p>
          <p>Rating: ${review.rating}</p>
          <p>Comment: ${review.comment}</p>
        `;

        reviewListElement.appendChild(reviewElement);
      });
    })
    console.log(reviewList.target)
    .catch(function(error) {
      console.error('Error fetching reviews:', error);
    });
}

// Call the fetchAndDisplayReviews function to load and display the customer reviews
fetchAndDisplayReviews();
