'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import HotelDetails from '../../components/hotelDetailsPage';

export default function HotelDetailsPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const storedData = sessionStorage.getItem(`hotel_${id}`);

      if (storedData) {
        const parsed = JSON.parse(storedData);
        setInitialData({
          hotelData: parsed.hotel,
          roomsData: parsed.rooms,
        });

        // Optional: clear after using
      //  sessionStorage.removeItem(`hotel_${id}`);
      } else {
        console.warn("No data found in sessionStorage for this hotel ID");
      }
    }
  }, [id]);

  if (!initialData) {
    return <div>Loading hotel details...</div>;
  }

  return (
    <HotelDetails
      hotelId={id}
      initialData={initialData}
    />
  );
}
