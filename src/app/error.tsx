"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from './assets/images/logo.png';

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const safeError = error || new Error('An unexpected error occurred');
  const canReset = typeof reset === 'function';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <Image 
          src={logo} 
          alt="Logo" 
          width={120} 
          height={120} 
          className="mx-auto mb-6"
          priority
        />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">{safeError.message}</p>
        <div className="flex gap-4 justify-center">
          {canReset && (
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          )}
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}