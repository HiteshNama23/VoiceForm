import React, { useEffect } from 'react';

const Carousel = () => {
  useEffect(() => {
    const carouselContainer = document.getElementById('carousel');
    const images = [
      'https://media.istockphoto.com/id/815448194/photo/voice-recognition-with-smart-phone.jpg?s=612x612&w=is&k=20&c=YQzabs95GswfBBgaUCDLuuRfyh2NnGbZrFEn7e9valk=',
      'https://media.istockphoto.com/id/2159434903/photo/voice-recording-man-touching-microphone-icon-on-smart-phone-mobile-application-record-sound.jpg?s=612x612&w=0&k=20&c=PBw-07419W9e0GCmc7yGMFJVPJgU1U2yHOaMcnFtQEU=',
      'https://media.istockphoto.com/id/1500525586/photo/businessman-using-smart-phone-recording-the-conversation-with-customers.jpg?s=612x612&w=0&k=20&c=D6jjk_QQR_4pLJu2DgAMwVhN70w-hn7y_bFQD96VZDg=',
    ];

    const createCarousel = () => {
      const carouselElement = document.createElement('div');
      carouselElement.className = 'carousel';

      images.forEach((src, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'carousel-image-container';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Slide ${index + 1}`;
        img.className = 'carousel-image';

        imageContainer.appendChild(img);
        carouselElement.appendChild(imageContainer);
      });

      carouselElement.innerHTML += carouselElement.innerHTML;

      carouselContainer.appendChild(carouselElement);
    };

    if (carouselContainer) {
      createCarousel();
    }
  }, []);

  return null;
};

export default Carousel;
