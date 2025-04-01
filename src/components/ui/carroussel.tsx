"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CarouselProps {
  slides: React.ReactNode[]; // Permet de passer n'importe quel élément JSX
  classname?: string;
}

const Carousel = ({ slides, classname }: CarouselProps) => {
  return (
    <div className="w-full h-dvh">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className={classname}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center w-full h-full bg-gray-200">
              {slide} 
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
