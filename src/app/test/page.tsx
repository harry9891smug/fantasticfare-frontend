// app/page.tsx or pages/index.tsx
'use client';
import React, { useState } from 'react';
import GeoAutocomplete from '../components/GeoAutocomplete';
import axios from 'axios';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [hotels, setHotels] = useState([]);

  const handleLocationSelect = (loc: any) => {
    setLocation(loc);
  };

  const fetchHotels = async () => {
    if (!location) return;
    const res =fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search-hotels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWVhNTA5OTUwMzllOTk5ZGZkYTljYSIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNzQ1NDE4MTcwLCJleHAiOjE3NDU0MzYxNzB9.3dR-ScZMzqwxJRkhsU4h8V5ptAm4hEw71Ndam7hrMh0`, // ✅ Include the token here
        },
        body: JSON.stringify({
          latitude: 28.666666666,
          longitude: 77.216666666,
          checkIn: '2025-05-01',
          checkOut: '2025-05-05',
        }),
      })
        .then(res => res.json())
        .then(console.log)
        .catch(console.error);

    setHotels(res.hotels || []);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Hotel Search</h1>
      <GeoAutocomplete onLocationSelect={handleLocationSelect} />
      <button
        onClick={fetchHotels}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search Hotels
      </button>

      {hotels.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <ul className="space-y-2">
            {hotels.map((hotel: any, idx) => (
              <li key={idx} className="p-3 border rounded">
                {hotel.name?.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
