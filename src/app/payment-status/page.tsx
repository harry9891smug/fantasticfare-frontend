'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (success === 'true' && bookingId) {
      // Payment was successful
      window.location.href = `/booking-confirmation/${bookingId}`;
    } else {
      // Payment failed or was cancelled
      window.location.href = '/booking-failed';
    }
  }, [success, bookingId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p>Please wait while we verify your payment.</p>
      </div>
    </div>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={<div>Loading Payment Status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
