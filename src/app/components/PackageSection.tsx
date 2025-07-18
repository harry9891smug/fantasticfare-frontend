"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../assets/css/package.css";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EnquiryModal from "./EnquiryModal";
import "../assets/css/packages.css";
import { FaPhone } from "react-icons/fa";
import PackageContinent from "./PackageContinent";

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
  package_tags: string[];
}

const PackageSection: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [visiblePackages, setVisiblePackages] = useState(3);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);

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
        const allTags = data.data.flatMap(
          (pkg: Package) => pkg.package_tags || []
        );
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
    <div
      className="package-section"
      style={{ maxWidth: "1080px", margin: "0 auto" }}
    >
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

      <a className="view-all text-decoration-none" href="packages">
        View All
      </a>

      <hr className="full-width-line" />

      {loading && <p>Loading packages...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="package-container">
        {!loading && packages.length > 0 ? (
          <>
            {/* Show only the first 'visiblePackages' items */}
            {packages
              .filter((pkg) => pkg.package_tags?.includes(activeTab))
              .slice(0, visiblePackages)
              .map((pkg) => (
                <PackageContinent
                  key={pkg._id}
                  pkg={pkg}
                  onEnquiry={openEnquiryModal}
                />
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
