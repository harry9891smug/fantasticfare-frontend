"use client";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import HotelSearchComponent from "../components/HotelSearchComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/newhotels.css";
import Hotel1 from "../assets/images/first-up.svg";
import Hotel2 from "../assets/images/second-down.svg";
import Hotel3 from "../assets/images/middle.svg";
import Hotel4 from "../assets/images/third-up.png";
import Hotel5 from "../assets/images/thiird-down.svg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
const HotelSearch = () => {
 const recommendedHotels = [
  {
    name: "Taj Ecotica Resort & Spa, Goa",
    rating: "5-star Resort - Branellin",
    price: "$0000 + $000 taxes & fees / night",
    discount: "Additional bank discounts",
    images: [Hotel1, Hotel2, Hotel3], // multiple images here
  },
  {
    name: "ITC Grand Goa, a Luxury Collection Resort & Spa",
    rating: "5-star Resort - Anestim",
    price: "$0000 + $000 taxes & fees / night",
    discount: "No cost EMI from €8,850",
    images: [Hotel2, Hotel4, Hotel5],
  },
  {
    name: "The LaLiT Golf & Spa Resort, Goa",
    rating: "5-star Resort - Canacona",
    price: "$0000 + taxes & fees / night",
    discount: "30% off No cost EMI from €3,924",
    ratings: "4.5 600+ ratings",
    images: [Hotel3, Hotel1, Hotel5],
  },
  {
    name: "Novotel Goa Dona Sylvia Resort",
    rating: "4-star Hotel - Canbellin",
    price: "$0000 + taxes & fees / night",
    discount: "23% off No cost EMI from €2,028",
    ratings: "4.5 250+ ratings",
    images: [Hotel4, Hotel3, Hotel2],
  },
];


  const popularDestinations = [
  {
    name: "Mumbai",
    location: "Maharashtra, India",
    price: "$6,019",
    category: "avg. nightly price",
    images: [Hotel1, Hotel2, Hotel3],
  },
  {
    name: "Goa",
    location: "Goa, India",
    price: "$5,200",
    category: "avg. nightly price",
    images: [Hotel2, Hotel3, Hotel4],
  },
  {
    name: "Delhi",
    location: "Delhi, India",
    price: "$4,800",
    category: "avg. nightly price",
    images: [Hotel5, Hotel3, Hotel1],
  }
];


  const travelDeals = [
    { title: "Well Furnished Apartment", location: "100 Smart Street, LA, USA", price: "$1000 – 5000 USD", images: [Hotel1, Hotel4, Hotel5], },
    { title: "Blue Door Villa Modern", location: "100 Smart Street, LA, USA", price: "$1000 – 5000 USD",images: [Hotel3, Hotel4, Hotel5],},
    { title: "Beach House Apartment", location: "100 Smart Street, LA, USA", price: "$1000 – 5000 USD" , images: [Hotel1, Hotel2, Hotel3],},
    { title: "Country Boys Hostel", location: "100 Smart Street, LA, USA", price: "$1000 – 5000 USD", images: [Hotel2, Hotel3, Hotel4], },
    { title: "Large Family Flat on Rent", location: "100 Smart Street, LA, USA", price: "$1000 – 5000 USD", images: [Hotel3, Hotel4, Hotel5], }
  ];

  const categories = ["Beach", "Culture", "Adventure", "Family", "Wellness & Relaxation"];

  return (
    <div className="container hotel-search-container">
      <HotelSearchComponent />
      
      <div className="recommended-section">
        <h2>Recommended stays for you</h2>
        <p className="subtitle">Based on your most recently viewed property</p>
        
        <div className="voucher-banner">
          <h3>Get Taj voucher worth upto £2000</h3>
        </div>

       <Row className="hotel-grid">
  {recommendedHotels.map((hotel, index) => (
    <Col md={3} key={index} className="hotel-card">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        style={{ width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden" }}
      >
        {hotel.images.map((imgSrc, idx) => (
          <SwiperSlide key={idx}>
            <div style={{ position: "relative", width: "100%", height: "200px" }}>
              <Image
                src={imgSrc}
                alt={`${hotel.name} image ${idx + 1}`}
                fill
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <h3 className="hotel-name">{hotel.name}</h3>
      <p className="hotel-rating">{hotel.rating}</p>
      <p className="hotel-price">{hotel.price}</p>
      <p className="hotel-discount">{hotel.discount}</p>
      {hotel.ratings && <p className="hotel-ratings">{hotel.ratings}</p>}
    </Col>
  ))}
</Row>

      </div>

      <div className="destinations-section">
        <h2>Explore stays in popular destinations</h2>
        
        <div className="categories">
          {categories.map((category, index) => (
            <span key={index} className="category-badge">{category}</span>
          ))}
        </div>

        <Row className="destination-grid">
  {popularDestinations.map((destination, index) => (
    <Col md={4} key={index} className="destination-card">
      <div className="destination-images">
        <div className="left-image">
          <Image
            src={destination.images[0]}
            alt={`${destination.name} 1`}
            fill
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
        </div>
        <div className="right-images">
          <div className="top-image">
            <Image
              src={destination.images[1]}
              alt={`${destination.name} 2`}
              fill
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="bottom-image">
            <Image
              src={destination.images[2]}
              alt={`${destination.name} 3`}
              fill
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>

      <div className="destination-info">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-location">{destination.location}</p>
        <div className="destination-price-info">
          <p className="destination-price">{destination.price}</p>
          <p className="destination-category">{destination.category}</p>
        </div>
      </div>
    </Col>
  ))}
</Row>

      </div>

      <div className="deals-section">
        <h2>This Week's Top Travel Deals</h2>
        
  <Row className="deals-grid" >
  {travelDeals.map((deal, index) => (
    <Col 
      md={4} 
      key={index} 
      className="deal-card" 
      style={{ padding: "0 10px", boxSizing: "border-box" }}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        style={{ width: "100%", height: "300px", borderRadius: "8px", overflow: "hidden" }}
      >
        {deal.images.map((imgSrc, idx) => (
          <SwiperSlide key={idx}>
            <div 
              className="deal-image-container" 
              style={{ 
                position: "relative", 
                width: "100%", 
                height: "300px", 
                borderRadius: "8px", 
                overflow: "hidden" 
              }}
            >
              <Image
                src={imgSrc}
                alt={`${deal.title} image ${idx + 1}`}
                fill
                className="deal-image"
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <span 
                className="deal-price" 
                style={{ 
                  position: "absolute", 
                  bottom: "10px", 
                  left: "10px", 
                  backgroundColor: "rgba(0,0,0,0.6)", 
                  color: "#fff", 
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {deal.price}
              </span>
              <span 
                className="deal-favorite-icon" 
                style={{ 
                  position: "absolute", 
                  top: "10px", 
                  right: "10px", 
                  color: "white", 
                  fontSize: "20px", 
                  cursor: "pointer" 
                }}
              >
                ♡
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <h3 className="deal-title" style={{ marginTop: "12px" }}>{deal.title}</h3>
      <p className="deal-location">{deal.location}</p>
    </Col>
  ))}
</Row>





      </div>
    </div>
  );
};

export default HotelSearch;