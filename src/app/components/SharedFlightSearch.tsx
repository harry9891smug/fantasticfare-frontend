import React, { useState, useEffect, useRef } from "react";
import { 
  FaPlaneDeparture, 
  FaPlaneArrival, 
  FaCalendarAlt, 
  FaUsers, 
  FaExchangeAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaTimes,
  FaPhone
} from "react-icons/fa";
import { Form, Button, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

interface Travelers {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

interface FlightSegment {
  from: string;
  to: string;
  date: Date | null;
}

interface AirportData {
  iata: string;
  city: string;
  country: string;
}

interface FlightSearchComponentProps {
  variant?: 'compact' | 'full';
  onSearch?: (formData: any) => void;
}

const FlightSearchComponent: React.FC<FlightSearchComponentProps> = ({ 
  variant = 'full',
  onSearch 
}) => {
  // State for form fields
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("round-trip");
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    { from: "", to: "", date: null },
    { from: "", to: "", date: null }
  ]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: ""
  });

  // State for airport suggestions
  const [airportSuggestions, setAirportSuggestions] = useState<AirportData[]>([]);
  const [focusedField, setFocusedField] = useState<{
    segmentIndex: number;
    fieldType: 'from' | 'to';
  } | null>(null);

  const filtersRef = useRef<HTMLDivElement>(null);

  const cabinOptions = [
    { value: "Economy", label: "Economy" },
    { value: "Premium economy", label: "Premium economy" },
    { value: "Business class", label: "Business class" },
    { value: "First class", label: "First class" },
  ];

  // Handle traveler count changes
  const handleTravelerChange = (type: keyof Travelers, increment: boolean) => {
    setTravelers(prev => ({
      ...prev,
      [type]: Math.max(0, increment ? prev[type] + 1 : prev[type] - 1)
    }));
  };

  // Handle adding/removing flight segments for multi-city
  const addFlightSegment = () => {
    setFlightSegments([...flightSegments, { from: "", to: "", date: null }]);
  };

  const removeFlightSegment = (index: number) => {
    if (flightSegments.length > 1) {
      const updatedSegments = [...flightSegments];
      updatedSegments.splice(index, 1);
      setFlightSegments(updatedSegments);
    }
  };

  // Update flight segment fields
  const updateFlightSegment = (
    index: number,
    field: keyof FlightSegment,
    value: string | Date | null
  ) => {
    const updatedSegments = [...flightSegments];
    updatedSegments[index] = { ...updatedSegments[index], [field]: value };
    setFlightSegments(updatedSegments);
  };

  // Fetch airport suggestions
  const handleAirportChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    segmentIndex: number,
    fieldType: 'from' | 'to'
  ) => {
    const value = e.target.value;
    setFocusedField({ segmentIndex, fieldType });
    
    // Update the field value
    updateFlightSegment(segmentIndex, fieldType, value);

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
      console.error("Error fetching airport suggestions:", error);
      setAirportSuggestions([]);
    }
  };

  // Select an airport from suggestions
  const handleAirportSelect = (airportData: AirportData, segmentIndex: number, fieldType: 'from' | 'to') => {
    const airportString = `${airportData.iata}-${airportData.city}(${airportData.country})`;
    updateFlightSegment(segmentIndex, fieldType, airportString);
    setAirportSuggestions([]);
    setFocusedField(null);
  };

  // Swap from/to locations
  const exchangeAreas = (segmentIndex: number) => {
    const updatedSegments = [...flightSegments];
    const temp = updatedSegments[segmentIndex].from;
    updatedSegments[segmentIndex].from = updatedSegments[segmentIndex].to;
    updatedSegments[segmentIndex].to = temp;
    setFlightSegments(updatedSegments);
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      phone: ""
    };

    if (!email) {
      newErrors.email = "Please enter your email";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!phone) {
      newErrors.phone = "Please enter your phone number";
      valid = false;
    }

    // Validate flight segments
    for (const segment of flightSegments) {
      if (!segment.from || !segment.to || !segment.date) {
        valid = false;
        break;
      }
    }

    setFormErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = {
      tripType,
      cabinClass,
      travelers,
      segments: flightSegments,
      email,
      phone
    };

    if (onSearch) {
      onSearch(formData);
      return;
    }

    // Default submission behavior
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flight-enquiry`,
        formData
      );
      console.log("Enquiry submitted:", response.data);
      // Handle success (show message, redirect, etc.)
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (show error message)
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowTravelerDropdown(false);
        setShowCabinDropdown(false);
        setAirportSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`flight-search-container ${variant}`} ref={filtersRef}>
      {/* Tabs - Only show in full variant */}
      {variant === 'full' && (
        <div className="trip-type-container">
          <div className="trip-type">
            <button
              className={tripType === "one-way" ? "active" : ""}
              onClick={() => setTripType("one-way")}
            >
              One Way
            </button>
            <button
              className={tripType === "round-trip" ? "active" : ""}
              onClick={() => setTripType("round-trip")}
            >
              Round Trip
            </button>
            <button
              className={tripType === "multi-city" ? "active" : ""}
              onClick={() => setTripType("multi-city")}
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
                          className={cabinClass === option.value ? "selected" : ""}
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
      )}

      {/* Flight Search Form */}
      <form onSubmit={handleSubmit} className={`bg-light p-4 rounded shadow ${variant}`}>
        {/* Travelers Dropdown - Only show in full variant */}
        {variant === 'full' && (
          <div className="custom-input position-relative mb-3">
            <InputGroup>
              <InputGroup.Text>
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
                        onClick={() => handleTravelerChange(type as keyof Travelers, false)}
                      >
                        -
                      </Button>
                      <span className="count">{count}</span>
                      <Button
                        size="sm"
                        onClick={() => handleTravelerChange(type as keyof Travelers, true)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* One-Way/Round-Trip Form */}
        {tripType !== 'multi-city' && (
          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
            {/* Leaving From */}
            <div className="custom-input position-relative">
              <InputGroup className="custom-input">
                <InputGroup.Text>
                  <FaPlaneDeparture />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Leaving From"
                  value={flightSegments[0].from}
                  onChange={(e) => handleAirportChange(e, 0, 'from')}
                />
              </InputGroup>
              {focusedField?.segmentIndex === 0 && focusedField?.fieldType === 'from' && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleAirportSelect(airportData, 0, 'from')}
                    >
                      {airportData.iata}-{airportData.city}({airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Icon */}
            <div className="swap-icon-circle" onClick={() => exchangeAreas(0)}>
              <FaExchangeAlt />
            </div>

            {/* Going To */}
            <div className="custom-input position-relative">
              <InputGroup className="custom-input">
                <InputGroup.Text>
                  <FaPlaneArrival />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Going To"
                  value={flightSegments[0].to}
                  onChange={(e) => handleAirportChange(e, 0, 'to')}
                />
              </InputGroup>
              {focusedField?.segmentIndex === 0 && focusedField?.fieldType === 'to' && airportSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {airportSuggestions.map((airportData, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleAirportSelect(airportData, 0, 'to')}
                    >
                      {airportData.iata}-{airportData.city}({airportData.country})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Departure Date */}
            <div className="custom-input position-relative">
              <InputGroup className="custom-input">
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <DatePicker
                  selected={flightSegments[0].date}
                  onChange={(date) => updateFlightSegment(0, 'date', date)}
                  selectsStart
                  startDate={flightSegments[0].date}
                  endDate={tripType === "round-trip" ? flightSegments[1]?.date : null}
                  minDate={new Date()}
                  placeholderText="Departure"
                  className="form-control"
                />
              </InputGroup>
            </div>

            {/* Return Date (only for round-trip) */}
            {tripType === "round-trip" && (
              <div className="custom-input position-relative">
                <InputGroup className="custom-input">
                  <InputGroup.Text>
                    <FaCalendarAlt />
                  </InputGroup.Text>
                  <DatePicker
                    selected={flightSegments[1]?.date}
                    onChange={(date) => updateFlightSegment(1, 'date', date)}
                    selectsEnd
                    startDate={flightSegments[0].date}
                    endDate={flightSegments[1]?.date}
                    minDate={flightSegments[0].date || new Date()}
                    placeholderText="Return"
                    className="form-control"
                  />
                </InputGroup>
              </div>
            )}
          </div>
        )}

        {/* Multi-City Form */}
        {tripType === 'multi-city' && (
          <div className="multi-city-container">
            {flightSegments.map((segment, index) => (
              <div key={index} className="flight-segment mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5>Flight {index + 1}</h5>
                  {flightSegments.length > 1 && (
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => removeFlightSegment(index)}
                    >
                      <FaTimes />
                    </Button>
                  )}
                </div>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {/* From */}
                  <div className="flex-grow-1 position-relative">
                    <InputGroup className="custom-input">
                      <InputGroup.Text>
                        <FaPlaneDeparture />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="From"
                        value={segment.from}
                        onChange={(e) => handleAirportChange(e, index, 'from')}
                      />
                    </InputGroup>
                    {focusedField?.segmentIndex === index && focusedField?.fieldType === 'from' && airportSuggestions.length > 0 && (
                      <div className="autocomplete-dropdown">
                        {airportSuggestions.map((airportData, i) => (
                          <div
                            key={i}
                            className="autocomplete-item"
                            onClick={() => handleAirportSelect(airportData, index, 'from')}
                          >
                            {airportData.iata}-{airportData.city}({airportData.country})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap Icon */}
                  <div className="swap-icon-circle" onClick={() => exchangeAreas(index)}>
                    <FaExchangeAlt />
                  </div>

                  {/* To */}
                  <div className="flex-grow-1 position-relative">
                    <InputGroup className="custom-input">
                      <InputGroup.Text>
                        <FaPlaneArrival />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="To"
                        value={segment.to}
                        onChange={(e) => handleAirportChange(e, index, 'to')}
                      />
                    </InputGroup>
                    {focusedField?.segmentIndex === index && focusedField?.fieldType === 'to' && airportSuggestions.length > 0 && (
                      <div className="autocomplete-dropdown">
                        {airportSuggestions.map((airportData, i) => (
                          <div
                            key={i}
                            className="autocomplete-item"
                            onClick={() => handleAirportSelect(airportData, index, 'to')}
                          >
                            {airportData.iata}-{airportData.city}({airportData.country})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex-grow-1">
                    <InputGroup className="custom-input">
                      <InputGroup.Text>
                        <FaCalendarAlt />
                      </InputGroup.Text>
                      <DatePicker
                        selected={segment.date}
                        onChange={(date) => updateFlightSegment(index, 'date', date)}
                        minDate={new Date()}
                        placeholderText="Date"
                        className="form-control"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-start mt-3">
              <Button
                variant="outline-primary"
                onClick={addFlightSegment}
                className="btn-add-more"
              >
                + Add another flight
              </Button>
            </div>
          </div>
        )}

        {/* Checkboxes - Only show in full variant */}
        {variant === 'full' && (
          <div className="d-flex gap-4 mt-3">
            <Form.Check type="checkbox" label="Add a place to stay" />
            <Form.Check type="checkbox" label="Add a car" />
          </div>
        )}

        {/* Email and Phone Fields */}
        <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
          {/* Email Field */}
          <div className="custom-input">
            <InputGroup>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                className={formErrors.email ? "is-invalid" : ""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <InputGroup.Text>
                <FaPhone />
              </InputGroup.Text>
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
          <Button className="btn-search" variant="primary" size="lg" type="submit">
            Search Flights
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FlightSearchComponent;