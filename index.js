const bars = document.querySelector(".bars");
const links = document.querySelector(".links");
const slider = document.querySelector(".slider");

bars.addEventListener("click", () => {
  links.classList.toggle("active");
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
      
