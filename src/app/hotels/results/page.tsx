import { Suspense } from 'react';
import HotelResults from './hotelResults';

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading search results...</div>}>
      <HotelResults />
    </Suspense>
  );
}