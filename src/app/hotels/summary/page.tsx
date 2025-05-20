"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function HotelSummaryContent() {
  const searchParams = useSearchParams();
  const [rateDetails, setRateDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');
      if (dataParam) {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setRateDetails(decodedData);
      } else {
        setError('No rate data found');
      }
    } catch (err) {
      setError('Invalid rate data format');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) return <p className="container mt-5">Loading rate details...</p>;
  if (error) return <p className="container mt-5 text-danger">Error: {error}</p>;
  if (!rateDetails) return <p className="container mt-5">No rate details available</p>;

  return (
    <div className="container mt-5">
      <h2>Hotel Rate Summary</h2>
      <div className="card mt-3">
        <div className="card-body">
          <pre className="mb-0">{JSON.stringify(rateDetails, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default function HotelSummary() {
  return (
    <Suspense fallback={<div className="container mt-5">Loading...</div>}>
      <HotelSummaryContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';