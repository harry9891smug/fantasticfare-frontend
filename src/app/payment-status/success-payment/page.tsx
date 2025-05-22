'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import axios from 'axios';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    // const success = searchParams.get('success');
    const bookingId = searchParams.get('booking_id');
    const paypalToken = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');
const [success,setSuccess] = useState(false);
    useEffect(() => {
        successBooking();
        if (success == true && bookingId) {
            // Payment was successful
            window.location.href = `/booking-confirmation/${bookingId}`;
        } else {
            // Payment failed or was cancelled
            window.location.href = '/booking-failed';
        }
    }, [success, bookingId]);

    const successBooking = (async () => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            console.error('Unauthorized: No token found. Please log in.')
            return
        }

        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paypal/success-payment?booking_id=${bookingId}&token=${paypalToken}&PayerID=${PayerID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setSuccess(response.data.status)
        } catch (error: any) {
            console.error('error on success payment:', error)
            // console.error(error.response?.data?.message || 'Failed to fetch articles')

        }


    })

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
