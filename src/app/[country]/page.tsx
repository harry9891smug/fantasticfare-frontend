'use client';

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../assets/css/packages.css";
import user1 from "../assets/images/user.svg"; 
import Link from "next/link";
import '../assets/css/about.css';
import EnquiryModal from "../components/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cornerImage from "../assets/images/revimg.svg";
import WhyChooseUs from '../components/WhyChooseUs';
const reviews = [
  {
    id: 1,
    name: "John Doe",
    image: user1,
    review: "This was an amazing experience! Highly recommend for anyone looking to explore new places.",
  },
  {
    id: 2,
    name: "Emma Smith",
    image: user1,
    review: "A breathtaking journey with top-notch service. I loved every moment of the trip!",
  },
  {
    id: 3,
    name: "Michael Johnson",
    image: user1,
    review: "Best sightseeing tour ever! Everything was well organized, and the guides were fantastic.",
  },
];
const FaChevronLeft = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaChevronLeft),
  { ssr: false }
);

const FaChevronRight = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaChevronRight),
  { ssr: false }
);
interface Package {
  _id: string;
  package_name: string;
  package_image: string[];
  package_heading: string;
  from_country: string;
  to_country: string;
  total_price: string;
  discounted_price: string;
  days?: string;
}

interface TravelTip {
  title: string;
  description: string;
}

interface CountryOption {
  value: string;
  label: string;
}

interface CountryPageProps {
  params: {
    country: string;
  };
}

const Packages = ({ params }: CountryPageProps) => {
  const { country } = params;

  const [index, setIndex] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [showAll, setShowAll] = useState(false);
 const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };
  const calculateSavings = (total: string, discounted: string) =>
    (parseFloat(total) - parseFloat(discounted)).toFixed(2);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/packages-data?country=${country}`);
      if (!response.ok) throw new Error("Failed to fetch packages.");
      const data = await response.json();
      if (data.status && data.data) {
        setPackages(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountryCodes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/country-code`);
      const data = await res.json();
      if (data.status && Array.isArray(data.countryCodes)) {
        const formatted = data.countryCodes.map((code: string) => ({
          value: code,
          label: code,
        }));
        setCountryOptions(formatted);
      }
    } catch (err) {
      console.error("Error fetching country codes:", err);
      toast.error("Failed to load country codes");
    }
  };

  const openEnquiryModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowEnquiryModal(true);
  };

  const closeEnquiryModal = () => {
    setShowEnquiryModal(false);
    setSelectedPackage(null);
  };

  useEffect(() => {
    fetchCountryCodes();
    fetchPackages();
  }, [country]);

  if (loading) {
    return (
      <div className="container mt-5">Loading packages...</div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading packages</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchPackages}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 packages-container">
      <ToastContainer position="top-right" autoClose={5000} />
<section className="py-12 px-4 md:px-16 bg-white text-gray-800">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl md:text-5xl font-bold mb-6">
      All Inclusive {country} Package Holidays
    </h1>
    <p className="text-lg leading-relaxed mb-4">
      {country}, often synonymous with luxury, is accessible without compromising on opulence, thanks to our array of cheap holidays to {country}. Our affordable holiday packages to {country} ensure you can immerse yourself in the lavish beauty of this destination while adhering to your budget.
    </p>
    <p className="text-lg leading-relaxed mb-4">
      Explore our comprehensive collection of cheap holiday deals to {country}, featuring exclusive access to some of the most coveted parks and resorts in the city.
    </p>
    <p className="text-lg leading-relaxed mb-4">
      Choose our cheap holiday package to {country} and enjoy complimentary access to numerous amenities and attractions, including the exhilarating Wild Wadi Waterpark. Our cheap family holidays to {country} offer exceptional value, with deals that include children staying and eating for free at the renowned Jumeirah Beach Hotel.
    </p>
    <p className="text-lg leading-relaxed">
      For additional savings, discover our all-inclusive cheap holiday deals to {country}, promising not just affordability but an unforgettable experience amidst the city's iconic splendours.
    </p>
  </div>
</section>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end p-4 rounded">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-2 text-capitalize">{country}</h2>
        </div>
        <div>
          <button className="btn btn-primary custom-btn-main">Discover More</button>
        </div>
      </div>

      {/* Packages */}
      <div className="row">
        {packages.length > 0 ? (
          packages.slice(0, showAll ? packages.length : 6).map((pkg) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={pkg._id}>
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
                        observer
                        observeParents
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
                              style={{ objectFit: "cover", borderRadius: "8px", width: '100%', height: 'auto' }}
                              priority={idx === 0}
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
                    <h5 className="card-title">{pkg.package_name}</h5>
                  </Link>
                  <p className="card-text text-muted mb-2">{pkg.package_heading}</p>
                  <div className="price-container mb-3 mt-auto">
                    {pkg.discounted_price ? (
                      <>
                        <span className="text-decoration-line-through text-muted me-2">${pkg.total_price}</span>
                        <span className="text-danger fw-bold">${pkg.discounted_price}</span>
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
                    <button className="callback-button" onClick={() => openEnquiryModal(pkg)}>
                      Request Callback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h4>No packages available for {country}</h4>
            <p>Please check back later</p>
          </div>
        )}
      </div>

      {packages.length > 6 && (
        <div className="text-center mt-4">
          {!showAll ? (
            <button className="btn btn-primary custom-btn-main" onClick={() => setShowAll(true)}>
              View All Packages ({packages.length})
            </button>
          ) : (
            <button className="btn btn-outline-primary" onClick={() => setShowAll(false)}>
              Show Less
            </button>
          )}
        </div>
      )}

      {/* Enquiry Modal */}
      {selectedPackage && (
        <EnquiryModal
          packageData={selectedPackage}
          show={showEnquiryModal}
          onClose={closeEnquiryModal}
          countryOptions={countryOptions}
        />
      )}

<WhyChooseUs />
       <div className="review-section">
              <Image 
                src={cornerImage} 
                alt="Decorative Corner" 
                width={150}
                height={150}
                className="corner-image" 
              />
      
              <div className="review-card">
                <FaChevronLeft 
                  className="nav-icon left-icon" 
                  onClick={handlePrev} 
                  size={24}
                />
      
                <Image 
                  src={reviews[index].image} 
                  alt={reviews[index].name} 
                  width={80}
                  height={80}
                  className="user-image" 
                />
                <p className="review-text">{reviews[index].review}</p>
                <h4 className="user-name">{reviews[index].name}</h4>
      
                <FaChevronRight 
                  className="nav-icon right-icon" 
                  onClick={handleNext} 
                  size={24}
                />
              </div>
            </div>
    </div>
  );
};

export default Packages;
