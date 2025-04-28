"use client";

import { useState } from "react";
import Image from "next/image";
import "../assets/css/package.css";
import Img2 from "../assets/images/destinations/2.svg";
import Img3 from "../assets/images/destinations/4.svg";
import Img1 from "../assets/images/destinations/1.svg";
import Img4 from "../assets/images/destinations/4.svg";
import Img5 from "../assets/images/destinations/5.svg";
import Img6 from "../assets/images/destinations/3.svg";

// Define type for the package object
type Package = {
  id: number;
  img: any;
  title: string;
  days: string;
  rating: number;
  reviews: number;
  mainPrice: string;
  offerPrice: string;
  savedAmount: string;
};

// Define valid tabs based on packagesData keys
type ValidTabs = 'honeymoon' | 'adventure' | 'travel';

const packagesData: Record<ValidTabs, Package[]> = {
  honeymoon: [
    { id: 1, img: Img5, title: "Glimpse Of Switzerland | FREE FIFA Museum Tickets", days: "10 Days / 9 Nights", rating: 4.7, reviews: 75, mainPrice: "$1,500", offerPrice: "$1,200", savedAmount: "$300" },
    { id: 2, img: Img1, title: "Amsterdam, Paris & Lucerne Tour with FREE Paris Pass", days: "5 Days / 4 Nights", rating: 4.8, reviews: 120, mainPrice: "$1,800", offerPrice: "$1,500", savedAmount: "$300" },
    { id: 3, img: Img2, title: "Glimpse Of Switzerland | FREE FIFA Museum Tickets", days: "7 Days / 6 Nights", rating: 4.9, reviews: 90, mainPrice: "$2,500", offerPrice: "$2,000", savedAmount: "$500" },
  ],
  adventure: [
    { id: 4, img: Img6, title: "Glimpse Of Switzerland | FREE FIFA Museum Tickets", days: "6 Days / 5 Nights", rating: 4.6, reviews: 85, mainPrice: "$2,000", offerPrice: "$1,800", savedAmount: "$200" },
    { id: 5, img: Img3, title: "Amsterdam, Paris & Lucerne Tour with FREE Paris Pass", days: "10 Days / 9 Nights", rating: 4.7, reviews: 75, mainPrice: "$1,500", offerPrice: "$1,200", savedAmount: "$300" },
    { id: 6, img: Img4, title: "Glimpse Of Switzerland | FREE FIFA Museum Tickets", days: "6 Days / 5 Nights", rating: 4.6, reviews: 85, mainPrice: "$2,200", offerPrice: "$1,800", savedAmount: "$400" },
  ],
  travel: [
    { id: 7, img: Img5, title: "Glimpse Of Switzerland | FREE FIFA Museum Tickets", days: "10 Days / 9 Nights", rating: 4.7, reviews: 75, mainPrice: "$1,500", offerPrice: "$1,200", savedAmount: "$300" },
    { id: 8, img: Img6, title: "Amsterdam, Paris & Lucerne Tour with FREE Paris Pass", days: "6 Days / 5 Nights", rating: 4.6, reviews: 85, mainPrice: "$2,000", offerPrice: "$1,800", savedAmount: "$200" },
    { id: 9, img: Img5, title: "Glimpse Of Switzerland | FREE FIFA Museum Tickets", days: "10 Days / 9 Nights", rating: 4.7, reviews: 75, mainPrice: "$1,500", offerPrice: "$1,200", savedAmount: "$300" },
  ],
};

const tabs = ["honeymoon", "adventure", "travel", "yatra", "family", "luxury"];

const PackageSection = () => {
  const [activeTab, setActiveTab] = useState<string>("honeymoon");

  const validPackages = packagesData[activeTab as ValidTabs];

  return (
    <div className="package-section">
      <h2 className="package-title">Our Special Packages</h2>
      <hr className="full-width-line" />

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <hr className="full-width-line" />

      <div className="view-all">
        <a href="/all-packages">View All</a>
      </div>

      <div className="package-container">
        {validPackages ? (
          validPackages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <Image
                src={pkg.img}
                alt={pkg.title}
                width={300}
                height={200}
                className="package-image"
              />
              <div className="package-info">
                <div className="info-top">
                  <span className="days">{pkg.days}</span>
                  <span className="rating">
                    ⭐ {pkg.rating} ({pkg.reviews} Reviews)
                  </span>
                </div>
                <h3 className="package-name">{pkg.title}</h3>
                <div className="price-container">
                  <span className="main-price">
                    <s>{pkg.mainPrice}</s>
                  </span>
                  <span className="offer-price">USD {pkg.offerPrice}</span>
                  <span className="saved-price">
                    You Save {pkg.savedAmount}
                  </span>
                </div>
                <div className="buttons">
                  <button className="phone-button">📞</button>
                  <button className="callback-button">Request Callback</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-packages">No packages available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default PackageSection;
