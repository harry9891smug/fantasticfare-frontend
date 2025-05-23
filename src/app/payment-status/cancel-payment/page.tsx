'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

function CancelPaymentContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('booking_id');
    const [cancelProcessed, setCancelProcessed] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCancel = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Unauthorized: No token found. Please log in.');
                setCancelProcessed(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paypal/cancel-payment?booking_id=${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Booking Cancel Response:", response.data);
                setCancelProcessed(true);
            } catch (error: any) {
                console.error('Error on cancel payment:', error);
                setCancelProcessed(false);
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            handleCancel();
        }
    }, [bookingId]);

    useEffect(() => {
        if (loading) return;

        // Always redirect to failed page after processing cancel
        window.location.href = '/booking-failed';
    }, [cancelProcessed, loading]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Cancelling Booking...</h1>
                <p>Please wait while we update the booking status.</p>
            </div>
        </div>
    );
}

export default function CancelPaymentPage() {
    return (
        <Suspense fallback={<div>Processing Cancel...</div>}>
            <CancelPaymentContent />
        </Suspense>
    );
}
