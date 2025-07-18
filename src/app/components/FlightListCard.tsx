"use client";

import React from "react";
import "../assets/css/flightlist.css";
import { FlightData } from "../types/types"; // adjust the path if needed
import { TfiLineDashed } from "react-icons/tfi";

interface FlightCardProps {
  flight: FlightData;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => (
  <div className="main-card">
    <div className="flight-card">
      <div className="col-md-7 fligt-name-container">
        <div className="flight-airline">
          <img
            src={
              flight.airline_logos?.[
                flight?.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
                  ?.AirlineName
              ]
            }
            alt={
              flight?.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
                ?.AirlineName
            }
            className="airline-logo"
          />
          <div>
            <div className="airline-name">
              {flight?.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
                ?.AirlineName || "N/A"}
            </div>
            <div className="flight-code">
              {flight?.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
                ?.AirlineCode || ""}{" "}
              -{" "}
              {
                flight?.SegmentInformations[0]?.FlightDetails[0]?.AirlineInfo
                  ?.FlightNumber
              }
            </div>
          </div>
        </div>

        <div className="flight-times">
          <div className="d-flex align-items-center text-black align-self-center">
            <div className="flight-time">
              {flight?.timeDuration?.departureTime || "00:00"}
            </div>
            <div className="me-1 ms-1 text-black">
              <TfiLineDashed />
            </div>

            <div className="flight-time">
              {flight?.timeDuration?.arrivalTime || "00:00"}
            </div>
          </div>

          <div className="flight-duration">
            {flight.SegmentInformations?.[0]?.TotalJourneyDuration || "0h"}{" "}
            <span className="flight-stops">
              {flight.SegmentInformations?.[0]?.TotalNumberOfStops ?? "0"}{" "}
              {Number(
                flight.SegmentInformations?.[0]?.TotalNumberOfStops ?? 0
              ) === 1
                ? "Stop"
                : "Stops"}
            </span>
          </div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="flight-price">
          <div className="price">
            ${flight.FareDetails.TotalAmount.toLocaleString()}
          </div>
          <div className="promo">
            Discount Applied ${flight?.FareDetails?.discountAmount}
          </div>
          <button className="book-btn">Book</button>
        </div>
      </div>
    </div>
    <hr />
    <div className="flight-details-link">More details</div>
  </div>
);

interface FlightListProps {
  flights: FlightData[];
}

const FlightList: React.FC<FlightListProps> = ({ flights }) => {
  if (!flights || flights.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center p-5 text-center">
        <h4 className="mb-3" style={{ textAlign: "justify" }}>
          We could not find flights as per your request. Please update your
          filter criteria and try again.
        </h4>

        <h5 className="mb-2 text-justify">
          You can choose from the following options:
        </h5>

        <ul className="text-start">
          <li>Confirm the Filter criteria you have selected, and try again</li>
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
  {
    console.log(flights);
  }

  return (
    <div className="flight-list">
      {flights.map((flight, i) => (
        <FlightCard key={i} flight={flight} />
      ))}
    </div>
  );
};

export default FlightList;
