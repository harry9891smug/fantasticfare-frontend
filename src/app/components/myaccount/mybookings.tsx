import React, { useState, useEffect } from "react";

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setBookings([]); // Replace with actual data
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <p>Loading bookings...</p>;
    }

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((booking, index) => (
                        <li key={index}>{booking}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;