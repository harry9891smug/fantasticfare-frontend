"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/destinations.css";
import Img1 from "../assets/images/destinations/1.svg";
import Img2 from "../assets/images/destinations/2.svg";
import Img3 from "../assets/images/destinations/4.svg";
import Img4 from "../assets/images/destinations/4.svg";
import Img5 from "../assets/images/destinations/5.svg";
import Img6 from "../assets/images/destinations/3.svg";
const featuredDestinations = [
  { id: 1, img: Img1, title: "Switzerland" },
  { id: 2, img: Img2, title: "France" },
  { id: 3, img: Img3, title: "Italy" },
  { id: 4, img: Img4, title: "Netherlands" },
  { id: 4, img: Img5, title: "Paris" },
  { id: 4, img: Img6, title: "China" },
];

const FeaturedSection = () => {
  return (
    <div className="featured-section">
      {/* Section Title */}
      <h2 className="section-title">Discover your new favourite stay</h2>

      {/* Slider */}
      <div className="destination-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
         
        >
          {featuredDestinations.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="featured-destination-card">
                <Image className="featured-destination-image " src={item.img} alt={item.title} width={300} height={200} />
                <h3 className="featured-destination-title">{item.title}</h3>
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      <div className="explore-container">
        <button className="explore-btn">Explore More</button>
      </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
