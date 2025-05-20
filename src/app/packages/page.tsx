'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../assets/css/packages.css";
import Link from "next/link";
import TipsSection from "../components/tipsArticle";
import { usePathname } from 'next/navigation';
import EnquiryModal from "../components/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  id: number;
  image: string;
  title: string;
  description: string;
}

const travelTips: TravelTip[] = [
  { id: 1, image: "/assets/images/img101.png", title: "How to Save Money on Flights", description: "Learn the best ways to book affordable flights without compromising on comfort." },
  { id: 2, image: "/assets/images/img102.png", title: "Best Packing Tips for Travelers", description: "Discover how to pack efficiently and avoid unnecessary baggage fees." },
  { id: 3, image: "/assets/images/img103.png", title: "Top Travel Safety Tips", description: "Ensure a safe trip by following these essential travel safety guidelines." },
  { id: 4, image: "/assets/images/img104.png", title: "How to Find the Best Hotels", description: "Get expert tips on booking hotels with the best value and amenities." },
  { id: 5, image: "/assets/images/img105.png", title: "Solo Travel Tips for Beginners", description: "Explore the world confidently with these solo travel insights." },
];

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedTip, setSelectedTip] = useState<TravelTip>(travelTips[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  useEffect(() => {
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

    fetchCountryCodes();
  }, []);

   const openEnquiryModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowEnquiryModal(true);
  };

  const closeEnquiryModal = () => {
    setShowEnquiryModal(false);
    setSelectedPackage(null);
  };

  const [displayCount, setDisplayCount] = useState(6);
const [showAll, setShowAll] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list-package`);
      if (!response.ok) throw new Error("Failed to fetch packages.");

      const data = await response.json();
      if (data.status && data.data) {
        setPackages(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/packages") {
      // Reload the page, but only once per session
      const hasReloaded = sessionStorage.getItem("reloadedPackages");

      if (!hasReloaded) {
        sessionStorage.setItem("reloadedPackages", "true");
        window.location.reload();
      }
    }

    // Clear on unload so it's ready next time
    return () => {
      sessionStorage.removeItem("reloadedPackages");
    };
  }, [pathname]);

  useEffect(() => {
    fetchPackages();

  }, []);
  useEffect(() => {
    const handleRouteChange = () => {
      // Reinitialize critical components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);
  const calculateSavings = (total: string, discounted: string) =>
    (parseFloat(total) - parseFloat(discounted)).toFixed(2);

  if (loading) return (
    <div className="container mt-5">
      <div className="row">
        {[...Array(3)].map((_, i) => (
          <div className="col-md-4 mb-4" key={i}>
            <div className="card shadow-sm h-100 placeholder-glow">
              <div className="card-img-top placeholder" style={{ height: "200px" }}></div>
              <div className="card-body">
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-4"></span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h4>Error loading packages</h4>
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={fetchPackages}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 packages-container">
      <ToastContainer position="top-right" autoClose={5000} />
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end p-4 rounded">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-2">Popular Travel Packages</h2>
          <p className="mb-0">Discover amazing holiday packages tailored for you.</p>
        </div>
        <div>
          <button className="btn btn-primary custom-btn-main">Discover More</button>
        </div>
      </div>

      {/* Packages */}
      <div className="row">
      {packages.length > 0 ? (
    packages.slice(0, showAll ? packages.length : 6).map(pkg => (
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
                      observer={true}  // Add this
                      observeParents={true}  // Add this
                      key={pkg._id}  // Add unique key
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
                      <button className="callback-button"  onClick={() => openEnquiryModal(pkg)}>
                            Request Callback
                      

                     
                        </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h4>No packages available</h4>
            <p>Please check back later</p>
          </div>
        )}
      </div>
      {packages.length > 6 && (
  <div className="text-center mt-4">
    {!showAll ? (
      <Link href="/all-packages" passHref>
        <button className="btn btn-primary custom-btn-main">
          View All Packages ({packages.length})
        </button>
      </Link>
    ) : (
      <button 
        className="btn btn-outline-primary"
        onClick={() => setShowAll(false)}
      >
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
      {/* Advertisement */}
      <div className="ads-container my-5">
        <Image
          src="/assets/images/ads.jpeg"
          alt="Advertisement"
          className="img-fluid rounded"
          width={1200}
          height={300}
          priority
        />
      </div>

      {/* Tips Section */}
      <TipsSection />
    </div>
  );
};

export default Packages;