"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../assets/css/package.css";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import EnquiryModal from "./EnquiryModal";
import "../assets/css/packages.css";
type Package = {
  _id: string;
  package_heading: string;
  package_image: string[];
  total_price: string;
  discounted_price: string;
  package_tags: string[];
};

const PackageSection = () => {
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [visiblePackages, setVisiblePackages] = useState(6);
    const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  
  const tabs = ["honeymoon", "adventure", "travel", "yatra", "family", "luxury"];
  const [tabs, setTabs] = useState<string[]>([]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/list-package`
      );
      if (!response.ok) throw new Error("Failed to fetch packages.");
      const data = await response.json();
      if (data.status && data.data) {
        setPackages(data.data);
        const allTags = data.data.flatMap((pkg: Package) => pkg.package_tags || []);
        const uniqueTags = Array.from(new Set(allTags));
        setTabs(uniqueTags);
        if (uniqueTags.length > 0) setActiveTab(uniqueTags[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<string>("honeymoon");

  useEffect(() => {
    fetchPackages();
  }, []);

   const openEnquiryModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowEnquiryModal(true);
  };

  const closeEnquiryModal = () => {
    setShowEnquiryModal(false);
    setSelectedPackage(null);
  };


  return (
    <div className="package-section">
      <h2 className="package-title">Our Special Packages</h2>
      <hr className="full-width-line" />
      <div className="tabs">
       {tabs.map((tag) => (
          <button
            key={tag}
            className={`tab ${activeTab === tag ? "active" : ""}`}
            onClick={() => setActiveTab(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
  
        <a className="view-all text-decoration-none" href="packages">View All</a>
     
      <hr className="full-width-line" />
      

      {loading && <p>Loading packages...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="package-container">
      {!loading && packages.length > 0 ? (
  <>
    {/* Show only the first 'visiblePackages' items */}
    {packages.filter((pkg) => pkg.package_tags?.includes(activeTab))
  .slice(0, visiblePackages)
  .map((pkg) => (
      <div key={pkg._id} className="package-card">
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
                  alt={`${pkg.package_heading}-${idx}`}
                  width={400}
                  height={250}
                  className="card-img-top"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                    width: '100%',
                    height: 'auto',
                    maxHeight: '250px'
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
        <div className="package-info">
          <Link href={`/packages/${pkg._id}`} className="text-decoration-none">
            <h3 className="package-name">{pkg.package_heading}</h3>
          </Link>
          <div className="price-container">
            <span className="main-price">
              <s>USD {pkg.total_price}</s>
            </span>
            <span className="offer-price">
              USD {pkg.discounted_price}
            </span>
            <span className="saved-price">
              You Save $
              {(
                Number(pkg.total_price) - Number(pkg.discounted_price)
              ).toFixed(2)}
            </span>
          </div>
          <div className="buttons">
              <a href="tel:+18334227770">
                  <button className="phone-button">📞</button>
                </a>
              <button className="callback-button" onClick={() => openEnquiryModal(pkg)}>
                  Request Callback
                </button>
          </div>
        </div>
      </div>
    ))}
    
   {/* Enquiry Modal */}
      {selectedPackage && (
        <EnquiryModal
          packageData={selectedPackage}
          show={showEnquiryModal}
          onClose={closeEnquiryModal}
          countryOptions={countryOptions}
        />
      )}
  </>
) : (
  !loading && <p className="no-packages">No packages available.</p>
)}
      </div>
    </div>
  );
};

export default PackageSection;
