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


   // tooggle the login and register form
   const memb =document.getElementById('memb')
   const members = document.querySelector('.members')
   const register = document.querySelector('.register')
   const login = document.querySelector('.login2')
   const registerForm = document.querySelector('.registerForm')
   const loginForms = document.querySelector('.loginForms')
   
   memb.addEventListener('mouseenter', ()=>{
       memb.style.background="black"
   })
   register.addEventListener('click', ()=>{
       registerForm.classList.toggle("active")
       members.style.display='none'
   })
   
   login.addEventListener('click', ()=>{
       members.style.display='none'
   loginForms.classList.toggle("active")
   })
   
// script.js

//fetching and displaying cars
//displaying alll cars
    fetch('http://localhost:3000/cars')
  .then(response => response.json())
  .then(cars => {
    const carList = document.getElementById('carList');

    if (cars.length > 0) {
      cars.forEach(car => {
        const listItem = document.createElement('a');
        const mainImage = car.images[0]; // Store the main image URL
        car.images.splice(0, 1); // Remove the main image from the array

        listItem.innerHTML = `
          <img src="admin/${mainImage}" class="car-image">
          <h2>${car.maker} ${car.model}</h2>
          <p>Engine: ${car.engine}</p>
          <p>Price: ${car.price}</p>
          <p>Mileage: ${car.mileage}</p>
        `;
        carList.appendChild(listItem);

        // Attach an event listener to each car <a> element
        listItem.addEventListener('click', () => {
          const mainImageContainer = document.getElementById('mainImageContainer');
          mainImageContainer.innerHTML = ''; // Clear previous main image

          // Display the main image
          const mainImg = document.createElement('img');
          mainImg.src = `admin/${mainImage}`;
          mainImg.classList.add('car-image');
          mainImageContainer.appendChild(mainImg);

          // Display the other images
          const additionalImageContainer = document.getElementById('additionalImageContainer');
          additionalImageContainer.innerHTML = ''; // Clear previous additional images

          car.images.forEach(image => {
            const img = document.createElement('img');
            img.src = `admin/${image}`;
            img.classList.add('additional-image');
            img.addEventListener('click', () => {
              // Replace the main image when an additional image is clicked
              mainImg.src = `admin/${image}`;
            });
            additionalImageContainer.appendChild(img);
          });
          window.scrollTo({
            top: mainImageContainer.offsetTop,
            behavior: 'smooth'
          });
        });
      });
    } else {
      carList.innerHTML = '<p>No Toyota cars found.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching car data:', error);
  });

//displaying cars under the best deals section
        
  fetch('http://localhost:3000/cars')
  .then(response => response.json())
  .then(cars => {
    const carList = document.getElementById('bestList');
    const toyotaCars = cars.filter(car => car.category === 'bestDeals');

    if (toyotaCars.length > 0) {
      toyotaCars.forEach((car, index) => {
        const listItem = document.createElement('a');
        const mainImage = car.images[0]; // Store the main image URL
        car.images.splice(0, 1); // Remove the main image from the array

        listItem.innerHTML = `
          <img src="admin/${mainImage}" class="car-image">
          <h2>${car.maker} ${car.model}</h2>
          <p>Engine: ${car.engine}</p>
          <p>Price: ${car.price}</p>
          <p>Mileage: ${car.mileage}</p>
        `;
        carList.appendChild(listItem);

        // Attach an event listener to each car <a> element
        listItem.addEventListener('click', () => {
          const mainImageContainer = document.getElementById('mainImageContainer');
          mainImageContainer.innerHTML = ''; // Clear previous main image

          // Display the main image
          const mainImg = document.createElement('img');
          mainImg.src = `admin/${mainImage}`;
          mainImg.classList.add('car-image');
          mainImageContainer.appendChild(mainImg);

          // Display the other images
          const additionalImageContainer = document.getElementById('additionalImageContainer');
          additionalImageContainer.innerHTML = ''; // Clear previous additional images

          car.images.forEach(image => {
            const img = document.createElement('img');
            img.src = `admin/${image}`;
            img.classList.add('additional-image');
            img.addEventListener('click', () => {
              // Replace the main image when an additional image is clicked
              mainImg.src = `admin/${image}`;
            });
            additionalImageContainer.appendChild(img);
          });
          window.scrollTo({
            top: mainImageContainer.offsetTop,
            behavior: 'smooth'
          });
        });
      });
    } else {
      carList.innerHTML = '<p>No Toyota cars found.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching car data:', error);
  });



//displaying cars undernewarrivals
     
  fetch('http://localhost:3000/cars')
  .then(response => response.json())
  .then(cars => {
    const carList = document.getElementById('newArrivals');
    const toyotaCars = cars.filter(car => car.category === 'newArrivals');

    if (toyotaCars.length > 0) {
      toyotaCars.forEach((car, index) => {
        const listItem = document.createElement('a');
        const mainImage = car.images[0]; // Store the main image URL
        car.images.splice(0, 1); // Remove the main image from the array

        listItem.innerHTML = `
          <img src="admin/${mainImage}" class="car-image">
          <h2>${car.maker} ${car.model}</h2>
          <p>Engine: ${car.engine}</p>
          <p>Price: ${car.price}</p>
          <p>Mileage: ${car.mileage}</p>
        `;
        carList.appendChild(listItem);

        // Attach an event listener to each car <a> element
        listItem.addEventListener('click', () => {
          const mainImageContainer = document.getElementById('mainImageContainer');
          mainImageContainer.innerHTML = ''; // Clear previous main image

          // Display the main image
          const mainImg = document.createElement('img');
          mainImg.src = `admin/${mainImage}`;
          mainImg.classList.add('car-image');
          mainImageContainer.appendChild(mainImg);

          // Display the other images
          const additionalImageContainer = document.getElementById('additionalImageContainer');
          additionalImageContainer.innerHTML = ''; // Clear previous additional images

          car.images.forEach(image => {
            const img = document.createElement('img');
            img.src = `admin/${image}`;
            img.classList.add('additional-image');
            img.addEventListener('click', () => {
              // Replace the main image when an additional image is clicked
              mainImg.src = `admin/${image}`;
            });
            additionalImageContainer.appendChild(img);
          });
          window.scrollTo({
            top: mainImageContainer.offsetTop,
            behavior: 'smooth'
          });
        });
      });
    } else {
      carList.innerHTML = '<p>No Toyota cars found.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching car data:', error);
  });



 // search and display car function
 // Add event listener to the search button
 document.getElementById("searchButton").addEventListener("click", searchCars);
 document.getElementById("searchButton").addEventListener("submit", handleFormSubmit);
 document.body.addEventListener("click", clearSearchResults);
 
 function searchCars() {
   const search = document.getElementById('searchInput').value.toLowerCase(); // Convert search input to lowercase
   const additionalImageContainer = document.getElementById('additionalImageContainer');
   fetch('http://localhost:3000/cars')
     .then(response => response.json())
     .then(cars => {
       const carList = document.getElementById('additionalImageContainer');
       const filteredCars = cars.filter(car => 
         car.category.toLowerCase().includes(search) || // Convert car properties to lowercase
         car.maker.toLowerCase().includes(search) ||
         car.year.toString().toLowerCase().includes(search) ||
         car.model.toLowerCase().includes(search) ||
         car.shape.toLowerCase().includes(search)
       );
 
       if (filteredCars.length > 0) {
         filteredCars.forEach((car, index) => {
           const listItem = document.createElement('a');
           const mainImage = car.images[0]; // Store the main image URL
           car.images.splice(0, 1); // Remove the main image from the array
 
           listItem.innerHTML = `
             <img src="admin/${mainImage}" class="car-image">
             <h2>${car.maker} ${car.model}</h2>
             <p>Engine: ${car.engine}</p>
             <p>Price: ${car.price}</p>
             <p>Mileage: ${car.mileage}</p>
           `;
           carList.appendChild(listItem);
 
           // Attach an event listener to each car <a> element
           listItem.addEventListener('click', () => {
             const mainImageContainer = document.getElementById('mainImageContainer');
             mainImageContainer.innerHTML = ''; // Clear previous main image
 
             // Display the main image
             const mainImg = document.createElement('img');
             mainImg.src = `admin/${mainImage}`;
             mainImg.classList.add('car-image');
             mainImageContainer.appendChild(mainImg);
 
             // Display the other images
             additionalImageContainer.innerHTML = ''; // Clear previous additional images
 
             car.images.forEach(image => {
               const img = document.createElement('img');
               img.src = `admin/${image}`;
               img.classList.add('additional-image');
               img.addEventListener('click', () => {
                 // Replace the main image when an additional image is clicked
                 mainImg.src = `admin/${image}`;
               });
               additionalImageContainer.appendChild(img);
             });
             window.scrollTo({
               top: mainImageContainer.offsetTop,
               behavior: 'smooth'
             });
            
           });
         });
       } else {
         carList.innerHTML = '<p>No cars found.</p>';
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
   const searchContainer = document.getElementById('searchInput');
   const targetElement = event.target;
 
   // Check if the clicked element is outside the search area
   if (!searchContainer.contains(targetElement)) {
     const carList = document.getElementById('additionalImageContainer');
     carList.innerHTML = ''; // Clear search results
   }
 }
 
 clearSearchResults();
 