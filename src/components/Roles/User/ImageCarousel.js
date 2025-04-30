import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // 必须引入样式
import { Carousel } from "react-responsive-carousel";

const ImageCarousel = () => {
  return (
    <Carousel
      showThumbs={false}
      autoPlay
      infiniteLoop
      showStatus={false}
      interval={3000}
    >
      <div>
        <img src="https://www.primalstrength.com/cdn/shop/files/gym_design_Headers.jpg?v=1680779429&width=2000" alt="Slide 1" />
        <p className="legend">Welcome to our fitness club</p>
      </div>
      <div>
        <img src="https://images.squarespace-cdn.com/content/v1/644927389a1ab06f2f12a9fe/d2cef23b-98a3-4e23-9835-e24209de58f5/IMG_4073.jpg" alt="Slide 2" />
        <p className="legend">Track your progress</p>
      </div>
      <div>
        <img src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Slide 3" />
        <p className="legend">Achieve your goals</p>
      </div>
    </Carousel>
  );
};

export default ImageCarousel;