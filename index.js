       
  const bars= document.querySelector('.bars')   
  const links=document.querySelector('.links')


  bars.addEventListener('click',() =>{

   
    links.classList.toggle('active');
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
const answer = document.querySelectorAll('.detail');

add.forEach(function(plus, id){
  plus.addEventListener('click', function(e) {
    if(answer[id].style.display ='hidden'){
      answer[id].style.display = 'block'
      console.log('am geart')
    }
    else{
      answer[index].style.display=='hidden'
    }
})
     

})

// add.addEventListener('click', ()=>{
//   if(answer.style.display='hidden'){
//     add.classList.toggle('fa-tims');
//  answer.style.display='block'
//   }else if(answer.style.display='block'){
//     set(answer.style.display='hidden')
//   }
 
// });
