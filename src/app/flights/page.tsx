"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Form, Button, InputGroup } from "react-bootstrap";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUsers,
  FaExchangeAlt,
  FaAngleDown,
  FaPhone,
  FaChevronRight,
  FaChevronLeft,
  FaAngleUp,
  FaTimes
} from "react-icons/fa";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/flights.css";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Tab, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  nearByFlights,
  trendingCities,
  topFlights,
  faqList,
  metaData,
  cabinOptions,
} from "../utils/utilityData";
import { Chip, Stack, Grid } from "@mui/material";
import Accordion from "react-bootstrap/Accordion";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SuccessPopup from "../components/successPopup";
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
  leavingFrom: string;
  goingTo: string;
  startDate: Date | null;
  returnDate: Date | null;
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
  const [cabinClass, setCabinClass] = useState("Economy");
  const [tripType, setTripType] = useState<
    "one-way" | "round-trip" | "multi-city"
  >("round-trip");
  const [airportSuggestions, setAirportSuggestions] = useState<AirportData[]>(
    []
  );
  const [focusedField, setFocusedField] = useState<
    "leavingFrom" | "goingTo" | null
  >(null);
  const [formErrors, setFormErrors] = useState<FormData>({} as FormData);

  const filtersRef = useRef<HTMLDivElement>(null);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [formData, setFormData] = useState<FormData>({
    travellers: travelers,
    cabinClass: cabinClass,
    tripType: "round-trip",
  } as FormData);
  const [sortDirection, setSortDirection] = useState("left");
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    { from: "", to: "", date: "" },
    { from: "", to: "", date: "" },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    content: "",
    isSuccess: true,
  });

  const dates: DateItem[] = [
    { day: "Tue, 11 Mar", price: "$4,708" },
    { day: "Wed, 12 Mar", price: "$4,029" },
    { day: "Thu, 13 Mar", price: "$4,114" },
    { day: "Fri, 14 Mar", price: "$4,325" },
    { day: "Sat, 15 Mar", price: "$4,114" },
    { day: "Sun, 16 Mar", price: "$4,325" },
    { day: "Mon, 17 Mar", price: "$4,399" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const toggleFilter = (filter: keyof typeof filtersOpen) => {
    setFiltersOpen((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      filtersRef.current &&
      !filtersRef.current.contains(event.target as Node)
    ) {
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

  const addFlightSegment = () => {
    setFlightSegments([...flightSegments, { from: "", to: "", date: "" }]);
  };
  // Update flight segment
  const updateFlightSegment = (
    index: number,
    field: keyof FlightSegment,
    value: string
  ) => {
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
      [type]: Math.max(
        0,
        increment ? travelers[type] + 1 : travelers[type] - 1
      ),
    };
    setTravelers(updatedTravelers);
    setFormData((prev) => ({
      ...prev,
      travellers: updatedTravelers,
    }));
  };
  const handleAirportChange = async (
    e: React.ChangeEvent,
    type: "leavingFrom" | "goingTo"
  ) => {
    const value = e.target.value;
    setFocusedField(type);
    if (value.length < 3) {
      setAirportSuggestions([]);
      return;
    }
    try {
      console.log(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/airportSuggestions?area=${value}`
      );
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/airportSuggestions?area=${value}`
      );
      setAirportSuggestions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching airport suggestions:", error);
    }
  };
  const handleAirportSelect = (airport: string) => {
    if (focusedField === "leavingFrom") {
      setFormData((prev) => ({
        ...prev,
        leavingFrom: airport, // Now assigning a string
      }));
    } else if (focusedField === "goingTo") {
      setFormData((prev) => ({
        ...prev,
        goingTo: airport, // Now assigning a string
      }));
    }
    setAirportSuggestions([]);
    setFocusedField(null);
  };

  const exchangeAreas = () => {
    setFormData((prev) => ({
      ...prev,
      leavingFrom: prev.goingTo,
      goingTo: prev.leavingFrom,
    }));
  };

  const submitForm = async () => {
    try {
      if (!formData.email) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please Enter Email",
        }));
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flight-enquiry`,
        formData
      );
      setPopupMessage({
        title: "Success!",
        content: "Your flight enquiry has been submitted successfully.",
        isSuccess: true,
      });
      setShowPopup(true);
      resetFormFields();
    } catch (error) {
      setPopupMessage({
        title: "Error",
        content:
          "There was an error submitting your enquiry. Please try again.",
        isSuccess: false,
      });
      setShowPopup(true);
    }
  };

  const resetFormFields = () => {
    setFormData({
      tripType: formData.tripType,
      leavingFrom: "",
      goingTo: "",
      startDate: null,
      returnDate: null,
      mobile_number: "",
      email: "",
      travellers: {
        adults: 1,
        children: 0,
        infantsSeat: 0,
        infantsLap: 0,
      },
      cabinClass: cabinClass,
    });

    setTravelers({
      adults: 1,
      children: 0,
      infantsSeat: 0,
      infantsLap: 0,
    });

    if (formData.tripType === "multi-city") {
      setFlightSegments([{ from: "", to: "", date: "" }]);
    }

    // Clear input field references
    const leavingFromInput = document.querySelector<HTMLInputElement>(
      'input[name="leavingFrom"]'
    );
    const goingToInput = document.querySelector<HTMLInputElement>(
      'input[name="goingTo"]'
    );

    if (leavingFromInput) leavingFromInput.value = "";
    if (goingToInput) goingToInput.value = "";
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClick = () => {
    console.log("You clicked the Chip.");
  };

  return (
    <div className="container py-5">
      {/* Add the popup near the top of your return statement */}
      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupMessage.title}
        message={popupMessage.content}
        isSuccess={popupMessage.isSuccess}
      />
      {/* Tabs */}
      <div className="trip-type-container">
        <div className="trip-type">
          <button
            className={formData.tripType === "one-way" ? "active" : ""}
            onClick={() => {
              setFormData((prev) => ({ ...prev, tripType: "one-way" }));
            }}
          >
            One Way
          </button>
          <button
            className={formData.tripType === "round-trip" ? "active" : ""}
            onClick={() => {
              setFormData((prev) => ({ ...prev, tripType: "round-trip" }));
            }}
          >
            Round Trip
          </button>
          <button
            className={formData.tripType === "multi-city" ? "active" : ""}
            onClick={() => {
              setFormData((prev) => ({ ...prev, tripType: "multi-city" }));
            }}
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
                        className={
                          formData.cabinClass === option.value ? "selected" : ""
                        }
                        onClick={() => {
                          setFormData((prev) => ({
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

      {/* Flight Search Form  new */}

      {/* Flight Search Form */}
      <div
        className="p-4 rounded border border-primary"
        style={{ borderWidth: "2px" }}
      >
        {/* Travelers Dropdown - Now appears consistently at the top for all trip types */}
        <div className="position-relative mb-3">
          <InputGroup className="custom-input">
            <InputGroup.Text className="icon">
              <FaUsers />
            </InputGroup.Text>
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
                  <span className="text-capitalize">
                    {type.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="traveler-controls">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleTravelerChange(type as keyof Travelers, false)
                      }
                    >
                      -
                    </Button>
                    <span className="count">{count}</span>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleTravelerChange(type as keyof Travelers, true)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* One-Way Trip Form */}
        {formData.tripType === "one-way" && (
          <div className="d-flex align-items-center  gap-3 flex-wrap">
            {/* Leaving From */}
            <div className=" position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaPlaneDeparture />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Leaving From"
                  value={formData.leavingFrom}
                  onChange={(e) => handleAirportChange(e, "leavingFrom")}
                  name="leavingFrom"
                />
               
                {
                
                formData.leavingFrom && (
                              <Button
                                variant="link"
                                className="clear-btn"

                                aria-label="Clear search"
                              >
                                <FaTimes />
                              </Button>
                            )}
              </InputGroup>
              {focusedField === "leavingFrom" &&
                airportSuggestions.length > 0 && (
                  <div className="autocomplete-dropdown">
                    {airportSuggestions.map((airportData, index) => (
                      <div
                        key={index}
                        className="autocomplete-item"
                        onClick={() =>
                          handleAirportSelect(
                            `${airportData.iata}-${airportData.city}(${airportData.country})`
                          )
                        }
                      >
                        {airportData.iata}-{airportData.city}(
                        {airportData.country})
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
            <div className="position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaPlaneArrival />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Going To"
                  value={formData.goingTo}
                  onChange={(e) => handleAirportChange(e, "goingTo")}
                  name="goingTo"
                />
              </InputGroup>
              {focusedField === "goingTo" && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() =>
                        handleAirportSelect(
                          `${airportData.iata}-${airportData.city}(${airportData.country})`
                        )
                      }
                    >
                      {airportData.iata}-{airportData.city}(
                      {airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div className="position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaCalendarAlt />
                </InputGroup.Text>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: date,
                    }))
                  }
                  customInput={<Form.Control type="text" readOnly />}
                  dateFormat="MM-dd-yyyy"
                  minDate={new Date()}
                  placeholderText="Select Date"
                />
              </InputGroup>
            </div>
          </div>
        )}

        {/* Round-Trip Form */}
        {formData.tripType === "round-trip" && (
          <div className="d-flex gap-3 flex-wrap">
            {/* Leaving From */}
            <div className="position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaPlaneDeparture />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Leaving From"
                  value={formData.leavingFrom}
                  onChange={(e) => handleAirportChange(e, "leavingFrom")}
                  name="leavingFrom"
                />
              </InputGroup>
              {focusedField === "leavingFrom" &&
                airportSuggestions.length > 0 && (
                  <div className="autocomplete-dropdown">
                    {airportSuggestions.map((airportData, index) => (
                      <div
                        key={index}
                        className="autocomplete-item"
                        onClick={() =>
                          handleAirportSelect(
                            `${airportData.iata}-${airportData.city}(${airportData.country})`
                          )
                        }
                      >
                        {airportData.iata}-{airportData.city}(
                        {airportData.country})
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
            <div className="position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaPlaneArrival />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Going To"
                  value={formData.goingTo}
                  onChange={(e) => handleAirportChange(e, "goingTo")}
                  name="goingTo"
                />
              </InputGroup>
              {focusedField === "goingTo" && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() =>
                        handleAirportSelect(
                          `${airportData.iata}-${airportData.city}(${airportData.country})`
                        )
                      }
                    >
                      {airportData.iata}-{airportData.city}(
                      {airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Departure Date */}
            <div className="position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaCalendarAlt />
                </InputGroup.Text>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: date,
                    }))
                  }
                  customInput={<Form.Control type="text" readOnly />}
                  dateFormat="MM-dd-yyyy"
                  minDate={new Date()}
                  placeholderText="Select Date"
                />
              </InputGroup>
            </div>

            {/* Return Date */}
            <div className="position-relative mb-3">
              <InputGroup className="custom-input">
                <InputGroup.Text className="icon">
                  <FaCalendarAlt />
                </InputGroup.Text>
                <DatePicker
                  selected={formData.returnDate}
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      returnDate: date,
                    }))
                  }
                  customInput={<Form.Control type="text" readOnly />}
                  dateFormat="MM-dd-yyyy"
                  minDate={
                    !formData.startDate ? new Date() : formData.startDate
                  }
                  placeholderText="Select Date"
                />
              </InputGroup>
            </div>
          </div>
        )}

        {/* Multi-City Form */}
        {formData.tripType === "multi-city" && (
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
                      <InputGroup.Text className="icon">
                        <FaPlaneDeparture />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Leaving From"
                        value={segment.from}
                        onChange={(e) =>
                          updateFlightSegment(index, "from", e.target.value)
                        }
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
                      <InputGroup.Text className="icon">
                        <FaPlaneArrival />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Going To"
                        value={segment.to}
                        onChange={(e) =>
                          updateFlightSegment(index, "to", e.target.value)
                        }
                      />
                    </InputGroup>
                  </div>

                  {/* Date Picker */}
                  <div className="flex-grow-1">
                    <InputGroup className="custom-input">
                      <InputGroup.Text className="icon">
                        <FaCalendarAlt />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        value={segment.date}
                        onChange={(e) =>
                          updateFlightSegment(index, "date", e.target.value)
                        }
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
              <InputGroup.Text className="icon">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                className="is-invalid"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
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
          <div className="position-relative">
            <InputGroup className="custom-input">
              <InputGroup.Text className="icon">
                <FaPhone />
              </InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData((prev) => ({
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
          <Button
            className="btn-search"
            variant="primary"
            size="lg"
            onClick={submitForm}
          >
            Search Flights
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container ">
        <h2 className="fw-bold mt-5">Popular Flights near you</h2>
        <p className="text-muted  mb-4">
          Find deals on domestic and international flights
        </p>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Flight Tabs"
            >
              <Tab label="International" {...a11yProps(0)} />
              <Tab label="Domestic" {...a11yProps(0)} />
            </Tabs>
          </Box>
          <FlightsTabPanel value={value} index={0}>
            <Swiper
              className="flight-swiper"
              spaceBetween={10}
              breakpoints={{
                320: { slidesPerView: 2 }, // Minimum 2 slides on small screens
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {nearByFlights.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="flight-card-container">
                    <div className="flight-card">
                      <Image
                        className="flight-image "
                        src={item.img}
                        alt={item.title}
                      />
                    </div>
                    <h3 className="flight-title mt-3">{item.title}</h3>
                    <p className="flight-date">{item.dates}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </FlightsTabPanel>
          <FlightsTabPanel value={value} index={1}></FlightsTabPanel>
        </Box>
      </div>
      <div className="container">
        <h2 className="fw-bold mt-3">Trending Cities</h2>
        <p className="text-muted  mb-4">
          Book flight to a destination popular with travelers from the United
          States
        </p>
        <Swiper
          className="flight-swiper"
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 2 }, // Minimum 2 slides on small screens
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {trendingCities.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flight-card-container">
                <div className="flight-card">
                  <Image
                    className="flight-image "
                    src={item.img}
                    alt={item.title}
                  />
                </div>
                <h3 className="flight-title mt-3">{item.title}</h3>
                <p className="flight-date">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container d-flex flex-column ">
        <h2 className="fw-bold mt-3">Top Flights from United States</h2>
        <p className="text-muted  mb-4">
          Explore destination you can reach from Unites States and start making
          new plans
        </p>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            label="Popular routes"
            variant="outlined"
            color="primary"
            onClick={handleClick}
          />
          <Chip label="Cities" variant="outlined" />
          <Chip label="Countries" variant="outlined" />
          <Chip label="Regions" variant="outlined" />
          <Chip label="Airports" variant="outlined" />
        </Stack>
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
            {topFlights.map((item) => (
              <Grid key={item.id} xs={2} sm={4} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  <Image
                    className="flight-image"
                    src={item.imgs}
                    alt={item.departure}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <h4 style={{ marginTop: "10px", fontSize: "14px" }}>
                    {item.departure} → {item.arrival}
                  </h4>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>

      <div className=" container mt-5">
        <h1 className="d-flex justify-content-center mt-5">
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
                        className="count-badge bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center"
                        style={{
                          width: 30,
                          height: 30,
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.6rem",
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
            <Button variant="primary" size="lg">
              Further Question
            </Button>
          </div>
        </div>

        <div className="container mt-5 d-flex flex-column align-items-center">
          {metaData.map((item, index) => (
            <div key={index}>
              <h6 className="fw-bold mt-2 mb-0">{item.title}</h6>
              <p className="text-dark" style={{ fontSize: "x-small" }}>
                {item.destinations}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function FlightsTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="flightTabpanel"
      hidden={value !== index}
      id={`flight-tabpanel-${index}`}
      aria-labelledby={`flight-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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
