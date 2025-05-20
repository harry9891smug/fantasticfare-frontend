// app/booking-failed/page.tsx
'use client';
import Link from 'next/link';

export default function BookingFailed() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Payment Not Completed</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">Your payment was not completed. Please try again.</p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}