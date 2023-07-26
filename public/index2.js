


const bars = document.querySelector(".bars");
const links = document.querySelector(".links");
const slider = document.querySelector(".slider");

bars.addEventListener("click", () => {
  links.classList.toggle("active");
  slider.classList.toggle("active")
});

const swiper = new Swiper(".swiper", {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
});

  // And if we need scrollbar

//  quastion and answer area
const question = document.querySelectorAll(".quiz");
const add = document.querySelector(".plus1");
const add1 = document.querySelector(".plus2");
const add2 = document.querySelector(".plus3");


const detail = document.getElementById("quiz1");
const detail1 = document.getElementById("quiz2");
const detail2 = document.getElementById("quiz3");
const detail3 = document.getElementById("quiz4");

add.addEventListener('click', ()=>{
  detail.classList.toggle("active")
  add.classList.toggle('fa-times')
  
})
  add1.addEventListener('click', ()=>{
    detail1.classList.toggle("active")
    add1.classList.toggle('fa-times')

  })
    add2.addEventListener('click', ()=>{
      detail2.classList.toggle("active")
      add2.classList.toggle('fa-times')
    })
    
      
// the change page of cars to redirect


// posting inquiry t database
// Get the form element
// index2.js

// Get the form element
const reviewForm = document.getElementById('reviewForm');

// Add event listener for form submission
reviewForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting and page refresh

  // Get the form data
  const formData = new FormData(reviewForm);

  // Create an object to hold the review data
  const reviewData = {
    name: formData.get('name'),
    location: formData.get('location'),
    country: formData.get('country'),
    comments: formData.get('comments')
  };

  // Send a POST request to the server to save the review data
  axios.post('/reviews', reviewData)
    .then(function(response) {
      console.log('Review added:', response.data);
      reviewForm.reset(); // Reset the form
      // You can perform any additional actions after successfully submitting the review
    })
    .catch(function(error) {
      console.error('Error adding review:', error);
    });
});


  
