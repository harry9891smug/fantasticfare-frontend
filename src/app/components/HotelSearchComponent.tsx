"use client";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaCalendarAlt, FaUsers, FaTimes } from "react-icons/fa";
import { Form, Button, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/hotels.css";

type TravelerType = "adults" | "children";
type Suggestion = {
  city: string;
  id: string;
  name: string;
  type: "city" | "country" | "region";
  country?: string;
  country_name?: string;
  iata: string;
};

type HotelSearchProps = {
  initialData?: {
    locationId: string;
    locationType: string;
    locationName: string;
    checkIn: Date | null;
    checkOut: Date | null;
    adults: number;
    children: number;
  };
  showTitle?: boolean;
  compact?: boolean;
};

const HotelSearchComponent = ({
  initialData,
  showTitle = true,
  compact = false,
}: HotelSearchProps) => {
  const [search, setSearch] = useState(initialData?.locationName || "");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initialData?.checkIn || null,
    initialData?.checkOut || null,
  ]);
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [travelers, setTravelers] = useState({
    adults: initialData?.adults || 2,
    children: initialData?.children || 0,
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Suggestion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion_type, setSuggestionType] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [travellerError, setTravellerError] = useState<string>("");

  useEffect(() => {
    if (initialData?.locationId && initialData.locationName) {
      setSelectedLocation({
        id: initialData.locationId,
        city: initialData.locationName,
        name: initialData.locationName,
        type: initialData.locationType as any,
        iata: initialData.locationName.substring(0, 3).toUpperCase(),
      });
    }
  }, [initialData]);

  const fetchSuggestions = debounce(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/search_city`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city_name: query }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTravelerChange = (type: TravelerType, increment: boolean) => {
    setTravelers((prev) => {
      const totalTravelers = prev.adults + prev.children;
      setTravellerError("");

      if (increment) {
        if (totalTravelers >= 9) {
          setTravellerError("You can max select 9 Travellers.");
          return prev;
        }
        return { ...prev, [type]: prev[type] + 1 };
      } else {
        return { ...prev, [type]: Math.max(0, prev[type] - 1) };
      }
    });
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSelectedLocation(suggestion);
    setSearch(
      `${suggestion.city}${suggestion.country ? `, ${suggestion.country}` : ""}`
    );
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
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const params = new URLSearchParams();
    params.set("locationId", selectedLocation.id);
    params.set("locationType", selectedLocation.type);
    params.set("locationName", selectedLocation.city);
    params.set("checkIn", formatDate(dateRange[0]));
    params.set("checkOut", formatDate(dateRange[1]));
    params.set("adults", travelers.adults.toString());
    params.set("children", travelers.children.toString());

    router.push(`/hotels/results?${params.toString()}`);
  };

  return (
    <div className={`hotel-search-container-form ${compact ? "compact" : ""}`}>
      <div
        className={`row g-3 ${
          compact ? "align-items-end" : "justify-content-center"
        }`}
      >
        {showTitle && (
          <h2 className="hotel-title">Discover Your Perfect Stay</h2>
        )}

        {/* Search Input with Suggestions */}
        <div
          className={`${compact ? "col-md-4" : "col-md-3"} position-relative`}
          ref={searchRef}
        >
          <InputGroup className="customh-input">
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
                if (e.key === "Enter" && selectedLocation) handleSearch();
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
                    className={`suggestion-item ${
                      selectedLocation?.id === suggestion.id ? "active" : ""
                    }`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="suggestion-content">
                      <div className="suggestion-text">
                        <strong>
                          {suggestion.iata}-{suggestion.city}
                        </strong>
                        {suggestion.country && (
                          <span className="country">{`, ${suggestion.country}`}</span>
                        )}
                      </div>
                      <div className="suggestion-type-badge">
                        {suggestion_type}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                search.length > 1 && (
                  <div className="suggestion-item no-results">
                    No results found
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div className={`${compact ? "col-md-3" : "col-md-3"}`}>
          <InputGroup className="customh-input mb-2">
            <InputGroup.Text className="icon">
              <FaCalendarAlt />
            </InputGroup.Text>
            <DatePicker
              selected={dateRange[0]}
              onChange={(date) => setDateRange([date, dateRange[1]])}
              placeholderText="Check-in"
              className="form-control date-picker"
              minDate={new Date()}
            />
          </InputGroup>
        </div>
        <div className="col-md-3">
          <InputGroup className="customh-input mb-2">
            <InputGroup.Text className="icon">
              <FaCalendarAlt />
            </InputGroup.Text>
            <DatePicker
              selected={dateRange[1]}
              onChange={(date) => setDateRange([dateRange[0], date])}
              placeholderText="Check-out"
              className="form-control date-picker"
              minDate={dateRange[0] || new Date()}
            />
          </InputGroup>
        </div>

        {/* Travelers Dropdown */}
        <div
          className={`${compact ? "col-md-2" : "col-md-3"} position-relative`}
        >
          <InputGroup className="customh-input">
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
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleTravelerChange("adults", false)}
                    disabled={travelers.adults <= 0}
                  >
                    -
                  </Button>
                  <span className="count">{travelers.adults}</span>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleTravelerChange("adults", true)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="traveler-item">
                <span>Children</span>
                <div className="traveler-controls">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleTravelerChange("children", false)}
                    disabled={travelers.children <= 0}
                  >
                    -
                  </Button>
                  <span className="count">{travelers.children}</span>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleTravelerChange("children", true)}
                  >
                    +
                  </Button>
                </div>
              </div>
              {travellerError && (
                <div
                  className="traveller-error"
                  style={{ color: "red", marginTop: "0.5rem" }}
                >
                  {travellerError}
                </div>
              )}
            </div>
          )}
        </div>

        {compact && (
          <div className="col-md-12 text-center mt-3">
            <Button className="search-btn" onClick={handleSearch}>
              Search Hotels
            </Button>
          </div>
        )}
      </div>

      {!compact && (
        <div className="text-center mt-4">
          <Button className="search-btn" onClick={handleSearch}>
            Search Hotels
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelSearchComponent;
