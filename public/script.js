fetch('http://localhost:3000/cars')
  .then(response => response.json())
  .then(cars => {
    const swiperWrapper = document.querySelector('.carList .swiper-wrapper');

    if (cars.length > 0) {
      cars.forEach(car => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        slide.innerHTML = `
          <img src="admin/public/${car.images}" alt="${car.maker} ${car.model}">
          <h1>${car.maker} ${car.model}</h1>
          <p>Engine: ${car.engine}</p>
          <p>Mileage: ${car.mileage}</p>
          <p>Price: ${car.price}</p>
        `;
        swiperWrapper.appendChild(slide);
      });
    }

    const swiper = new Swiper('carList .swiper-container', {
      slidesPerView: 9,
      spaceBetween: 10,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  });



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

