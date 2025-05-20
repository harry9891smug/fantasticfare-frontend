// components/GeoAutocomplete.tsx
'use client';
import React, { useState } from 'react';
import axios from 'axios';

interface CityOption {
  id: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

const GeoAutocomplete = ({ onLocationSelect }: { onLocationSelect: (loc: CityOption) => void }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) return;

    const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
      params: { namePrefix: value, limit: 5 },
      headers: {
        'X-RapidAPI-Key': 'dZDTkL3Bu6msh5iVoTz4RnP61L3mp1PcvTGjsndmnPXpCLQZFF',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
      },
    });

    const options = response.data.data.map((item: any) => ({
      id: item.id,
      city: item.city,
      region: item.region,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
    }));

    setSuggestions(options);
  };

  const handleSelect = (option: CityOption) => {
    setQuery(`${option.city}, ${option.region}, ${option.country}`);
    setSuggestions([]);
    onLocationSelect(option);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter city, state, or country"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-y-auto shadow-md rounded">
          {suggestions.map((sug) => (
            <li
              key={sug.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(sug)}
            >
              {sug.city}, {sug.region}, {sug.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoAutocomplete;
