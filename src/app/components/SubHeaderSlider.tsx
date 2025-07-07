"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "../assets/css/sub-header-slider.css";

const SubHeaderSlider = ({ countries }) => {
  const [showPrev, setShowPrev] = useState(false);
  const swiperRef = useRef();

  const handleSlideChange = (swiper) => {
    setShowPrev(swiper.activeIndex > 0);
  };

  return (
    <div className="slider-wrapper">
    <div className="sub-header-slider">
         <div className="slider-inner">
      {/* LEFT ARROW - Always render but toggle visibility */}
      <div className={`custom-prev ${!showPrev ? "disabled" : ""}`}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#c1c1c1" />
          <path
            d="M13.5 16.5L10 12L13.5 7.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={2}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={false}
        centeredSlides={false}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        breakpoints={{
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 6 },
        }}
      >
        {countries.map((country, index) => (
          <SwiperSlide key={index}>
            <Link href={`/country/${country.slug}`}>
              <div className="slider-card">
                <div className="country-image" >
                 {country.icon}
                </div>
                <p className="country-name">{country.name}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* RIGHT ARROW */}
      <div className="custom-next">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#c1c1c1" />
          <path
            d="M10.5 7.5L14 12L10.5 16.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
    </div>
    </div>
  );
};

export default SubHeaderSlider;
