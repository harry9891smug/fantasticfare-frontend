"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TipsSection from "../components/tipsArticle";
import { usePathname } from "next/navigation";
import EnquiryModal from "../components/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ads from "../assets/images/ads.jpeg";
import SubHeaderSlider from "../components/SubHeaderSlider";
import { faqList, metaData, packageMetaData } from "../utils/utilityData";
import { Accordion, Button } from "react-bootstrap";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Testimonial from "../components/testimonial";
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

interface TravelTip {
  id: number;
  image: string;
  title: string;
  description: string;
}

const travelTips: TravelTip[] = [
  {
    id: 1,
    image: "/assets/images/img101.png",
    title: "How to Save Money on Flights",
    description:
      "Learn the best ways to book affordable flights without compromising on comfort.",
  },
  {
    id: 2,
    image: "/assets/images/img102.png",
    title: "Best Packing Tips for Travelers",
    description:
      "Discover how to pack efficiently and avoid unnecessary baggage fees.",
  },
  {
    id: 3,
    image: "/assets/images/img103.png",
    title: "Top Travel Safety Tips",
    description:
      "Ensure a safe trip by following these essential travel safety guidelines.",
  },
  {
    id: 4,
    image: "/assets/images/img104.png",
    title: "How to Find the Best Hotels",
    description:
      "Get expert tips on booking hotels with the best value and amenities.",
  },
  {
    id: 5,
    image: "/assets/images/img105.png",
    title: "Solo Travel Tips for Beginners",
    description:
      "Explore the world confidently with these solo travel insights.",
  },
];

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedTip, setSelectedTip] = useState<TravelTip>(travelTips[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries-with-icon`
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          // Optional: Add slug generation
          const formatted = data.data.map((item) => ({
            name: item.country_name,
            icon: item.country_icon,
            slug: item.country_name.toLowerCase().replace(/\s+/g, "-"),
          }));
          setCountries(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };

    fetchCountries();
  }, []);
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

  const [displayCount, setDisplayCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  const sanitize = (str) => {
    if (str.includes("-")) return str;
    return str.replace(/ /g, "-");
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/list-package-data`
      );
      if (!response.ok) throw new Error("Failed to fetch packages.");

      const data = await response.json();
      if (data.status && data.data) {
        setPackages(data?.data);
        setDisplayCount(data?.count);
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("resize"));
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);
  const calculateSavings = (total: string, discounted: string) =>
    (parseFloat(total) - parseFloat(discounted)).toFixed(2);

  if (loading)
    return (
      <div className="container mt-5">
        <div className="row">
          {[...Array(3)].map((_, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card shadow-sm h-100 placeholder-glow">
                <div
                  className="card-img-top placeholder"
                  style={{ height: "200px" }}
                ></div>
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

  const groupPackagesByCountry = (packages: Package[]) => {
    return packages.reduce((acc, pkg) => {
      let rawCountry = (pkg as any).country_name || "Unknown Country";

      // Normalize: trim, lowercase, capitalize
      let country = rawCountry.trim().toLowerCase().replace(/\s+/g, " "); // remove extra spaces
      country = country.charAt(0).toUpperCase() + country.slice(1);

      if (!acc[country]) acc[country] = [];
      acc[country].push(pkg);
      return acc;
    }, {} as Record<string, Package[]>);
  };
  const groupedPackages = groupPackagesByCountry(packages);

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading packages</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchPackages}>
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <>
      <SubHeaderSlider countries={countries} />
      <div
        className="container mt-5 packages-container"
        style={{ maxWidth: "1080px", margin: "0 auto" }}
      >
        <ToastContainer position="top-right" autoClose={5000} />
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end p-4 rounded">
          <div className="mb-3 mb-md-0">
            <h2 className="mb-2">Popular Travel Packages</h2>
            <p className="mb-0">
              Discover amazing holiday packages tailored for you.
            </p>
          </div>
          <div>
            <a
              target="_blank"
              href="/all-packages"
              className="btn btn-primary custom-btn-main"
            >
              Discover More
            </a>
          </div>
        </div>

        {/* Packages */}
        {Object.entries(groupedPackages).map(
          ([countryName, countryPackages]) => (
            <div key={countryName} className="mb-5">
              {/* Country Header with View All Button */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">{countryName}</h3>
                <Link
                  href={`/country/${countryName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <button className="btn btn-outline-primary btn-sm">
                    View All
                  </button>
                </Link>
              </div>

              {/* Country's Packages */}
              <div className="row">
                {countryPackages.slice(0, 3).map((pkg) => (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" key={pkg._id}>
                    <PackageContinent pkg={pkg} onEnquiry={openEnquiryModal} />
                  </div>
                ))}
              </div>
            </div>
          )
        )}

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
            src={ads}
            alt="Advertisement"
            className="img-fluid rounded"
            width={1200}
            height={300}
            priority
          />
        </div>

        {/* Tips Section */}
        <TipsSection />

        <Testimonial />
        <div className=" container mt-5">
          <h1 className="d-flex justify-content-center mt-5 fw-bolder">
            Frequently Asked Question
          </h1>
          <div className="row mt-5">
            <div className="col-12 col-md-8">
              {faqList.map((faq, index) => (
                <Accordion key={index}>
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="count-badge text-white rounded-circle d-inline-flex justify-content-center align-items-center"
                          style={{
                            width: 30,
                            height: 30,
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.6rem",
                            background: "#0089C6",
                          }}
                        >
                          {index + 1}
                        </span>
                        <span>{faq.question}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div dangerouslySetInnerHTML={{ __html: faq.ans }} />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </div>
            <div
              className="col-12 col-md-4  d-flex flex-column justify-content-evenly py-4 px-3"
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "20%",
                }}
              >
                <ChatBubbleIcon style={{ fontSize: 40, color: "#212529" }} />
              </div>

              <h5 className="fw-bold">
                Anything Unclear about your trip or stay?
              </h5>
              <p className="text-body mb-4">
                Got any questions about your trip plan, stay or activities? Feel
                free to ask - we are here to help! Make your travel experience
                seamless and enjoyable.
              </p>
              <Button variant="primary" className="btn-lg custom-btn" size="lg">
                Further Question
              </Button>
            </div>
          </div>
        </div>
        <div className="container mt-5 d-flex flex-column">
          {packageMetaData.concat(metaData).map((item, index) => (
            <div key={index}>
              <h6 className="fw-bold mt-2 mb-0">{item.title}</h6>
              <p className="text-dark" style={{ fontSize: "x-small" }}>
                {item.destinations}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Packages;
