import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import home from "../assets/images/home.png";
import flights from "../assets/images/flight.png";
import hotels from "../assets/images/hotels.png";
import packages from "../assets/images/packages.png";
import "../assets/css/sub-header.css";
import { FaChevronDown } from "react-icons/fa";

interface RegionData {
  continent_name: string;
  regions: {
    region_name: string;
    countries: string[];
  }[];
}

interface ApiResponse {
  status: boolean;
  data: RegionData[];
}

const SubHeader = () => {
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [regionsData, setRegionsData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = () => {
    setShowViewDropdown((prev) => !prev);
  };
  useEffect(() => {
    const fetchRegionsData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/global-links`
        );
        if (!response.ok) throw new Error("Failed to fetch regions data");
        const data: ApiResponse = await response.json();
        setRegionsData(data);
      } catch (error) {
        console.error("Error fetching regions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionsData();
  }, []);

  const toggleContinent = (continent: string) => {
    setActiveContinent(activeContinent === continent ? null : continent);
  };

  return (
    <nav className="sub-header ">
      <div className="container d-flex justify-content-between align-items-center position-relative">
        {/* Navigation Links - Centered */}
        <ul className="d-flex mb-0 position-absolute start-50 translate-middle-x">
          <li>
            <Link href="/" className="flex items-center gap-2">
              <Image src={home} alt="Home" width={20} height={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/flights">
              <Image src={flights} alt="Flights" width={20} height={20} />
              Flights
            </Link>
          </li>
          <li>
            <Link href="/hotels" className="flex items-center gap-2">
              <Image src={hotels} alt="Hotels" width={20} height={20} />
              <span>Hotels</span>
            </Link>
          </li>
          <li>
            <Link href="/packages" className="flex items-center gap-2">
              <Image src={packages} alt="Packages" width={20} height={20} />
              <span>Packages</span>
            </Link>
          </li>
          {/* New View Dropdown */}

          {pathname === "/packages" && (
            <li className="position-relative view-dropdown-item">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={isMobile ? handleToggle : undefined}
                onMouseEnter={
                  !isMobile ? () => setShowViewDropdown(true) : undefined
                }
              >
                <span className="spandes">More</span>
                <span className="dropdown-icon">
                  {" "}
                  <FaChevronDown />
                </span>
              </div>

              {showViewDropdown && (
                <div
                  className="mega-dropdown"
                  onMouseEnter={() => setShowViewDropdown(true)}
                  onMouseLeave={() => setShowViewDropdown(false)}
                >
                  <div className="container">
                    {loading ? (
                      <div className="loading-spinner">
                        Loading destinations...
                      </div>
                    ) : regionsData ? (
                      <div className="continent-container">
                        {regionsData.data.map((continent) => (
                          <div
                            key={continent.continent_name}
                            className="continent-column"
                          >
                            <h3 className="continent-title">
                              {continent.continent_name}
                            </h3>
                            {continent.regions.map((region) => (
                              <div
                                key={region.region_name}
                                className="region-group"
                              >
                                <div className="region-title">
                                  {region.region_name}
                                </div>
                                <div className="country-list">
                                  {region.countries.map((country) => (
                                    <Link
                                      key={country}
                                      href={`/country/${country
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                      className="country-item"
                                    >
                                      {country}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="error-message">
                        Failed to load destinations
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>

        {/* Phone Button - Right Side */}
        <div className="phone-button-container ms-auto">
          <a 
            href="tel:+18334227770" 
            className="phone-buttonN d-flex align-items-center gap-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.016 12.375C13.375 12.375 12.75 12.266 12.172 12.063C11.875 11.953 11.531 12.031 11.313 12.25L10.141 13.422C7.8125 12.328 6.67188 11.187 5.57812 8.859L6.75 7.687C6.96875 7.469 7.04688 7.125 6.9375 6.828C6.73438 6.25 6.625 5.625 6.625 4.984C6.625 4.453 6.1875 4.016 5.65625 4.016H3.53125C2.92188 4.016 2.5 4.531 2.5 5.141C2.5 11.547 7.45312 16.5 13.8594 16.5C14.4688 16.5 14.9844 16.078 14.9844 15.469V13.344C14.9844 12.813 14.547 12.375 14.016 12.375Z"
                fill="currentColor"
              />
            </svg>
            <span>+1-833-422-7770</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default SubHeader;
