"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaSearch, FaCalendarAlt, FaUsers, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/hotels.css";
import HotelBanner from "../assets/images/hotel-banner.svg";
import Hotel1 from "../assets/images/first-up.svg";
import Hotel2 from "../assets/images/second-down.svg";
import Hotel3 from "../assets/images/middle.svg";
import Hotel4 from "../assets/images/third-up.png";
import Hotel5 from "../assets/images/thiird-down.svg";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';

type TravelerType = "adults" | "children";
type Suggestion = {
  city:string;
  id: string;
  name: string;
  type: 'city' | 'country' | 'region';
  country?: string;
  country_name?:string;
  iata:string;
};

const HotelSearch = () => {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion_type,setSuggestionType] = useState(String);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchSuggestions = debounce(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/search_city`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city_name: query }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const result = await response.json();
      setSuggestionType(result?.data?.type);
      setSuggestions(result?.data?.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(search);
    return () => fetchSuggestions.cancel();
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTravelerChange = (type: TravelerType, increment: boolean) => {
    setTravelers(prev => ({
      ...prev,
      [type]: Math.max(0, increment ? prev[type] + 1 : prev[type] - 1),
    }));
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSelectedLocation(suggestion);
    setSearch(`${suggestion.city}${suggestion.country ? `, ${suggestion.country}` : ''}`);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedLocation(null);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (!selectedLocation) {
      alert("Please select a location from the suggestions");
      return;
    }
    
    if (!dateRange[0] || !dateRange[1]) {
      alert("Please select check-in and check-out dates");
      return;
    }

    const params = new URLSearchParams();
    params.set('locationId', selectedLocation.id);
    params.set('locationType', selectedLocation.type);
    params.set('locationName', selectedLocation.city);
    params.set('checkIn', dateRange[0].toISOString().split('T')[0]);
    params.set('checkOut', dateRange[1].toISOString().split('T')[0]);
    params.set('adults', travelers.adults.toString());
    params.set('children', travelers.children.toString());
    
    router.push(`/hotels/results?${params.toString()}`);
  };

  return (
    <div className="container hotel-search-container">
      <div className="row g-3 justify-content-center">
        <h2 className="hotel-title">Discover Your Perfect Stay</h2>

        {/* Search Input with Suggestions */}
        <div className="col-md-4 position-relative" ref={searchRef}>
          <InputGroup className="custom-input">
            <InputGroup.Text className="icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="City, Country, or Region"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedLocation(null);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selectedLocation) handleSearch();
              }}
            />
            {search && (
              <Button
                variant="link"
                className="clear-btn"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>

          {showSuggestions && (
            <div className="suggestions-dropdown">
              {isLoading ? (
                <div className="suggestion-item loading">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`suggestion-item ${selectedLocation?.id === suggestion.id ? 'active' : ''}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="suggestion-content">
                      <div className="suggestion-text">
                        <strong>{suggestion.iata}-{suggestion.city}</strong>
                        {suggestion.country&& <span className="country">{`, ${suggestion.country}`}</span>}
                      </div>
                      <div className="suggestion-type-badge">
                        {/* {suggestion.type?.charAt(0).toUpperCase() + suggestion.type?.slice(1)} */}
                        {suggestion_type}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                search.length > 1 && <div className="suggestion-item no-results">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div className="col-md-4">
          <InputGroup className="custom-input">
            <InputGroup.Text className="icon">
              <FaCalendarAlt />
            </InputGroup.Text>
            <DatePicker
              selected={dateRange[0]}
              onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              selectsRange
              placeholderText="Check-in - Check-out"
              className="form-control date-picker"
              minDate={new Date()}
            />
          </InputGroup>
        </div>

        {/* Travelers Dropdown */}
        <div className="col-md-4 position-relative">
          <InputGroup className="custom-input">
            <InputGroup.Text className="icon">
              <FaUsers />
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={`${travelers.adults} Adults, ${travelers.children} Children`}
              onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
              aria-label="Select number of travelers"
            />
          </InputGroup>

          {showTravelerDropdown && (
            <div className="traveler-dropdown">
              <div className="traveler-item">
                <span>Adults</span>
                <div className="traveler-controls">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleTravelerChange("adults", false)} disabled={travelers.adults <= 0}>
                    -
                  </Button>
                  <span className="count">{travelers.adults}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => handleTravelerChange("adults", true)}>
                    +
                  </Button>
                </div>
              </div>
              <div className="traveler-item">
                <span>Children</span>
                <div className="traveler-controls">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleTravelerChange("children", false)} disabled={travelers.children <= 0}>
                    -
                  </Button>
                  <span className="count">{travelers.children}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => handleTravelerChange("children", true)}>
                    +
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Button */}
      <div className="text-center mt-4">
        <Button className="btn btn-primary search-btn" onClick={handleSearch}>
          Search Hotels
        </Button>
      </div>

      <div className="spacer"></div>

      {/* Banner Section */}
      <div className="banner-section">
        <Image 
          src={HotelBanner} 
          alt="Luxury hotel banner showing various accommodations" 
          className="banner-image" 
          priority
        />
      </div>

      {/* Room Section */}
      <Container className="room-section text-center">
        <h5 className="small-title">Our Room</h5>
        <h2 className="main-title">A World of Choice</h2>
        <p className="description">
          Experience luxury and comfort with our wide range of rooms, each designed for a perfect stay.
        </p>

        <Row className="room-grid">
          {/* Column 1 */}
          <Col lg={4} md={12} className="room-col">
            <div className="room-box">
              <Image 
                src={Hotel1} 
                alt="Modern hotel room with queen bed" 
                className="room-img"
              />
              <p className="guest-count">2 Guests</p>
              <p className="amenities">WiFi, TV, Air Conditioning</p>
            </div>
            <div className="room-box">
              <Image 
                src={Hotel2} 
                alt="Family suite with two beds" 
                className="room-img"
              />
              <p className="guest-count">3 Guests</p>
              <p className="amenities">WiFi, Kitchen, Balcony</p>
            </div>
          </Col>

          {/* Column 2 */}
          <Col lg={4} md={12} className="room-col">
            <div className="room-box full">
              <Image 
                src={Hotel3} 
                alt="Luxury penthouse suite with living area" 
                className="room-img"
              />
              <p className="guest-count">4 Guests</p>
              <p className="amenities">WiFi, Pool, Breakfast</p>
            </div>
          </Col>

          {/* Column 3 */}
          <Col lg={4} md={12} className="room-col">
            <div className="room-box">
              <Image 
                src={Hotel4} 
                alt="Executive business room with workspace" 
                className="room-img"
              />
              <p className="guest-count">2 Guests</p>
              <p className="amenities">WiFi, Parking, Spa</p>
            </div>
            <div className="room-box">
              <Image 
                src={Hotel5} 
                alt="Deluxe room with king bed" 
                className="room-img"
              />
              <p className="guest-count">3 Guests</p>
              <p className="amenities">WiFi, Gym, Mini Bar</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HotelSearch;