'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../assets/css/packages.css";
import EnquiryModal from "./EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Package {
  _id: string;
  package_name: string;
  package_image: string[];
  package_heading: string;
  total_price: string;
  discounted_price: string;
}

interface CountryData {
  country_name: string;
  country_id: number;
  packages: Package[];
}

interface RegionResponse {
  status: boolean;
  region_name: string;
  data: CountryData[];
  continentData:continents
}

interface RegionPackagesProps {
  region: string;
}
interface continents{
  id:string;
  name:string;
}

const RegionPackages = ({ region }: RegionPackagesProps) => {
  const [data, setData] = useState<RegionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);


  const fetchRegionPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/packages-data?region=${encodeURIComponent(region)}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch region packages.");
      
      const result: RegionResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Error fetching region packages");
    } finally {
      setLoading(false);
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

  const calculateSavings = (total: string, discounted: string) => {
    return (parseFloat(total) - parseFloat(discounted)).toFixed(2);
  };

  useEffect(() => {
    if (region) {
      fetchRegionPackages();
    }
  }, [region]);

  if (loading) {
    return <div className="container mt-5">Loading packages...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading packages</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          <h4>No packages found for {region}</h4>
          <p>Please try another region or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 packages-container">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Region Header */}
      <div className="region-header mb-5">
        <h1 className="text-center mb-3">{data.region_name} Tour Packages</h1>
        <p className="text-center lead">
          Explore our curated collection of vacation packages across {data.region_name}
        </p>
      </div>
 {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end p-4 rounded">
        <div className="mb-3 mb-md-0">
          <h4 className="mb-2 text-capitalize">
            <Link href={`/continent/${data.continentData.name}`}>{data.continentData.name}</Link>
            >
            <Link href={`/region/${region?.split(' ').join('-')}`}>
              {region}
            </Link>           
          </h4>
        </div>
        <div>
          <button className="btn btn-primary custom-btn-main">Discover More</button>
        </div>
      </div>
      {/* Countries and Packages */}
      {data.data.map((countryData) => (
        <div key={countryData.country_id} className="country-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{countryData.country_name}</h2>
            <Link 
              href={`/country/${countryData.country_name.toLowerCase().replace(/\s+/g, '-')}`}
              className="btn btn-outline-primary"
            >
              View All {countryData.packages.length} Packages
            </Link>
          </div>

          <div className="row">
            {countryData.packages.map((pkg) => (
              <div className="col-12 col-sm-6 col-md-4  mb-4" key={pkg._id}>
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
                    <p className="card-text text-muted mb-2 small">{pkg.package_heading}</p>
                    
                    <div className="price-container mt-auto">
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

                    <div className="d-flex justify-content-between mt-3">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEnquiryModal(pkg)}
                      >
                        Enquire Now
                      </button>
                      <Link 
                        href={`/packages/${pkg._id}`} 
                        className="btn btn-sm btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Enquiry Modal */}
      {selectedPackage && (
        <EnquiryModal
          packageData={selectedPackage}
          show={showEnquiryModal}
          onClose={closeEnquiryModal}
        />
      )}
    </div>
  );
};

export default RegionPackages;