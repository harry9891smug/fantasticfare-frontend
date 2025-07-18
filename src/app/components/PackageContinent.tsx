// components/PackageCard.tsx
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import "../assets/css/packagecontinent.css"; // Adjust import path as needed
import { FaPhone, FaStar } from "react-icons/fa";

import { Package } from "../types/types"; // Adjust import path as needed

interface PackageCardProps {
  pkg: Package;
  onEnquiry: (pkg: Package) => void;
}

const sanitize = (str: string) => {
  if (str.includes("-")) return str;
  return str.replace(/ /g, "-");
};

const calculateSavings = (total: string, discounted: string) =>
  (parseFloat(total) - parseFloat(discounted)).toFixed(2);

const PackageContinent: React.FC<PackageCardProps> = ({ pkg, onEnquiry }) => (
  <div className="package-card">
    <Link
      href={`/package/${sanitize(pkg.continent_name)}/${sanitize(
        pkg.region_name
      )}/${sanitize(pkg.country_name)}/${pkg.package_url}`}
      className="text-decoration-none"
    >
      <div className="card-img-container">
        {pkg.package_image?.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            observer={true}
            observeParents={true}
            key={pkg._id}
          >
            {pkg.package_image.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={img}
                  alt={`${pkg.package_name}-${idx}`}
                  width={400}
                  height={350}
                  className="card-img-top"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  priority={idx === 0}
                  onLoad={() => window.dispatchEvent(new Event("resize"))}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
    </Link>
    <div className="card-body d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="package-days">{pkg.duration}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#19AD6F",
            marginTop: "10px",
          }}
        >
          <FaStar />
          <div className="rating-text">4.5</div>
          <div className="rating-count-text">(236)</div>
        </div>
      </div>
      <Link
        href={`/package/${sanitize(pkg.continent_name)}/${sanitize(
          pkg.region_name
        )}/${sanitize(pkg.country_name)}/${pkg.package_url}`}
        className="text-decoration-none"
      >
        <h5 className="card-title">{pkg.package_name}</h5>
      </Link>
      <div className="small-iternary-box">
        <div className="small-itenary-list-box">
          <div className="small-itenary-list">
            <span className="small-itenary-list-day-text">2D</span>
            <span className="small-itenary-list-city-text">Amsterdam</span>
          </div>
        </div>
      </div>
      <div className="price-container mt-auto">
        {pkg.discounted_price ? (
          <>
            <span className="offer-price">${pkg.discounted_price}</span>
            <span className="main-price">${pkg.total_price}</span>
            <div className="saved-price">
              Save ${calculateSavings(pkg.total_price, pkg.discounted_price)}
            </div>
          </>
        ) : (
          <span className="fw-bold">${pkg.total_price}</span>
        )}
      </div>
      <div className="buttons">
        <a href="tel:+18334227770">
          <button className="phone-button">
            <FaPhone className="rotate-call-icons" />
          </button>
        </a>
        <button className="callback-button" onClick={() => onEnquiry(pkg)}>
          Request Callback
        </button>
      </div>
    </div>
  </div>
);

export default PackageContinent;
