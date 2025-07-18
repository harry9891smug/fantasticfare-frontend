"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../assets/css/packages.css";
import Link from "next/link";
import "../../assets/css/about.css";
import EnquiryModal from "../../components/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WhyChooseUs from "../../components/WhyChooseUs";
import Testimonial from "@/app/components/testimonial";
import PackageContinent from "@/app/components/PackageContinent";

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
  country_name: string;
  region_name: string;
  continent_name: string;
  package_url: string;
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
interface country {
  id: string;
  subregion: string;
  region: string;
  name: string;
}

const Packages = ({ params }: CountryPageProps) => {
  const { country } = params;

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [showAll, setShowAll] = useState(false);
  const [countryData, setCountry] = useState<country | null>(null);

  const calculateSavings = (total: string, discounted: string) =>
    (parseFloat(total) - parseFloat(discounted)).toFixed(2);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let result = country;
      if (country.includes("-")) {
        result = country.replace(/-/g, " ");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/packages-data?country=${result}`
      );
      if (!response.ok)
        throw new Error("No Package Found in selected country.");
      // if (!response.ok) throw new Error("Failed to fetch packages.");
      const data = await response.json();
      if (data.status && data.data) {
        setPackages(data.data);
      }
      if (data.status && data.country) {
        setCountry(data.country);
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/country-code`
      );
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
    return <div className="container mt-5">Loading packages...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading packages</h4>
          <p>{error}</p>
          {/* <button className="btn btn-primary" onClick={fetchPackages}>Retry</button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 packages-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <section className="py-12 px-4 md:px-16 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="fw-semibold lh-sm fs-1">
            All Inclusive {country} Package Holidays
          </h1>
          <p className="fw-normal fs-6 leading-relaxed mb-4">
            {country}, often synonymous with luxury, is accessible without
            compromising on opulence, thanks to our array of cheap holidays to{" "}
            {country}. Our affordable holiday packages to {country} ensure you
            can immerse yourself in the lavish beauty of this destination while
            adhering to your budget.
          </p>
          <p className="fw-normal fs-6 leading-relaxed mb-4">
            Explore our comprehensive collection of cheap holiday deals to{" "}
            {country}, featuring exclusive access to some of the most coveted
            parks and resorts in the city.
          </p>
          <p className="fw-normal fs-6 leading-relaxed mb-4">
            Choose our cheap holiday package to {country} and enjoy
            complimentary access to numerous amenities and attractions,
            including the exhilarating Wild Wadi Waterpark. Our cheap family
            holidays to {country} offer exceptional value, with deals that
            include children staying and eating for free at the renowned
            Jumeirah Beach Hotel.
          </p>
          <p className="fw-normal fs-6 leading-relaxed">
            For additional savings, discover our all-inclusive cheap holiday
            deals to {country}, promising not just affordability but an
            unforgettable experience amidst the city's iconic splendours.
          </p>
        </div>
      </section>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end p-4 rounded">
        <div className="mb-3 mb-md-0">
          <h4
            className="mb-2 text-capitalize"
            style={{ fontSize: "18px", color: "#329FDE" }}
          >
            <Link href={`/continent/${countryData?.region}`}>
              {countryData?.region}
            </Link>
            {/* {countryData?.region}    */}
            &gt;&nbsp;
            <Link
              href={`/region/${countryData?.subregion?.split(" ").join("-")}`}
            >
              {countryData?.subregion}
            </Link>
            &gt;&nbsp;
            <Link href={`/country/${country}`}>{country}</Link>
          </h4>
        </div>
        <div>
          <button className="btn btn-primary custom-btn-main">
            Discover More
          </button>
        </div>
      </div>

      {/* Packages */}
      <div className="row">
        {packages.length > 0 ? (
          packages.slice(0, showAll ? packages.length : 6).map((pkg) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={pkg._id}>
              <PackageContinent pkg={pkg} onEnquiry={openEnquiryModal} />
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
            <button
              className="btn btn-primary custom-btn-main"
              onClick={() => setShowAll(true)}
            >
              View All Packages ({packages.length})
            </button>
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

      <WhyChooseUs />
      <Testimonial />
    </div>
  );
};

export default Packages;
