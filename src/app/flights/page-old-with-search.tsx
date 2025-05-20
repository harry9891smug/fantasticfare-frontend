"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers, FaExchangeAlt, FaAngleDown,FaPhone,FaChevronRight,FaChevronLeft, FaAngleUp } from "react-icons/fa";
import Image from "next/image";
import indigo from "../assets/images/indigo.svg";
import goair from "../assets/images/goair.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/flights.css"; 
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface Travelers {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

interface DateItem {
  day: string;
  price: string;
}
interface FlightSegment {
  from: string;
  to: string;
  date: string;
}
const FlightSearch = () => {
  const [filtersOpen, setFiltersOpen] = useState({
    stops: true,
    departureTime: true,
    priceRange: true,
    airlines: true,
    tripDuration: true,
    departureAirport: true,
  });
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'multi-city'>('round-trip');
  const cabinOptions = [
    { value: 'Economy', label: 'Economy' },
    { value: 'Premium economy', label: 'Premium economy' },
    { value: 'Business class', label: 'Business class' },
    { value: 'First class', label: 'First class' },
  ];
  const filtersRef = useRef<HTMLDivElement>(null);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [sortDirection, setSortDirection] = useState("left");
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");


  const dates: DateItem[] = [
    { day: "Tue, 11 Mar", price: "$4,708" },
    { day: "Wed, 12 Mar", price: "$4,029" },
    { day: "Thu, 13 Mar", price: "$4,114" },
    { day: "Fri, 14 Mar", price: "$4,325" },
    { day: "Sat, 15 Mar", price: "$4,114" },
    { day: "Sun, 16 Mar", price: "$4,325" },
    { day: "Mon, 17 Mar", price: "$4,399" }
  ];
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  const toggleFilter = (filter: keyof typeof filtersOpen) => {
    setFiltersOpen(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
      setFiltersOpen({
        stops: false,
        departureTime: false,
        priceRange: false,
        airlines: false,
        tripDuration: false,
        departureAirport: false,
      });
    }
  };
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' }
  ]);
 
  const addFlightSegment = () => {
    setFlightSegments([...flightSegments, { from: '', to: '', date: '' }]);
  };
    // Update flight segment
  const updateFlightSegment = (index: number, field: keyof FlightSegment, value: string) => {
    const updatedSegments = [...flightSegments];
    updatedSegments[index] = { ...updatedSegments[index], [field]: value };
    setFlightSegments(updatedSegments);
  };

  // Remove flight segment
  const removeFlightSegment = (index: number) => {
    if (flightSegments.length > 1) {
      const updatedSegments = [...flightSegments];
      updatedSegments.splice(index, 1);
      setFlightSegments(updatedSegments);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTravelerChange = (type: keyof Travelers, increment: boolean) => {
    setTravelers(prev => ({
      ...prev,
      [type]: Math.max(0, increment ? prev[type] + 1 : prev[type] - 1)
    }));
  };

  return (
    <div className="container py-5">
      {/* Tabs */}
      <div className="trip-type-container">
        <div className="trip-type">
          <button 
            className={tripType === 'one-way' ? 'active' : ''}
            onClick={() => setTripType('one-way')}
          >
            One Way
          </button>
          <button 
            className={tripType === 'round-trip' ? 'active' : ''}
            onClick={() => setTripType('round-trip')}
          >
            Round Trip
          </button>
          <button 
            className={tripType === 'multi-city' ? 'active' : ''}
            onClick={() => setTripType('multi-city')}
          >
            Multi-City
          </button>
          
          {/* Cabin Class Dropdown */}
          <div className="cabin-dropdown-container">
            <button 
              className="cabin-dropdown-trigger"
              onClick={() => setShowCabinDropdown(!showCabinDropdown)}
            >
              <span>{cabinClass}</span>
              {showCabinDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            
            {showCabinDropdown && (
              <div className="cabin-dropdown-menu">
                <ul>
                  {cabinOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        className={cabinClass === option.value ? 'selected' : ''}
                        onClick={() => {
                          setCabinClass(option.value);
                          setShowCabinDropdown(false);
                        }}
                      >
                        {option.label}
                        {cabinClass === option.value && <FaCheck />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flight Search Form */}
      <div className="p-4 rounded">
  <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
    {/* Leaving From */}
    <div className="position-relative">
      <InputGroup className="custom-input">
        <InputGroup.Text><FaPlaneDeparture /></InputGroup.Text>
        <Form.Control type="text" placeholder="Leaving From" />
      </InputGroup>
    </div>

    {/* Swap Icon */}
    <div className="swap-icon-circle">
      <FaExchangeAlt />
    </div>

    {/* Going To */}
    <div>
      <InputGroup className="custom-input">
        <InputGroup.Text><FaPlaneArrival /></InputGroup.Text>
        <Form.Control type="text" placeholder="Going To" />
      </InputGroup>
    </div>

    {/* Date Picker */}
    <div>
      <InputGroup className="custom-input">
        <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
        <Form.Control type="date" />
      </InputGroup>
    </div>
    {tripType === 'round-trip' && (
      <div>
        <InputGroup className="custom-input">
          <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
          <Form.Control type="date" placeholder="Return" />
        </InputGroup>
      </div>
    )}

   
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
          {Object.entries(travelers).map(([type, count]) => (
            <div key={type}>
              <span className="text-capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
              <div className="traveler-controls">
                <Button size="sm" onClick={() => handleTravelerChange(type as keyof Travelers, false)}>-</Button>
                <span className="count">{count}</span>
                <Button size="sm" onClick={() => handleTravelerChange(type as keyof Travelers, true)}>+</Button>
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
  {/* New Email and Phone Fields */}
  <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mt-3">
    {/* Email Field */}
    <div className="custom-input">
      <InputGroup>
        <InputGroup.Text>@</InputGroup.Text>
        <Form.Control
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputGroup>
    </div>

    {/* Phone Field */}
    <div className="custom-input position-relative">
      <InputGroup>
        <InputGroup.Text><FaPhone /></InputGroup.Text>
        <Form.Control
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </InputGroup>
    </div>
  </div>

  

  {/* Search Button */}
  <div className="text-center mt-4">
    <Button className="btn-search" variant="primary" size="lg">Search Flights</Button>
  </div>

  <div className="mb-3">
          <h5>Travelers</h5>
          <div className="d-flex align-items-center">
            <span>1 traveler</span>
            <Button variant="link" onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}>
              Edit
            </Button>
          </div>
        </div>

        {/* Flight Segments */}
        {flightSegments.map((segment, index) => (
          <div key={index} className="flight-segment mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Flight {index + 1}</h5>
              {flightSegments.length > 1 && (
                <Button 
                  variant="link" 
                  className="text-danger"
                  onClick={() => removeFlightSegment(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {/* Leaving From */}
              <div className="position-relative flex-grow-1">
                <InputGroup className="custom-input">
                  <InputGroup.Text><FaPlaneDeparture /></InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    placeholder="Leaving From" 
                    value={segment.from}
                    onChange={(e) => updateFlightSegment(index, 'from', e.target.value)}
                  />
                </InputGroup>
              </div>

              {/* Swap Icon - only show if not the last segment */}
              {index < flightSegments.length - 1 && (
                <div className="swap-icon-circle">
                  <FaExchangeAlt />
                </div>
              )}

              {/* Going To */}
              <div className="flex-grow-1">
                <InputGroup className="custom-input">
                  <InputGroup.Text><FaPlaneArrival /></InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    placeholder="Going To" 
                    value={segment.to}
                    onChange={(e) => updateFlightSegment(index, 'to', e.target.value)}
                  />
                </InputGroup>
              </div>

              {/* Date Picker */}
              <div className="flex-grow-1">
                <InputGroup className="custom-input">
                  <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                  <Form.Control 
                    type="date" 
                    value={segment.date}
                    onChange={(e) => updateFlightSegment(index, 'date', e.target.value)}
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Flight button */}
        <div className="text-center mt-3">
          <Button 
            variant="outline-primary" 
            onClick={addFlightSegment}
            className="d-flex align-items-center justify-content-center mx-auto"
          >
            + Add another flight
          </Button>
        </div>
</div>

      {/* Main Content */}
      <div className="row" ref={filtersRef}>
        {/* Sidebar Filters */}
        <div className="col-md-3">
          <div className="p-3">
            {/* Stops Filter */}
            <div className="d-flex justify-content-between align-items-center filter-header" onClick={() => toggleFilter("stops")}>
              <h5>Stops</h5>
              {filtersOpen.stops ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {filtersOpen.stops && (
              <div className="filter-options">
                {['Non-stop', '1 stop', '2 stops', '2+ stops'].map((option, i) => (
                  <div key={i} className="form-check">
                    <input type="checkbox" className="form-check-input" id={`stop-${i}`} />
                    <label className="form-check-label" htmlFor={`stop-${i}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Departure Time Filter */}
            <div className="d-flex justify-content-between align-items-center filter-header" onClick={() => toggleFilter("departureTime")}>
              <h5>Departure Time</h5>
              {filtersOpen.departureTime ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {filtersOpen.departureTime && (
              <div className="filter-options">
                {['Morning (6am-12pm)', 'Afternoon (12pm-6pm)', 'Evening (6pm-12am)', 'Night (12am-6am)'].map((option, i) => (
                  <div key={i} className="form-check">
                    <input type="checkbox" className="form-check-input" id={`time-${i}`} />
                    <label className="form-check-label" htmlFor={`time-${i}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Airlines Filter */}
            <div className="d-flex justify-content-between align-items-center filter-header" onClick={() => toggleFilter("airlines")}>
              <h5>Airlines</h5>
              {filtersOpen.airlines ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {filtersOpen.airlines && (
              <div className="filter-options">
                {['Indigo', 'Air India', 'Vistara', 'Akasa Air'].map((airline, i) => (
                  <div key={i} className="form-check">
                    <input type="checkbox" className="form-check-input" id={`airline-${i}`} />
                    <label className="form-check-label" htmlFor={`airline-${i}`}>{airline}</label>
                  </div>
                ))}
              </div>
            )}

            {/* Price Range Filter */}
            <div className="d-flex justify-content-between align-items-center filter-header" onClick={() => toggleFilter("priceRange")}>
              <h5>Price Range</h5>
              {filtersOpen.priceRange ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {filtersOpen.priceRange && (
              <div className="filter-options">
                {['$50 - $200', '$200 - $500', '$500 - $1000', '$1000+'].map((range, i) => (
                  <div key={i} className="form-check">
                    <input type="checkbox" className="form-check-input" id={`price-${i}`} />
                    <label className="form-check-label" htmlFor={`price-${i}`}>{range}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flight Results */}
        <div className="col-md-9">
          <Slider {...settings} className="mb-4 custom-slider">
            {dates.map((date, index) => (
              <div key={index} className="text-center p-2">
                <div
                  className={`p-2 border rounded bg-light ${selectedDate === date.day ? 'selected-date' : ''}`}
                  onClick={() => setSelectedDate(date.day)}
                >
                  <strong>{date.day}</strong>
                  <span className="text-success">{date.price}</span>
                </div>
              </div>
            ))}
          </Slider>

          <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3">
            <strong>Airlines</strong>
            <strong>Departure</strong>
            <strong>Duration</strong>
            <strong>Arrivals</strong>
            <strong>Price</strong>
            <div>
              <Button 
                variant={sortDirection === "left" ? "primary" : "secondary"}
                onClick={() => setSortDirection(sortDirection === "left" ? "right" : "left")}
              >
                {sortDirection === "left" ? "⬅️ Left" : "➡️ Right"}
              </Button>
            </div>
          </div>

          {/* Flight Listings */}
          {[1, 2, 3, 4, 5].map((flight, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center border p-3 my-2">
              <div className="d-flex align-items-center">
                <Image 
                  src={index % 2 === 0 ? indigo : goair} 
                  alt="Airline" 
                  width={40}
                  height={40}
                  className="me-2"
                />
                <div>
                  <strong>Akasa Air</strong>
                  <p className="mb-0 text-muted">QP-1366</p>
                </div>
              </div>
              <div>
                <strong>21:10</strong>
                <p className="mb-0 text-muted">1h 50m non-stop</p>
              </div>
              <div>
                <strong>23:00</strong>
              </div>
              <div>
                <strong>$4,708</strong>
                <p className="text-success">Get $215 off</p>
              </div>
              <Button variant="primary">Book</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-arrow next`}
    style={{ ...style, right: "-15px", color: "black", top: "17px" }}
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-arrow prev`}
    style={{ ...style, left: "-15px", color: "black", top: "17px" }}
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
);

export default FlightSearch;