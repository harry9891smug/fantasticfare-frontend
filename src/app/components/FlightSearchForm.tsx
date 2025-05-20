// components/FlightSearchForm.tsx
'use client';

import React, { useState } from 'react';
import Select from 'react-select';

interface FlightSearchFormProps {
  onSubmit: (formData: FlightSearchData) => void;
}

export interface FlightSearchData {
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  cabinClass: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travelers: number;
  email: string;
  phone: string;
  phoneCountryCode: string;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSubmit }) => {
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  const [cabinClass, setCabinClass] = useState('economy');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');

  const countryOptions = [
    { value: '+1', label: 'USA' },
    { value: '+44', label: 'UK' },
    { value: '+91', label: 'India' },
  ];

  const cabinClassOptions = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tripType,
      cabinClass,
      from,
      to,
      departureDate,
      returnDate: tripType === 'one-way' ? undefined : returnDate,
      travelers,
      email,
      phone,
      phoneCountryCode,
    });
  };

  return (
    <div className="flight-search-form">
      <form onSubmit={handleSubmit}>
        {/* Trip Type Tabs */}
        <div className="trip-type-tabs">
          <button
            type="button"
            className={`tab ${tripType === 'round-trip' ? 'active' : ''}`}
            onClick={() => setTripType('round-trip')}
          >
            Round Trip
          </button>
          <button
            type="button"
            className={`tab ${tripType === 'one-way' ? 'active' : ''}`}
            onClick={() => setTripType('one-way')}
          >
            One-way
          </button>
          <button
            type="button"
            className={`tab ${tripType === 'multi-city' ? 'active' : ''}`}
            onClick={() => setTripType('multi-city')}
          >
            Multi-city
          </button>
        </div>

        <div className="form-row">
          {/* Cabin Class Dropdown */}
          <div className="form-group cabin-class">
            <Select
              options={cabinClassOptions}
              value={cabinClassOptions.find(opt => opt.value === cabinClass)}
              onChange={(selected) => setCabinClass(selected?.value || 'economy')}
              classNamePrefix="react-select"
              placeholder="Economy"
            />
          </div>

          {/* From Location */}
          <div className="form-group">
            <div className="form-label">Leaving From</div>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="City or Airport"
              required
            />
          </div>

          {/* To Location */}
          <div className="form-group">
            <div className="form-label">Going to</div>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="City or Airport"
              required
            />
          </div>

          {/* Dates */}
          <div className="form-group">
            <div className="form-label">Dates</div>
            <div className="date-display">
              {departureDate || 'Departure'} - {returnDate || 'Return'}
            </div>
          </div>

          {/* Travelers */}
          <div className="form-group">
            <div className="form-label">Travellers</div>
            <div className="travelers-display">
              {travelers} {travelers === 1 ? 'traveller' : 'travellers'}
            </div>
          </div>
        </div>

        <div className="form-row extras-row">
          <button type="button" className="extra-btn">
            Add a place to stay
          </button>
          <button type="button" className="extra-btn">
            Add a car
          </button>
        </div>

        <div className="form-row contact-row">
          {/* Email */}
          <div className="form-group email-group">
            <div className="form-label">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group phone-group">
            <div className="form-label">Contact</div>
            <div className="phone-input-container">
              <Select
                options={countryOptions}
                value={countryOptions.find(opt => opt.value === phoneCountryCode)}
                onChange={(selected) => setPhoneCountryCode(selected?.value || '+1')}
                classNamePrefix="react-select"
                className="country-select"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="search-btn">
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;