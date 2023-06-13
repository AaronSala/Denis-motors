       
  const bars= document.querySelector('.bars')   
  const menu=document.querySelector('.links')

  bars.addEventListener('click', ()=>{
  menu.style.display='block'
    console.log('you clicked me')
  })


 const swiper = new Swiper('.swiper', {
    autoplay:{
     delay:3000,
     disableOnInteraction:false,
    },
   loop: true,
   pagination: {
     el: '.swiper-pagination',
     clickable:true,
   },
   navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
   },
 
   // And if we need scrollbar
  
 });

//  quastion and answer area
const question = document.querySelectorAll('.quiz');
const add = document.querySelectorAll('.plus');
const answer = document.querySelectorAll('.hidden');




add.forEach(function(plus){
  plus.addEventListener('click', function(e) {
    
    
    answer.forEach(question => {
      question.style.display='block'
    }); 
     

})
});
// add.addEventListener('click', ()=>{
//   if(answer.style.display='hidden'){
//     add.classList.toggle('fa-tims');
//  answer.style.display='block'
//   }else if(answer.style.display='block'){
//     set(answer.style.display='hidden')
//   }
 
// });
console.log('am on');