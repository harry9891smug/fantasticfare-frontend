"use client";

import React from "react";
import "../assets/css/sidebarfilters.css";

interface Filters {
  stops: string[];
  airlines: string[];
  price: number;
  allAirlines: string[];
}

interface SidebarFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onReset?: () => void;
  allAirlines: string[];
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  setFilters,
  allAirlines,
}) => {
  const handleCheckbox = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, price: Number(e.target.value) }));
  };

  return (
    <div className="sidebar-filters">
      <h3>Stops</h3>
      <div className="filter-group">
        {["Non-stop", "1 stop", "2+ stops"].map((stop) => (
          <label key={stop}>
            <input
              type="checkbox"
              checked={filters.stops.includes(stop)}
              onChange={() => handleCheckbox("stops", stop)}
            />{" "}
            {stop}
          </label>
        ))}
      </div>
      <h3>Price Range</h3>
      <div className="filter-group">
        <input
          type="range"
          min={100}
          max={10000}
          value={filters.price}
          onChange={handlePriceChange}
        />
        <div>Up to ${filters.price.toLocaleString()}</div>
      </div>

      <h3>Airlines</h3>
      <div className="filter-group">
        {allAirlines.map((airline) => (
          <label key={airline}>
            <input
              type="checkbox"
              checked={filters.airlines.includes(airline)}
              onChange={() => handleCheckbox("airlines", airline)}
            />{" "}
            {airline}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SidebarFilters;
