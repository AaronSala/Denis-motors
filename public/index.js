fetch('http://localhost:3004/cars')
  .then(response => response.json())
  .then(cars => {
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    if (cars.length > 0) {
      cars.forEach(car => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        slide.innerHTML = `
          <img src="../public/admin/${car.image}" alt="${car.maker} ${car.model}">
          <h2>${car.maker} ${car.model}</h2>
          <p>Engine: ${car.engine}</p>
          <p>Mileage: ${car.mileage}</p>
          <p>Price: ${car.price}</p>
        `;
        swiperWrapper.appendChild(slide);
      });
    }

    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 5,
      spaceBetween: 10,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  });

  