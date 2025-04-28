"use client";
import { useEffect, useState,useMemo,useCallback } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import "./assets/css/globl.css";
import Slider from "react-slick";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers, FaExchangeAlt } from "react-icons/fa";
import Img1 from "./assets/images/destinations/1.svg";
import Img2 from "./assets/images/destinations/2.svg";
import Img3 from "./assets/images/destinations/4.svg";
import Img4 from "./assets/images/destinations/4.svg";
import Img5 from "./assets/images/destinations/5.svg";
import Img6 from "./assets/images/destinations/3.svg";
import border from "./assets/images/border.svg";
import packageimg from "./assets/images/package-section.svg";
import DiscountImage from "./assets/images/discount-image.svg";
import PackageSection from "./components/PackageSection"; 
import Destination from "./components/Destinations"; 
import  TourSection from "./components/TourSection";
import { usePathname } from 'next/navigation';
interface TravelTip {
  id: number;
  image: string;
  title: string;
  description: string;
}
export default function FlightSearch() {
  const [tripType, setTripType] = useState("one-way");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
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
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const travelTips: TravelTip[] = [
      { id: 1, image: "/assets/images/img101.png", title: "How to Save Money on Flights", description: "Learn the best ways to book affordable flights without compromising on comfort." },
      { id: 2, image: "/assets/images/img102.png", title: "Best Packing Tips for Travelers", description: "Discover how to pack efficiently and avoid unnecessary baggage fees." },
      { id: 3, image: "/assets/images/img103.png", title: "Top Travel Safety Tips", description: "Ensure a safe trip by following these essential travel safety guidelines." },
      { id: 4, image: "/assets/images/img104.png", title: "How to Find the Best Hotels", description: "Get expert tips on booking hotels with the best value and amenities." },
      { id: 5, image: "/assets/images/img105.png", title: "Solo Travel Tips for Beginners", description: "Explore the world confidently with these solo travel insights." },
    ];
  
    const [selectedTip, setSelectedTip] = useState(travelTips[0]);
    const [isScrolling, setIsScrolling] = useState(false);
  
  const countrySlider = useMemo(() => [
    { id: 1, img: Img1, country: "France" },
    { id: 2, img: Img6, country: "Japan" },
    { id: 3, img: Img5, country: "Italy" },
    { id: 4, img: Img3, country: "Switzerland" },
  ], []);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBeforeChange = useCallback((oldIndex: number, newIndex: number) => {
    setCurrentSlide(newIndex);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
    centerMode: true,  // Helps with spacing between images
    centerPadding: "10px",  // Adjusts spacing
  };

  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  type Travelers = {
    adults: number;
    children: number;
    infantsSeat: number;
    infantsLap: number;
  };
  
  
  const handleTravelerChange = (type: keyof Travelers, increment: boolean) => {
    setTravelers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1)),
    }));
  };
  
  const destinations = [
    { id: 1, img: Img1, city: "Paris", country: "France", price: "$599" },
    { id: 2, img: Img2, city: "Tokyo", country: "Japan", price: "$799" },
    { id: 3, img: Img3, city: "New York", country: "USA", price: "$499" },
    { id: 4, img: Img4, city: "Dubai", country: "UAE", price: "$899" },
    { id: 5, img: Img5, city: "Rome", country: "Italy", price: "$649" },
    { id: 6, img: Img6, city: "Sydney", country: "Australia", price: "$999" },
  ];
  return (
    <div className="container py-5">
      <h1 className="text-left fw-bold">Search Flights</h1>
      <p className="text-left text-muted">Find the best flights with our easy-to-use search tool.</p>

      <hr className="my-4" />

      {/* Tabs */}
      <div className="trip-type">
    <a href="#" className="active">One Way</a>
    <a href="#">Round Trip</a>
    <a href="#">Multi-City</a>
</div>

      {/* Flight Search Form */}
    <div className="bg-light p-4 rounded shadow">
      <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
  {/* Leaving From */}
  <div className="custom-input position-relative">
    <InputGroup className="custom-input">
      <InputGroup.Text><FaPlaneDeparture /></InputGroup.Text>
      <Form.Control type="text" placeholder="Leaving From" />
    </InputGroup>
  </div>

  {/* Swap Icon Inside a Circle */}
  <div className="swap-icon-circle">
    <FaExchangeAlt />
  </div>

  {/* Going To */}
  <div className="custom-input position-relative">
    <InputGroup className="custom-input">
      <InputGroup.Text><FaPlaneArrival /></InputGroup.Text>
      <Form.Control type="text" placeholder="Going To" />
    </InputGroup>
  </div>

  {/* Date Picker */}
  <div className="custom-input position-relative">
    <InputGroup className="custom-input">
      <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
      <Form.Control type="date" />
    </InputGroup>
  </div>

  {/* Travelers Dropdown */}
  <div className="custom-input position-relative">
  <InputGroup>
    <InputGroup.Text><FaUsers /></InputGroup.Text>
    <Form.Control
      type="text"
      readOnly
      value={`${travelers.adults} Adults, ${travelers.children} Children`}
      onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
    />
  </InputGroup>

  {showTravelerDropdown && (
    <div className="traveler-dropdown">
      {(Object.keys(travelers) as Array<keyof Travelers>).map((type) => (
        <div key={type} className="traveler-item">
          <span className="text-capitalize">{type.replace(/([A-Z])/g, " $1")}</span>
          <div className="traveler-controls">
            <Button size="sm" onClick={() => handleTravelerChange(type, false)}>-</Button>
            <span className="count">{travelers[type]}</span>
            <Button size="sm" onClick={() => handleTravelerChange(type, true)}>+</Button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

     </div>


        {/* Checkboxes */}
        <div className="d-flex gap-4 mt-3">
          <Form.Check type="checkbox" label="Add a place to stay" />
          <Form.Check type="checkbox" label="Add a car" />
        </div>

        {/* Search Button */}
        <div className="text-center mt-4">
          <Button variant="primary" size="lg">Search Flights</Button>
        </div>
      </div>
    {/* </div> */}

    <hr className="my-4" />
     {/* Travel Destinations Section */}
     <div className="container text-center py-5">
      {/* Title & Description */}
      <h2 className="fw-bold">Explore the {`World's`} Most Beautiful Destinations</h2>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: "600px" }}>
        Discover breathtaking landscapes, stunning beaches, and unique cultural experiences.
      </p>

      {/* Bootstrap Grid for 2 Rows, 3 Columns */}
      <div className="row g-3">
        {destinations.map((dest) => (
          <div key={dest.id} className="col-md-4">
            <div className="destination-card p-3">
              <Image
                src={dest.img}
                alt={`${dest.city}, ${dest.country}`}
                width={320}
                height={220}
                className="img-fluid rounded"
              />
            </div>
              {/* Flight Icon and Details */}
            <div className="d-flex justify-content-center align-items-center">
              {/* First Column: Flight Icon */}
              <div className="flight-icon me-3">✈️</div>

              {/* Second Column: City & Price in Two Rows */}
              <div className="d-flex flex-column text-start">
                <h6 className="mb-1"> 
                  <span className="city-name"> {dest.city}</span>,
                  <span className="country-name">{dest.country}</span>
                </h6>
                <p className="price-text">{dest.price} Onwards</p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>

    <div className="section-container">
  {/* Image goes to top on mobile */}
  <div className="image-container">
    <div className="border-wrapper">
      <Image src={border} alt="Border Shape" layout="responsive" width={300} height={350} className="border-image" />
      <div className="main-wrapper">
        <Image src={packageimg} alt="Travel Destination" layout="responsive" width={300} height={350} className="main-image" />
      </div>
    </div>
  </div>

  <div className="text-container">
    <h2 className="title">Unbeatable Deals on Must-Book Travel Packages, Crafted for Your Budget</h2>
    <p className="description">
      Explore the thrill of a lifetime with Fantastic Fare’s must-explore packages! Our top picks promise unforgettable adventures and hidden gems. Dive into your next exciting journey today!
    </p>

    {/* Slider */}
    <div className="slider-container">
      <Slider {...settings}>
        {countrySlider.map((dest) => (
          <div key={dest.id} className="slide">
            <div className="image-wrapper">
              <Image src={dest.img} alt={dest.country} width={500} height={500} className="slider-image" />
              <span className="country-name">{dest.country}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>

    <button className="ultimate-btn">Ultimate Packages</button>
  </div>
</div>



<div className="discount-banner">
  <Image src={DiscountImage} alt="Discount Banner" className="discount-image" />
  <div className="discount-text">Save upto <br></br><span>30%</span></div>
</div>

<PackageSection/>


<Destination/>
 {/* Section Header */}
      <div className="d-flex justify-content-between align-items-end p-4 rounded mt-5">
        <div className="w-75">
          <h2 className="mb-3">Tips & Articles</h2>
          <p>Discover essential travel insights, money-saving strategies, and expert tips to enhance your journey.</p>
        </div>
      </div>

      {/* Travel Tips Section */}
      <div className="row">
        <div className="col-md-4">
          <div
            className="scrollable-tips"
            id="scroll-tips"
            onMouseEnter={() => setIsScrolling(true)}
            onMouseLeave={() => setIsScrolling(false)}
          >
            {travelTips.map((tip) => (
              <div
                key={tip.id}
                className={`article-box p-3 mb-3 shadow-sm rounded bg-light ${selectedTip.id === tip.id ? 'active' : ''}`}
                onClick={() => setSelectedTip(tip)}
              >
                <span className="tip-label">Perfect | Tips</span>
                <h5 className="article-title">{tip.title}</h5>
                <p className="article-description">{tip.description}</p>
                <button className="btn btn-primary btn-sm custom-btn">Read More</button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          <div className="article-image-box shadow-sm rounded overflow-hidden">
            <Image 
              src={selectedTip.image} 
              alt={selectedTip.title} 
              className="img-fluid w-100" 
              width={800}
              height={400}
            />
            <div className="p-3">
              <span className="tip-label">Perfect | Tips</span>
              <h4 className="article-title">{selectedTip.title}</h4>
              <p className="article-description">{selectedTip.description}</p>
              <button className="btn btn-primary custom-btn">Read More</button>
            </div>
          </div>
        </div>
      </div>
        <TourSection/>
 </div>
 
  );
}
