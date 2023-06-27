const vehicles= [
  {
    id:1,
    image:"./images/cars/suv.png",
     maker:"toyota",
    model:"LandCruiser",
    description:"",
    year:2016,
    price:"2.8m",
    mileage:"80 000km",
    shape:"suv",
    category:"recomended" 
  },
  {
    id:2,
    image:"./images/cars/th (4).jpeg",
     maker:"nissan",
    model:"patrol",
    description:"",
    year:2017,
    price:"5.8m",
    mileage:"50 000km",
    shape:"suv",
    category:"newArrival" 
  },
  {
    id:3,
    image:"./images/cars/bmw.jpeg",
     maker:"bmw",
    model:"x5",
    description:"",
    year:2015,
    price:"4.8m",
    mileage:"80 000km" ,
    shape:"suv",
    category:"newArrival" 
  },
  {
    id:4,
    image:"./images/cars/th (2).jpeg",
     maker:"lexus ",
    model:"lx 570",
    description:"",
    year:2019,
    price:"10.8m",
    mileage:"40 000km" ,
    shape:"suv",
    category:"bestDeals" 
  },
  {
    id:5,
    image:"./images/cars/car1.jpeg",
     maker:"toyota",
    model:"premio",
    description:"",
    year:2015,
    price:"1.8m",
    mileage:"100 000km", 
    shape:"sedan",
    category:"bestDeals" 
  },
  {
    id:6,
    image:"./images/cars/honda.jpeg",
     maker:"honda",
    model:"prius",
    description:"",
    year:2016,
    price:"1.2m",
    mileage:"90 000km", 
    category:"bestDeals" 
  },
]

//display all cars
const result = document.querySelector('.allCars')
const carsNames = vehicles.map((vehicles)=>` 
<a href="#" class="cursor-pointer ">
                     <img src="${vehicles.image}" alt="honda" class="h-20">
                     <div class="detail text-blue-600 uppercase hover:underline hover:text-gray-800">
                     
                     <h5>${vehicles.maker}</h5>
                     <h4>${vehicles.model}</h4>
                     <h4>${vehicles.year}</h4>
                     <h4>${vehicles.price}</h4>
                     </div>
                     </a>
    
`)
result.innerHTML = carsNames.join(" ")


//displays new arrival cars
const news = document.querySelector('.newArrivals')

const newCar = vehicles.filter((vehicles)=>vehicles.category ==='newArrival'

`<a href="#" class="cursor-pointer ">
                     <img src="${newCar.image}" alt="honda" class="h-20">
                     <div class="detail text-blue-600 uppercase hover:underline hover:text-gray-800">
                     
                     <h5>${newCar.maker}</h5>
                     <h4>${newCar.model}</h4>
                     <h4>${newCar.year}</h4>
                     <h4>${newCar.price}</h4>
                     </div>
                     </a>
    
`)
news.innerHTML = "home dmkkjfgnk"



const home=document.getElementById('home')



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