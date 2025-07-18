"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaExchangeAlt,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaUsers,
} from "react-icons/fa";
import { cabinOptions } from "../utils/utilityData";
import "../assets/css/flightcomponent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import SuccessPopup from "./successPopup";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

interface Travelers {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}
interface FormData {
  tripType: string;
  leavingFrom: string;
  goingTo: string;
  startDate: Date | null;
  returnDate: Date | null;
  travellers: Travelers;
  cabinClass: string;
}
interface AirportData {
  iata: string;
  city: string;
  country: string;
}
interface FormErrors {
  leavingFrom?: string;
  goingTo?: string;
  startDate?: string;
  returnDate?: string;
}

const FlightComponent: React.FC = () => {
  const router = useRouter();
  const filtersRef = useRef<HTMLDivElement>(null);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [formData, setFormData] = useState<FormData>({
    tripType: "round-trip",
    leavingFrom: "",
    goingTo: "",
    startDate: null,
    returnDate: null,
    travellers: {
      adults: 1,
      children: 0,
      infantsSeat: 0,
      infantsLap: 0,
    },
    cabinClass: "Economy",
  });
  const [airportSuggestions, setAirportSuggestions] = useState<AirportData[]>(
    []
  );
  const [focusedField, setFocusedField] = useState<
    "leavingFrom" | "goingTo" | null
  >(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    content: "",
    isSuccess: true,
  });

  // Ensures debounced function doesn't get recreated every render
  const fetchSuggestions = useRef(
    debounce(async (value: string, type: "leavingFrom" | "goingTo") => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/airportSuggestions?area=${value}`
        );
        const data =
          response.data.data && response.data.data.length
            ? response.data.data
            : response.data.suggestions || [];
        setAirportSuggestions(data);
        setFocusedField(type);
      } catch (err) {
        console.error("Error fetching airport suggestions:", err);
      }
    }, 800)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

  // Dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowTravelerDropdown(false);
        setShowCabinDropdown(false);
        setAirportSuggestions([]);
        setFocusedField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync travelers/cabinClass on update
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      travellers: travelers,
      cabinClass: cabinClass,
    }));
    // eslint-disable-next-line
  }, [travelers, cabinClass]);

  // Swapping trip type
  const handleTripTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      tripType: type,
      returnDate: type === "one-way" ? null : prev.returnDate,
    }));
    setAirportSuggestions([]);
    setFocusedField(null);
  };

  // Handle traveler change
  const handleTravelerChange = (type: keyof Travelers, increment: boolean) => {
    const updated = {
      ...travelers,
      [type]: Math.max(
        0,
        increment ? travelers[type] + 1 : travelers[type] - 1
      ),
    };
    // Infants cannot exceed adults
    if (
      type === "adults" &&
      updated.adults < updated.infantsLap + updated.infantsSeat
    )
      return;
    setTravelers(updated);
  };

  // Airport input change
  const handleAirportChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "leavingFrom" | "goingTo"
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [type]: value }));
    setFormErrors((prev) => ({ ...prev, [type]: "" }));
    if (value.length >= 3) fetchSuggestions(value, type);
    else {
      setAirportSuggestions([]);
      setFocusedField(null);
    }
  };

  // Autocomplete select
  const handleAirportSelect = (airport: string) => {
    if (!focusedField) return;
    setFormData((prev) => ({ ...prev, [focusedField]: airport }));
    setAirportSuggestions([]);
    setFocusedField(null);
  };

  // Swap airports
  const swapAirports = () => {
    setFormData((prev) => ({
      ...prev,
      leavingFrom: prev.goingTo,
      goingTo: prev.leavingFrom,
    }));
    setAirportSuggestions([]);
    setFocusedField(null);
  };

  // Validate
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.leavingFrom) errors.leavingFrom = "Please enter departure";
    if (!formData.goingTo) errors.goingTo = "Please enter destination";
    if (!formData.startDate) errors.startDate = "Please select departure date";
    if (formData.tripType === "round-trip" && !formData.returnDate)
      errors.returnDate = "Please select return date";
    if (
      formData.travellers.adults <
      formData.travellers.infantsLap + formData.travellers.infantsSeat
    ) {
      setPopupMessage({
        title: "Invalid Travelers",
        content: "Infants cannot exceed adults",
        isSuccess: false,
      });
      setShowPopup(true);
      return false;
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setPopupMessage({
        title: "Error",
        content: firstError || "Form error",
        isSuccess: false,
      });
      setShowPopup(true);
      return false;
    }
    return true;
  };

  // Submit
  const submitForm = () => {
    if (!validateForm()) return;
    sessionStorage.setItem("flightData", JSON.stringify(formData));
    router.push("/flight-list");
  };

  // Traveler label
  const travelerString = () => {
    let str = `${travelers.adults} Adult${travelers.adults !== 1 ? "s" : ""}`;
    if (travelers.children)
      str += `, ${travelers.children} Child${
        travelers.children !== 1 ? "ren" : ""
      }`;
    if (travelers.infantsSeat)
      str += `, ${travelers.infantsSeat} Infant (Seat)`;
    if (travelers.infantsLap) str += `, ${travelers.infantsLap} Infant (Lap)`;
    return str;
  };

  const SwapIcon = () => (
    <div className="col-12 col-md-auto d-flex justify-content-center align-items-center mb-2">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle text-white fs-4 swap-icon-circle-custom"
        style={{ cursor: "pointer" }}
        onClick={swapAirports}
        tabIndex={0}
        aria-label="Swap From/To"
        title="Swap From/To"
      >
        <FaExchangeAlt />
      </div>
    </div>
  );

  // JSX
  return (
    <div className="filters-container" ref={filtersRef}>
      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupMessage.title}
        message={popupMessage.content}
        isSuccess={popupMessage.isSuccess}
      />
      {/* Tabs */}
      <div className="trip-type-container">
        <div className="d-flex flex-row gap-3 mb-2 fs-7 trip-type">
          {[
            { label: "One Way", value: "one-way" },
            { label: "Round Trip", value: "round-trip" },
          ].map((trip) => (
            <button
              key={trip.value}
              className={`trip-link btn btn-sm ${
                formData.tripType === trip.value
                  ? "active"
                  : "btn-outline-secondary custom-outline-hover"
              }`}
              onClick={() => handleTripTypeChange(trip.value)}
              type="button"
            >
              {trip.label}
            </button>
          ))}
          <div className="cabin-dropdown-container position-relative">
            <button
              type="button"
              className="cabin-dropdown-trigger btn btn-sm d-flex align-items-center"
              onClick={() => setShowCabinDropdown(!showCabinDropdown)}
              aria-expanded={showCabinDropdown}
              aria-haspopup="true"
              aria-controls="cabin-dropdown-menu"
            >
              <span className="me-2 text-white">{cabinClass}</span>
              {showCabinDropdown ? (
                <FaChevronUp className="text-white" />
              ) : (
                <FaChevronDown className="text-white" />
              )}
            </button>
            {showCabinDropdown && (
              <div className="cabin-dropdown-menu position-absolute bg-white shadow-sm mt-1 p-2 z-3">
                <ul className="list-unstyled mb-0">
                  {cabinOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`dropdown-item d-flex justify-content-between align-items-center ${
                          formData.cabinClass === option.value
                            ? "text-primary fw-bold"
                            : ""
                        }`}
                        onClick={() => {
                          setCabinClass(option.value);
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
      <div className="px-4 py-2 bg-white shadow">
        {/* Travelers Dropdown */}
        <div className="custom-responsive-width position-relative justify-content-between mb-3">
          <InputGroup
            className="custom-responsive-width d-flex p-1 align-items-center  bg-white  position-relative"
            style={{ borderBottom: "1px solid black" }}
          >
            <InputGroup.Text>
              <FaUsers />
            </InputGroup.Text>
            <Form.Control
              type="text"
              className="fs-7 bg-transparent border-0"
              readOnly
              value={travelerString()}
              onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
              tabIndex={0}
              aria-label="Select Travelers"
              style={{ cursor: "pointer" }}
            />
          </InputGroup>
          <div className="d-flex gap-4">
            <Form.Check
              className="fs-7"
              type="checkbox"
              label="Add a place to stay"
            />
            <Form.Check className="fs-7" type="checkbox" label="Add a car" />
          </div>
          {showTravelerDropdown && (
            <div className="traveler-dropdown">
              {Object.entries(travelers).map(([type, count]) => (
                <div
                  key={type}
                  className="d-flex justify-content-between align-items-center py-1"
                >
                  <span className="text-capitalize fs-7">
                    {type.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="traveler-controls d-flex gap-2 align-items-center">
                    <Button
                      className="fs-7"
                      size="sm"
                      type="button"
                      onClick={() =>
                        handleTravelerChange(type as keyof Travelers, false)
                      }
                      disabled={count <= 0 || (type === "adults" && count <= 1)}
                    >
                      -
                    </Button>
                    <span className="count fs-7">{count}</span>
                    <Button
                      className="fs-7"
                      size="sm"
                      type="button"
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
          <div className="d-flex row align-items-center  gap-3 flex-wrap">
            {/* Leaving From */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white w-100 position-relative"
                style={{ borderBottom: "1px solid black" }}
              >
                <InputGroup.Text>
                  <FaPlaneDeparture />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className={`fs-7 bg-transparent border-0 ${
                    formErrors.leavingFrom ? "is-invalid" : ""
                  }`}
                  placeholder="Leaving From"
                  value={formData.leavingFrom}
                  onChange={(e) => handleAirportChange(e, "leavingFrom")}
                  name="leavingFrom"
                  autoComplete="off"
                  onFocus={() => {
                    if (formData.leavingFrom.length >= 3)
                      fetchSuggestions(formData.leavingFrom, "leavingFrom");
                  }}
                />
                {formErrors.leavingFrom && (
                  <div className="invalid-feedback">
                    <strong>{formErrors.leavingFrom}</strong>
                  </div>
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
            <SwapIcon />
            {/* Going To */}
            <div className="col-12 col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white   w-100 position-relative"
                style={{
                  borderBottom: "1px solid black",
                }}
              >
                <InputGroup.Text>
                  <FaPlaneArrival />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className={`fs-7 bg-transparent border-0 ${
                    formErrors.goingTo ? "is-invalid" : ""
                  }`}
                  placeholder="Going To"
                  value={formData.goingTo}
                  onChange={(e) => handleAirportChange(e, "goingTo")}
                  name="goingTo"
                  autoComplete="off"
                  onFocus={() => {
                    if (formData.goingTo.length >= 3)
                      fetchSuggestions(formData.goingTo, "goingTo");
                  }}
                />
                {formErrors.goingTo && (
                  <div className="invalid-feedback">
                    <strong>{formErrors.goingTo}</strong>
                  </div>
                )}
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
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white  w-100 position-relative"
                style={{ borderBottom: "1px solid black" }}
              >
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <div className="pe-3">
                  <DatePicker
                    className="fs-7 bg-transparent border-0"
                    selected={formData.startDate}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({ ...prev, startDate: date }))
                    }
                    customInput={<Form.Control type="text" readOnly />}
                    dateFormat="MM-dd-yyyy"
                    minDate={new Date()}
                    placeholderText="Select Date"
                  />
                </div>
              </InputGroup>
              {formErrors.startDate && (
                <div className="invalid-feedback d-block">
                  <strong>{formErrors.startDate}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Round-Trip Form */}
        {formData.tripType === "round-trip" && (
          <div className="row d-flex flex-wrap">
            {/* Leaving From */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white w-100 position-relative"
                style={{ borderBottom: "1px solid black" }}
              >
                <InputGroup.Text>
                  <FaPlaneDeparture />
                </InputGroup.Text>
                <Form.Control
                  className={`fs-7 bg-transparent border-0 ${
                    formErrors.leavingFrom ? "is-invalid" : ""
                  }`}
                  type="text"
                  placeholder="Leaving From"
                  value={formData.leavingFrom}
                  onChange={(e) => handleAirportChange(e, "leavingFrom")}
                  name="leavingFrom"
                  autoComplete="off"
                  onFocus={() => {
                    if (formData.leavingFrom.length >= 3)
                      fetchSuggestions(formData.leavingFrom, "leavingFrom");
                  }}
                />
                {formErrors.leavingFrom && (
                  <div className="invalid-feedback">
                    <strong>{formErrors.leavingFrom}</strong>
                  </div>
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
            <SwapIcon />
            {/* Going To */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white  w-100 position-relative"
                style={{ borderBottom: "1px solid black" }}
              >
                <InputGroup.Text>
                  <FaPlaneArrival />
                </InputGroup.Text>
                <Form.Control
                  className={`fs-7 bg-transparent border-0 ${
                    formErrors.goingTo ? "is-invalid" : ""
                  }`}
                  type="text"
                  placeholder="Going To"
                  value={formData.goingTo}
                  onChange={(e) => handleAirportChange(e, "goingTo")}
                  name="goingTo"
                  autoComplete="off"
                  onFocus={() => {
                    if (formData.goingTo.length >= 3)
                      fetchSuggestions(formData.goingTo, "goingTo");
                  }}
                />
                {formErrors.goingTo && (
                  <div className="invalid-feedback">
                    <strong>{formErrors.goingTo}</strong>
                  </div>
                )}
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
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white  w-100 position-relative"
                style={{ borderBottom: "1px solid black" }}
              >
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <div className="pe-3">
                  <DatePicker
                    className="fs-7 bg-transparent border-0"
                    selected={formData.startDate}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({ ...prev, startDate: date }))
                    }
                    customInput={<Form.Control type="text" readOnly />}
                    dateFormat="MM-dd-yyyy"
                    minDate={new Date()}
                    placeholderText="Select Date"
                  />
                </div>
              </InputGroup>
              {formErrors.startDate && (
                <div className="invalid-feedback d-block">
                  <strong>{formErrors.startDate}</strong>
                </div>
              )}
            </div>
            {/* Return Date */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup
                className="d-flex p-1 align-items-center bg-white w-100 position-relative"
                style={{ borderBottom: "1px solid black" }}
              >
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <div className="pe-3">
                  <DatePicker
                    className="fs-7 bg-transparent border-0"
                    selected={formData.returnDate}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({ ...prev, returnDate: date }))
                    }
                    customInput={<Form.Control type="text" readOnly />}
                    dateFormat="MM-dd-yyyy"
                    minDate={
                      !formData.startDate ? new Date() : formData.startDate
                    }
                    placeholderText="Select Date"
                  />
                </div>
              </InputGroup>
              {formErrors.returnDate && (
                <div className="invalid-feedback d-block">
                  <strong>{formErrors.returnDate}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checkboxes */}

        {/* Search Button */}
        <div className="text-center mt-3">
          <Button
            className="btn-search fs-7"
            variant="primary"
            size="lg"
            onClick={submitForm}
          >
            Send Enquiry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightComponent;
