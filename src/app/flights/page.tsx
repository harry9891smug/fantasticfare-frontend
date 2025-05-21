"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers, FaExchangeAlt, FaAngleDown, FaPhone, FaChevronRight, FaChevronLeft, FaAngleUp } from "react-icons/fa";
import Image from "next/image";
import indigo from "../assets/images/indigo.svg";
import gif from "../assets/images/app.gif";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/flights.css";
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
interface AirportData {
  iata: string;
  city: string;
  country: string;
}
interface FormData {
  tripType: string;
  leavingFrom: string[];
  goingTo: string[];
  startDate: Date;
  returnDate: Date;
  mobile_number: string;
  email: string;
  travellers: Travelers;
  cabinClass: string;
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
  const [airportSuggestions, setAirportSuggestions] = useState<AirportData[]>([]);
  const [focusedField, setFocusedField] = useState<'leavingFrom' | 'goingTo' | null>(null);
  const [formErrors, setFormErrors] = useState<FormData>({} as FormData);



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
  const [formData, setFormData] = useState<FormData>({
    travellers: travelers,
    cabinClass: 'economy',
    tripType: 'round-trip'
  } as FormData);
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
    const updatedTravelers: Travelers = {
      ...travelers,
      [type]: Math.max(0, increment ? travelers[type] + 1 : travelers[type] - 1)
    };
    setTravelers(updatedTravelers);
    setFormData(prev => ({
      ...prev,
      travellers: updatedTravelers
    }));
  };
  const handleAirportChange = async (e: React.ChangeEvent, type: 'leavingFrom' | 'goingTo') => {
    const value = e.target.value;
    setFocusedField(type);
    if (value.length < 3) {
      setAirportSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/airportSuggestions?area=${value}`
      );
      setAirportSuggestions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching airport suggestions:', error);
    }


  };
  const handleAirportSelect = (airport: string) => {
    if (focusedField === 'leavingFrom') {
      document.querySelector<HTMLInputElement>('input[name="leavingFrom"]')!.value = airport;
    } else if (focusedField === 'goingTo') {
      document.querySelector<HTMLInputElement>('input[name="goingTo"]')!.value = airport;
    }
    setFormData(prev => ({
      ...prev,
      [focusedField!]: airport,
    }));

    setAirportSuggestions([]);
    setFocusedField(null);
  };

  const exchangeAreas = () => {
    setFormData(prev => ({
      ...prev,
      leavingFrom: prev.goingTo,
      goingTo: prev.leavingFrom,
    }));
  };
  const submitForm = async () => {
    try {
      console.log(formData);
      if (!formData.email) {
        setFormErrors(prev => ({
          ...prev,
          email: 'Please Enter Email'

        }))
        return
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flight-enquiry`,
        formData
      );

      console.log('Enquiry submitted:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="container py-5">
      {/* Tabs */}
      <div className="trip-type-container">
        <div className="trip-type">
          <button
            className={formData.tripType === 'one-way' ? 'active' : ''}
            onClick={() => setFormData(prev => ({ ...prev, tripType: 'one-way' }))}
          >
            One Way
          </button>
          <button
            className={formData.tripType === 'round-trip' ? 'active' : ''}
            onClick={() => setFormData(prev => ({ ...prev, tripType: 'round-trip' }))}
          >
            Round Trip
          </button>
          <button
            className={formData.tripType === 'multi-city' ? 'active' : ''}
            onClick={() => setFormData(prev => ({ ...prev, tripType: 'multi-city' }))}
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
                        className={formData.cabinClass === option.value ? 'selected' : ''}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            cabinClass: option.value,
                          }));
                          setShowCabinDropdown(false);
                        }}
                      >
                        {option.label}
                        {formData.cabinClass === option.value && <FaCheck />}
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
      <div className="p-4 rounded border border-primary" style={{ borderWidth: '2px' }}>
        {/* Travelers Dropdown - Now appears consistently at the top for all trip types */}
        <div className="custom-input position-relative mb-3">
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

        {/* One-Way Trip Form */}
        {formData.tripType === 'one-way' && (
          <div className="d-flex align-items-center  gap-3 flex-wrap">
            {/* Leaving From */}
            <div className="custom-input position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text><FaPlaneDeparture /></InputGroup.Text>
                <Form.Control type="text" placeholder="Leaving From" value={formData.leavingFrom} onChange={(e) => handleAirportChange(e, 'leavingFrom')} name='leavingFrom' />
              </InputGroup>
              {focusedField === 'leavingFrom' && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleAirportSelect(`${airportData.iata}-${airportData.city}(${airportData.country})`)}
                    >
                      {airportData.iata}-{airportData.city}({airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Icon */}
            <div className="swap-icon-circle"
              onClick={exchangeAreas}
            >
              <FaExchangeAlt />
            </div>

            {/* Going To */}
            <div className="custom-input position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text><FaPlaneArrival /></InputGroup.Text>
                <Form.Control type="text" placeholder="Going To" value={formData.goingTo} onChange={(e) => handleAirportChange(e, 'goingTo')} name="goingTo" />
              </InputGroup>
              {focusedField === 'goingTo' && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleAirportSelect(`${airportData.iata}-${airportData.city}(${airportData.country})`)}
                    >
                      {airportData.iata}-{airportData.city}({airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div className="custom-input position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date: Date | null) =>
                    setFormData(prev => ({
                      ...prev,
                      startDate: date,
                    }))
                  }
                  customInput={
                    <Form.Control type="text" readOnly />
                  }
                  dateFormat="MM-dd-yyyy"
                  minDate={new Date()}
                  placeholderText="Select Date"
                />
              </InputGroup>
            </div>
          </div>
        )}

        {/* Round-Trip Form */}
        {formData.tripType === 'round-trip' && (
          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
            {/* Leaving From */}
            <div className="custom-input position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text><FaPlaneDeparture /></InputGroup.Text>
                <Form.Control type="text" placeholder="Leaving From" onChange={(e) => handleAirportChange(e, 'leavingFrom')} name='leavingFrom' />
              </InputGroup>
              {focusedField === 'leavingFrom' && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleAirportSelect(`${airportData.iata}-${airportData.city}(${airportData.country})`)}
                    >
                      {airportData.iata}-{airportData.city}({airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Icon */}
            <div className="swap-icon-circle" onClick={exchangeAreas}>
              <FaExchangeAlt />
            </div>

            {/* Going To */}
            <div className="custom-input position-relative mb-3">
              <div className="custom-input position-relative mb-3">
                <InputGroup className="custom-input">
                  <InputGroup.Text><FaPlaneArrival /></InputGroup.Text>
                  <Form.Control type="text" placeholder="Going To" onChange={(e) => handleAirportChange(e, 'goingTo')} name="goingTo" />
                </InputGroup>
                {focusedField === 'goingTo' && airportSuggestions.length > 0 && (
                  <div className="autocomplete-dropdown">
                    {airportSuggestions.map((airportData, index) => (
                      <div
                        key={index}
                        className="autocomplete-item"
                        onClick={() => handleAirportSelect(`${airportData.iata}-${airportData.city}(${airportData.country})`)}
                      >
                        {airportData.iata}-{airportData.city}({airportData.country})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Departure Date */}
            <div className="custom-input position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date: Date | null) =>
                    setFormData(prev => ({
                      ...prev,
                      startDate: date,
                    }))
                  }
                  customInput={
                    <Form.Control type="text" readOnly />
                  }
                  dateFormat="MM-dd-yyyy"
                  minDate={new Date()}
                  placeholderText="Select Date"
                />
              </InputGroup>
            </div>

            {/* Return Date */}
            <div className="custom-input position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <DatePicker
                  selected={formData.returnDate}
                  onChange={(date: Date | null) =>
                    setFormData(prev => ({
                      ...prev,
                      returnDate: date,
                    }))
                  }
                  customInput={
                    <Form.Control type="text" readOnly />
                  }
                  dateFormat="MM-dd-yyyy"
                  minDate={!formData.startDate ? new Date() : formData.startDate}
                  placeholderText="Select Date"
                />
              </InputGroup>
            </div>
          </div>
        )}

        {/* Multi-City Form */}
        {formData.tripType === 'multi-city' && (
          <>
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

                <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
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
            <div className=" mt-3">
              <Button
                variant="outline-primary"
                onClick={addFlightSegment}
                className="btn-add-more"
              >
                + Add another flight
              </Button>
            </div>
          </>
        )}

        {/* Common Elements (checkboxes, email/phone, search button) */}
        <div className="d-flex gap-4 mt-3">
          <Form.Check type="checkbox" label="Add a place to stay" />
          <Form.Check type="checkbox" label="Add a car" />
        </div>

        <div className="d-flex align-items-center  gap-3 flex-wrap mt-3">
          {/* Email Field */}
          <div className="custom-input">
            <InputGroup>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                className="is-invalid"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value,
                }))
                }
              />
              {formErrors.email && (
                <div className="invalid-feedback">
                  <strong>{formErrors.email}</strong>
                </div>
              )}
            </InputGroup>
          </div>

          {/* Phone Field */}
          <div className="custom-input position-relative">
            <InputGroup>
              <InputGroup.Text><FaPhone /></InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                value={formData.mobile_number}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mobile_number: e.target.value,
                }))
                }
              />
            </InputGroup>
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center mt-4">
          <Button className="btn-search" variant="primary" size="lg" onClick={submitForm}>Search Flights</Button>
        </div>




      </div>

      {/* Main Content */}
      <div className="flex justify-center -mt-2 mb-4">
        <div className="border-x-2 border-b-2 border-blue-400 rounded-b-lg overflow-hidden max-w-md w-full">
          <Image
            src={gif}
            alt="Decorative animation"
            width={800}  // Adjust based on your GIF dimensions
            height={100} // Adjust based on your GIF dimensions
            className="w-full h-auto object-cover"
            style={{
              display: 'block',
              margin: '0 auto',
            }}
          />
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