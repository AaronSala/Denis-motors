
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
const add3 = document.querySelector(".plus4");

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
    
      add3.addEventListener('click', ()=>{
        detail3.classList.toggle("active")
        add3.classList.toggle('fa-times')
      })
      
// the change page of cars to redirect

const toyota =document.querySelector('.toyota');
const nissan =document.querySelector('.nissan');
const benz =document.querySelector('.benz');
const subaru =document.querySelector('.subaru');
const mazda =document.querySelector('.mazda');

const logo = document.querySelector('.logo-img');
const headers = document.getElementsByClassName('.header-1');

console.log("am home");
nissan.addEventListener('click', ()=>{
//logo.src ="images/logos/nissan.jpeg";
nissan.style.background='black'

nissan.classList.toggle=("images/logos/nissan.jpeg");
});
console.log('grue')



const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', e => {
  e.preventDefault(); // Prevent form submission

  // Retrieve username and password from form fields
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;


  if (!username || !password) {
    console.error('Username and password are required');
    
    loginForm.username.style.border="1px solid red"
    return;
  }
  // Send login request to the server
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (response.ok) {
        // Redirect to admin.html if login is successful
        window.location.href = 'admin.html';
        console.log('Logged in');
      } else if (response.status === 401) {
        // Display error message if login fails due to unauthorized access
        console.error('Unauthorized');
      } else {
        // Display error message for other server errors
        console.error('Server Error');
      }
    })
    .catch(error => console.error('Error:', error));
});



