// pages/all-packages.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EnquiryModal from "../components/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PackageContinent from "../components/PackageContinent";

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

interface CountryOption {
  value: string;
  label: string;
}

const AllPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [totalCount, settotalCount] = useState(0); // Initial load of 9 packages

  const router = useRouter();

  useEffect(() => {
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

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list-package`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/list-package?limit=${displayCount}`
      );
      const data = await response.json();
      if (data.status) {
        setPackages(data.data);
      }
      if (data.count) {
        settotalCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [displayCount]);

  const loadMore = () => {
    const response = totalCount - displayCount;
    if (response < 9) {
      setDisplayCount((prev) => prev + response);
    } else {
      setDisplayCount((prev) => prev + 9);
    }
  };

  return (
    <div
      className="mt-5 packages-container"
      style={{ maxWidth: "1080px", margin: "0 auto" }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Travel Packages</h1>
      </div>

      <div className="row">
        {packages.map((pkg) => (
          <div className="col-12 col-sm-6 col-md-4 mb-4" key={pkg._id}>
            <PackageContinent pkg={pkg} onEnquiry={openEnquiryModal} />
          </div>
        ))}
      </div>

      {selectedPackage && (
        <EnquiryModal
          packageData={selectedPackage}
          show={showEnquiryModal}
          onClose={closeEnquiryModal}
          countryOptions={countryOptions}
        />
      )}

      {/* Show Load More button only if there are more packages to load */}
      {displayCount < totalCount && (
        <div className="text-center mt-4">
          <button
            className=" custom-btn-main"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Packages"}
          </button>
          <div className="mt-2 text-muted">
            Showing {Math.min(displayCount, packages.length)} of {totalCount}{" "}
            packages
          </div>
        </div>
      )}

      {/* Show message when all packages are loaded */}
      {/* {displayCount >= packages.length && packages.length > 0 && ( */}
      {displayCount >= totalCount && totalCount > 0 && (
        <div className="text-center mt-4">
          <p className="text-success">All packages loaded</p>
        </div>
      )}
    </div>
  );
};

export default AllPackagesPage;
