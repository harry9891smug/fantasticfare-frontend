// components/PackageCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import "../assets/css/packages.css";

interface Package {
  _id: string;
  package_name: string;
  package_image: string[];
  package_heading: string;
  total_price: string;
  discounted_price: string;
}

interface PackageCardProps {
  pkg: Package;
  onEnquireClick: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onEnquireClick }) => {
  const calculateSavings = (total: string, discounted: string) =>
    (parseFloat(total) - parseFloat(discounted)).toFixed(2);

  return (
    <div className="card shadow-sm h-100 package-card">
      <Link href={`/packages/${pkg._id}`} className="text-decoration-none">
        <div className="card-img-container">
          {pkg.package_image?.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
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
                    height={250}
                    className="card-img-top"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      width: '100%',
                      height: 'auto'
                    }}
                    priority={idx === 0}
                    onLoadingComplete={() => window.dispatchEvent(new Event('resize'))}
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
        <Link href={`/packages/${pkg._id}`} className="text-decoration-none">
          <h5 className="card-title">{pkg.package_name || 'Package Name'}</h5>
        </Link>
        <p className="card-text text-muted mb-2">
          {pkg.package_heading || 'Package description'}
        </p>
        <div className="price-container mb-3 mt-auto">
          {pkg.discounted_price ? (
            <>
              <span className="text-decoration-line-through text-muted me-2">
                ${pkg.total_price}
              </span>
              <span className="text-danger fw-bold">
                ${pkg.discounted_price}
              </span>
              <div className="savings-badge">
                Save ${calculateSavings(pkg.total_price, pkg.discounted_price)}
              </div>
            </>
          ) : (
            <span className="fw-bold">${pkg.total_price}</span>
          )}
        </div>
        <div className="buttons">
          <a href="tel:+18334227770">
            <button className="phone-button">📞</button>
          </a>
          <button 
            className="callback-button" 
            onClick={(e) => {
              e.preventDefault();
              onEnquireClick();
            }}
          >
            Request Callback
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;