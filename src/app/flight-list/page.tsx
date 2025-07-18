"use client";

import React, { useEffect, useState } from "react";
import SidebarFilters from "../components/SidebarFilters";
import FlightList from "../components/FlightListCard";
import "../assets/css/flightlistpage.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FlightData } from "../types/types"; // adjust path
import flightLoader from "../../../public/assets/images/loader/loader.gif";
import noFlightFound from "../assets/images/noResultFound.jpg";
import Image from "next/image";
import SpecialCallOfferModal from "../components/SpecialCallOfferModal";

const FlightResult = () => {
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestBody, setRequestBody] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [allAirlines, setAllAirlines] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("flightData");

    if (stored) {
      const formData = JSON.parse(stored);

      const {
        leavingFrom,
        goingTo,
        startDate,
        returnDate,
        cabinClass,
        tripType,
        travellers: { adults, children, infantsLap },
      } = formData;

      const modifiedLeavingFrom = leavingFrom.slice(0, 3).toUpperCase();
      const modifiedGoingTo = goingTo.slice(0, 3).toUpperCase();
      const modifiedTripType = tripType === "round-trip" ? 1 : 0;
      const formatDate = (dateStr: string) =>
        new Date(dateStr).toISOString().split("T")[0];

      const itenaries = [
        {
          Reference: "1",
          FromCity: modifiedLeavingFrom,
          ToCity: modifiedGoingTo,
          TravelDate: formatDate(startDate),
        },
      ];

      // If round trip, add return segment
      if (tripType === "round-trip" && returnDate) {
        itenaries.push({
          Reference: "2",
          FromCity: modifiedGoingTo,
          ToCity: modifiedLeavingFrom,
          TravelDate: formatDate(returnDate),
        });
      }

      const request = {
        currencycode: "USD",
        TripType: modifiedTripType, // 0 = One Way, 1 = Round Trip
        occupancies: {
          adults,
          children,
          infants: infantsLap,
        },
        itenaries,
        cabinClass: 1,
      };
      setRequestBody(request);
    }
  }, []);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/flights`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
        const json = await response.json();
        setLoading(false);
        setFlightData(json?.data);
        setShowPopup(true);
      } catch (error) {
        console.error("Failed to fetch flight data", error);
      } finally {
        setLoading(false);
      }
    };

    if (requestBody) {
      fetchFlightData();
    }
  }, [requestBody]);

  useEffect(() => {
    const maxPrice =
      flightData?.[flightData.length - 1]?.FareDetails.TotalAmountAfterRules;
    const airlineStrList = [
      ...new Set(
        flightData
          .map(
            (f) =>
              f.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
                ?.AirlineName
          )
          .filter(Boolean)
      ),
    ];
    setAllAirlines(airlineStrList.sort());
    setFilters((prev) => ({
      ...prev,
      price: Number(maxPrice),
    }));
  }, [flightData]);

  //sideNavFilters
  const [filters, setFilters] = useState({
    stops: [] as string[],
    airlines: [] as string[],
    price: 5000,
  });

  const [sortState, setSortState] = useState({
    airline: true,
    departure: true,
    arrival: true,
    price: true,
  });

  const [activeSort, setActiveSort] = useState<
    "airline" | "departure" | "arrival" | "price" | null
  >(null);

  const applyFilters = () => {
    let filtered = flightData.filter((flight: FlightData) => {
      const matchAirline =
        filters.airlines.length === 0 ||
        filters.airlines.includes(
          flight?.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
            ?.AirlineName
        );

      const totalStops = flight?.SegmentInformations?.[0]?.TotalNumberOfStops;

      let stopLabel = "";
      if (totalStops === "0") {
        stopLabel = "Non-stop";
      } else if (totalStops === "1") {
        stopLabel = "1 stop";
      } else if (totalStops >= "2") {
        stopLabel = "2+ stops";
      }
      const matchStops =
        filters.stops.length === 0 || filters.stops.includes(stopLabel); // fixed from flight.stops

      const matchPrice =
        flight?.FareDetails.TotalAmountAfterRules <= filters.price;
      return matchAirline && matchStops && matchPrice;
    });

    if (activeSort) {
      const isAsc = sortState[activeSort];
      filtered = filtered.sort((a, b) => {
        if (activeSort === "price") {
          return isAsc
            ? a?.FareDetails?.TotalAmountAfterRules -
                b?.FareDetails?.TotalAmountAfterRules
            : b?.FareDetails?.TotalAmountAfterRules -
                a?.FareDetails?.TotalAmountAfterRules;
        } else {
          return isAsc
            ? getSortValue(a, activeSort).localeCompare(
                getSortValue(b, activeSort)
              )
            : getSortValue(b, activeSort).localeCompare(
                getSortValue(a, activeSort)
              );
        }
      });
    }

    return filtered;
  };

  const getSortValue = (
    flight: FlightData,
    key: "airline" | "departure" | "arrival"
  ): string => {
    switch (key) {
      case "airline":
        return (
          flight.SegmentInformations?.[0]?.FlightDetails?.[0]?.AirlineInfo
            ?.AirlineName || ""
        );
      case "departure":
        return flight?.timeDuration?.departureDate || "";
      case "arrival":
        return flight?.timeDuration?.arrivalTime || "";
      default:
        return "";
    }
  };

  const sortFlights = (key: "airline" | "departure" | "arrival" | "price") => {
    setActiveSort((prevKey) => (prevKey === key ? key : key));
    setSortState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setFilters({
      stops: [],
      airlines: [],
      price: 5000,
    });
    setActiveSort(null);
  };

  const renderSortIcon = (
    key: "airline" | "departure" | "arrival" | "price"
  ) => {
    if (activeSort !== key) return null;
    return sortState[key] ? <FaArrowDown /> : <FaArrowUp />;
  };
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Image src={flightLoader} alt="src" unoptimized />
      </div>
    );
  if (!flightData || flightData.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center p-5 text-center">
        <Image src={noFlightFound} alt="No flights found" className="mb-4" />

        <h4 className="mb-3" style={{ textAlign: "justify" }}>
          We could not find flights as per your request. Please update your
          search criteria and try again.
        </h4>

        <h5 className="mb-2 text-justify">
          You can choose from the following options:
        </h5>

        <ul className="text-start">
          <li>Confirm the search criteria you have entered, and try again</li>
          <li>Enter new search details</li>
          <li>
            For further assistance, call us toll free at{" "}
            <strong>+1-833-422-7770</strong>
          </li>
        </ul>

        <p className="mt-3">
          Thank you for choosing{" "}
          <a href="https://www.fantasticfare.com/" target="_blank">
            www.fantasticfare.com
          </a>
        </p>
      </div>
    );
  }
  return (
    <div className="my-4 container">
      <SpecialCallOfferModal
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
      <div className="row">
        <div className="mb-4 col-md-3">
          <div className="filter-stop-text">
            <SidebarFilters
              filters={filters}
              setFilters={setFilters}
              onReset={resetFilters}
              allAirlines={allAirlines}
            />
          </div>
        </div>
        <div className="mb-4 col-md-9">
          <div className="flight-filter">
            <div className="flight-filter-background">
              <div
                className={`sort-airline ${
                  activeSort === "airline" ? "active-sort" : ""
                }`}
                onClick={() => sortFlights("airline")}
              >
                Airlines {renderSortIcon("airline")}
              </div>

              <div
                className={`sort-departure ${
                  activeSort === "departure" ? "active-sort" : ""
                }`}
                onClick={() => sortFlights("departure")}
              >
                Departure {renderSortIcon("departure")}
              </div>

              <div
                className={`sort-arrival ${
                  activeSort === "arrival" ? "active-sort" : ""
                }`}
                onClick={() => sortFlights("arrival")}
              >
                Arrival {renderSortIcon("arrival")}
              </div>

              <div
                className={`sort-price ${
                  activeSort === "price" ? "active-sort" : ""
                }`}
                onClick={() => sortFlights("price")}
              >
                Price {renderSortIcon("price")}
              </div>
            </div>
          </div>
          <FlightList flights={applyFilters()} />
        </div>
      </div>
    </div>
  );
};

export default FlightResult;
