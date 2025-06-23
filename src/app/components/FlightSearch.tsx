import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaExchangeAlt,
  FaPhone,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaUsers,
  FaAt,
} from "react-icons/fa";
import { cabinOptions } from "../utils/utilityData";
import "../assets/css/flightcomponent.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import SuccessPopup from "./successPopup";

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
interface Travelers {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

interface AirportData {
  iata: string;
  city: string;
  country: string;
}

const FlightComponent: React.FC = () => {
  const filtersRef = useRef<HTMLDivElement>(null);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [trip, setTrip] = useState("round-trip");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [formData, setFormData] = useState<FormData>({
    travellers: travelers,
    cabinClass: cabinClass,
    tripType: "round-trip",
    leavingFrom: "",
    goingTo: "",
    email: "",
    mobile_number: "",
  } as FormData);

  const [airportSuggestions, setAirportSuggestions] = useState<AirportData[]>(
    []
  );
  const [focusedField, setFocusedField] = useState<
    "leavingFrom" | "goingTo" | null
  >(null);
  const [formErrors, setFormErrors] = useState<FormData>({} as FormData);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    content: "",
    isSuccess: true,
  });

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

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tripType: trip }));
  }, [trip]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      travellers: travelers,
    }));
  }, [travelers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowTravelerDropdown(false);
        setShowCabinDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersRef]);

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
      if (response.data.data.length != 0) {
        setAirportSuggestions(response.data.data || []);
      } else {
        setAirportSuggestions(response.data.suggestions || []);
      }
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

  const submitForm = async () => {
    console.log("here");
    console.log(formData);
    try {
      const newErrors = {} as FormData;

      // Validate all fields
      if (!formData.leavingFrom) {
        newErrors.leavingFrom = "Please enter departure";
      }
      if (!formData.goingTo) {
        newErrors.goingTo = "Please enter destination";
      }
      if (!formData.email) {
        newErrors.email = "Please enter email";
      }

      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.mobile_number) {
        newErrors.mobile_number = "Please enter mobile number";
      }
      if (
        formData.mobile_number &&
        !/^[0-9]{10,15}$/.test(formData.mobile_number)
      ) {
        newErrors.mobile_number = "Please enter a valid phone number";
      }

      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        const firstError = Object.values(newErrors)[0];
        setPopupMessage({
          title: "Error",
          content: firstError,
          isSuccess: false,
        });
        setShowPopup(true);
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

  const SwapIcon = () => (
    <div className="col-12 col-md-auto d-flex justify-content-center">
      <div className="d-flex align-items-center justify-content-center rounded-circle text-white fs-4 swap-icon-circle-custom">
        <FaExchangeAlt />
      </div>
    </div>
  );

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
            { label: "Multi-City", value: "multi-city" },
          ].map((trip) => (
            <button
              key={trip.value}
              className={`trip-link btn btn-sm ${
                formData.tripType === trip.value
                  ? "active"
                  : "btn-outline-secondary custom-outline-hover"
              }`}
              onClick={() => setTrip(trip.value)}
            >
              {trip.label}
            </button>
          ))}

          {/* Cabin Class Dropdown */}
          <div className="cabin-dropdown-container position-relative">
            <button
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
              <div className="cabin-dropdown-menu position-absolute bg-white shadow-sm rounded mt-1 p-2 z-3">
                <ul className="list-unstyled mb-0">
                  {cabinOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        className={`dropdown-item d-flex justify-content-between align-items-center ${
                          formData.cabinClass === option.value
                            ? "text-primary fw-bold"
                            : ""
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            cabinClass: option.value,
                          }));
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
      <div
        className="px-4 py-2 rounded border border-primary"
        style={{ borderWidth: "2px" }}
      >
        {/* Travelers Dropdown - Now appears consistently at the top for all trip types */}
        <div className="custom-responsive-width position-relative mb-3">
          <InputGroup className="custom-responsive-width d-flex p-1 align-items-center bg-white border-bottom border-primary rounded  position-relative">
            <InputGroup.Text>
              <FaUsers />
            </InputGroup.Text>
            <Form.Control
              type="text"
              className="fs-7 bg-transparent border-0"
              readOnly
              value={`${travelers.adults} Adult${
                travelers.adults !== 1 ? "s" : ""
              }, ${travelers.children} Child${
                travelers.children !== 1 ? "ren" : ""
              }`}
              onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
            />
          </InputGroup>
          {showTravelerDropdown && (
            <div className="traveler-dropdown">
              {Object.entries(travelers).map(([type, count]) => (
                <div key={type}>
                  <span className="text-capitalize fs-7">
                    {type.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="traveler-controls">
                    <Button
                      className="fs-7"
                      size="sm"
                      onClick={(e) => {
                        handleTravelerChange(type as keyof Travelers, false);
                      }}
                      disabled={count <= 0 || (type === "adults" && count <= 1)}
                    >
                      -
                    </Button>
                    <span className="count fs-7">{count}</span>
                    <Button
                      className="fs-7"
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
          <div className="d-flex row align-items-center  gap-3 flex-wrap">
            {/* Leaving From */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
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
                  onChange={(e) => {
                    setFormData({ ...formData, leavingFrom: e.target.value });
                    handleAirportChange(e, "leavingFrom");
                    if (formErrors.leavingFrom) {
                      setFormErrors((prev) => ({ ...prev, leavingFrom: "" }));
                    }
                  }}
                  name="leavingFrom"
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
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
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
                  onChange={(e) => {
                    setFormData({ ...formData, goingTo: e.target.value });
                    handleAirportChange(e, "goingTo");
                    if (formErrors.goingTo) {
                      setFormErrors((prev) => ({ ...prev, goingTo: "" }));
                    }
                  }}
                  name="goingTo"
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
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <div className="pe-3">
                  <DatePicker
                    className="fs-7 bg-transparent border-0"
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
                </div>
              </InputGroup>
            </div>
          </div>
        )}

        {/* Round-Trip Form */}
        {formData.tripType === "round-trip" && (
          <div className="row d-flex flex-wrap">
            {/* Leaving From */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
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
                  onChange={(e) => {
                    setFormData({ ...formData, leavingFrom: e.target.value });
                    handleAirportChange(e, "leavingFrom");
                    if (formErrors.leavingFrom) {
                      setFormErrors((prev) => ({ ...prev, leavingFrom: "" }));
                    }
                  }}
                  name="leavingFrom"
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
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
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
                  onChange={(e) => {
                    setFormData({ ...formData, goingTo: e.target.value });
                    handleAirportChange(e, "goingTo");
                    if (formErrors.goingTo) {
                      setFormErrors((prev) => ({ ...prev, goingTo: "" }));
                    }
                  }}
                  name="goingTo"
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
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <div className="pe-3">
                  <DatePicker
                    className="fs-7 bg-transparent border-0"
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
                </div>
              </InputGroup>
            </div>

            {/* Return Date */}
            <div className="col-sm-4 col-md-auto position-relative mb-2">
              <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <div className="pe-3">
                  <DatePicker
                    className="fs-7 bg-transparent border-0"
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
                </div>
              </InputGroup>
            </div>
          </div>
        )}

        {/* Multi-City Form */}
        {formData.tripType === "multi-city" && (
          <>
            {/* Flight Segments */}

            {/* Add Another Flight button */}
            <div className=" mt-3">
              <Button variant="outline-primary" className="btn-add-more fs-7">
                + Add another flight
              </Button>
            </div>
          </>
        )}

        {/* Common Elements (checkboxes, email/phone, search button) */}
        <div className="d-flex gap-4 mt-2 mb-2">
          <Form.Check
            className="fs-7"
            type="checkbox"
            label="Add a place to stay"
          />
          <Form.Check className="fs-7" type="checkbox" label="Add a car" />
        </div>
        <div className="row">
          {/* Email Field */}
          <div className="col-sm-4 col-lg-6 mb-2">
            <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
              <InputGroup.Text>
                <FaAt />
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                className={`fs-7 bg-transparent border-0 ${
                  formErrors.email ? "is-invalid" : ""
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  // Clear error when user types
                  if (formErrors.email) {
                    setFormErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
              {formErrors.email && (
                <div className="invalid-feedback">
                  <strong>{formErrors.email}</strong>
                </div>
              )}
            </InputGroup>
          </div>

          {/* Phone Field */}
          <div className="col-sm-4 col-lg-6 mb-2">
            <InputGroup className="d-flex p-1 align-items-center bg-white border-bottom border-primary rounded w-100 position-relative">
              <InputGroup.Text>
                <FaPhone className="rotate-call-icon" />
              </InputGroup.Text>
              <Form.Control
                type="tel"
                className={`fs-7 bg-transparent border-0 ${
                  formErrors.mobile_number ? "is-invalid" : ""
                }`}
                placeholder="Phone Number"
                value={formData.mobile_number}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    mobile_number: e.target.value,
                  }));

                  if (formErrors.mobile_number) {
                    setFormErrors((prev) => ({ ...prev, mobile_number: "" }));
                  }
                }}
              />
              {formErrors.mobile_number && (
                <div className="invalid-feedback">
                  <strong>{formErrors.mobile_number}</strong>
                </div>
              )}
            </InputGroup>
          </div>
        </div>

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
