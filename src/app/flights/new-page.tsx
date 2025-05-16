// pages/flights.tsx
'use client';

import React from 'react';
import FlightSearchForm, { FlightSearchData } from '../components/FlightSearchForm';
import '../assets/css/flightform.css';
const FlightsPage = () => {
  const handleSearch = (formData: FlightSearchData) => {
    console.log('Search submitted:', formData);
    // Handle the search submission (e.g., API call, navigation to results)
  };

  return (
    <div className="flights-page">
      <div className="page-header">
        <h1>Find Your Perfect Flight</h1>
        <p>Search and compare flights from hundreds of airlines</p>
      </div>
      
      <div className="search-container">
        <FlightSearchForm onSubmit={handleSearch} />
      </div>
      
      {/* Rest of your flights page content */}
    </div>
  );
};

export default FlightsPage;