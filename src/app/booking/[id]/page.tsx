'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Hotel, Room, BookingData } from '@/types';
import Image from 'next/image';
import styles from '../../assets/css/booking.module.css';
import { FaChevronDown, FaCheck, FaBed, FaSmokingBan, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';

const BookingPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [dateData, setDateData] = useState<DateData | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'coupon' | 'giftCard'>('coupon');

  const [formData, setFormData] = useState({
    holder: {
      name: '',
      surname: ''
    },
    paxes: [
      { name: '', surname: '' },
      { name: '', surname: '' }
    ],
    remark: '',
    specialRequests: {
      earlyCheckIn: false,
      lateCheckOut: false,
      extraBed: false,
      smokingRoom: false
    },
    couponCode: ''
  });

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookingData = sessionStorage.getItem(`booking_${id}`);
        const dateData = sessionStorage.getItem(`hotel_${id}`);
       
        if (!bookingData) {
          throw new Error('Failed to fetch booking data');
        }
        const data = JSON.parse(bookingData);
        const dates = JSON.parse(dateData);
       console.log(data);
        setBookingData(data);
        setDateData(dates);
        setHotel(data.hotel);
        setSelectedRoom(data.room);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking data');
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [id]);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,  // Pause the autoplay when the mouse hovers over the slider
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const userDataString = localStorage.getItem('user');
        if (!userDataString) throw new Error('User not authenticated');
        
        const userData = JSON.parse(userDataString);
        const userId = userData._id;
      if (!userId) throw new Error('User not authenticated');

      // Validate form data
      if (!formData.holder.name || !formData.holder.surname) {
        throw new Error('Please fill in booking holder details');
      }

      for (const pax of formData.paxes) {
        if (!pax.name || !pax.surname) {
          throw new Error('Please fill in all guest details');
        }
      }

      if (!selectedRoom?.rates?.[0]?.rateKey) {
        throw new Error('Room rate information is missing');
      }

      const bookingPayload = {
        holder: formData.holder,
        rooms: [{
          rateKey: selectedRoom.rates[0].rateKey,
          paxes: formData.paxes.map((pax, index) => ({
            roomId: 1,
            type: "AD",
            name: pax.name,
            surname: pax.surname
          }))
        }],
        clientReference: "WebBooking",
        remark: formData.remark,
        tolerance: 2,
        user_id: userId,
        rateKey: selectedRoom.rates[0].rateKey
      };

      const response = await fetch(`http://localhost:8000/api/bookHotel/${params.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      const data = await response.json();

    if (data.status && data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      router.push(`/booking-confirmation/${data.bookingId}`);
    }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (isLoading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading your booking details...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2>Booking Error</h2>
      <p>{error}</p>
      <button 
        onClick={() => router.push(`/hotels/${params.id}`)}
        className={styles.errorButton}
      >
        Back to Hotel
      </button>
    </div>
  );

  if (!hotel || !selectedRoom || !bookingData) return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2>No Booking Data</h2>
      <p>We couldn't find your booking details.</p>
      <button 
        onClick={() => router.push('/')}
        className={styles.errorButton}
      >
        Back to Home
      </button>
    </div>
  );

  // Calculate pricing
  const checkInDate = formatDate(dateData.checkIn);
  const checkOutDate = formatDate(dateData.checkOut);
  const duration = calculateDuration(dateData.checkIn, dateData.checkOut);
  const roomPrice = selectedRoom.rates?.[0]?.net || 0;
  const taxes = selectedRoom.rates?.[0]?.taxes?.amount || 0;
  const totalPrice = (roomPrice + taxes) * duration;
console.log(roomPrice ,taxes , totalPrice);
  // Get hotel main image
  const hotelMainImage = hotel.images?.find(img => img.type === 'general')?.src || hotel.images?.[0]?.src;

  return (
    <div className={styles.container}>
      <main className={styles.mainContent} role="main" aria-label="Review your itinerary">
        <h2>Review your itinerary</h2>
        
        {/* Booking Summary */}
        <section className={styles.bookingSummary} aria-label="Hotel and booking summary">
          <div className={styles.hotelInfo}>
            <h3 className={styles.hotelName}>{hotel.name}</h3>
            <div className={styles.datesGuests}>
              <div>
                <div className={styles.label}>Check-in</div>
                <div className={styles.value}>{checkInDate.short}</div>
                <div className={styles.subvalue}>{checkInDate.weekday}, 3 PM</div>
              </div>
              <div>
                <div className={styles.label}>Check-out</div>
                <div className={styles.value}>{checkOutDate.short}</div>
                <div className={styles.subvalue}>{checkOutDate.weekday}, 12 PM</div>
              </div>
              <div>
                <div className={styles.label}>Rooms & Guests</div>
                <div className={styles.value}>1 Room, {formData.paxes.length} Guests</div>
                <div className={styles.subvalue}>{formData.paxes.length} adults</div>
              </div>
            </div>
          </div>
          <div className={styles.hotelImageContainer}>
            {hotelMainImage && (
              <Image
                src={hotelMainImage}
                alt={`${hotel.name} exterior`}
                className={styles.hotelImage}
                width={80}
                height={80}
                priority
              />
            )}
            <button 
              className={styles.detailsButton} 
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
            >
              Details <FaChevronDown className={showDetails ? styles.rotateIcon : ''} />
            </button>
          </div>
        </section>

        {showDetails && (
          <div className={styles.hotelDetails}>
            <p>{hotel.description}</p>
            <div className={styles.hotelFacilities}>
              {hotel.facilities?.slice(0, 6).map((facility, index) => (
                <span key={index} className={styles.facilityBadge}>{facility}</span>
              ))}
            </div>
          </div>
        )}

        {/* Room Details with Slider */}
        <section className={styles.roomDetails} aria-label="Room details">
          <h3 className={styles.roomTitle}>{selectedRoom.name}</h3>
          <div className={styles.roomContent}>
            {selectedRoom.images?.length > 0 ? (
              <div className={styles.roomSliderContainer}>
                <Slider {...sliderSettings} className={styles.roomSlider}>
                  {selectedRoom.images.map((image, index) => (
                    <div key={index} className={styles.slide}>
                      <Image
                        src={`https://photos.hotelbeds.com/giata/${image.path}`}
                        alt={`${selectedRoom.name} view ${index + 1}`}
                        width={600}
                        height={400}
                        className={styles.roomImage}
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className={styles.roomImagePlaceholder}>
                <Image
                  src="/room-placeholder.jpg"
                  alt="Room placeholder"
                  width={600}
                  height={400}
                  className={styles.roomImage}
                />
              </div>
            )}
            <div className={styles.roomTags}>
              {selectedRoom.beds && <span className={styles.tag}>{selectedRoom.beds}</span>}
              {selectedRoom.roomSize && <span className={styles.tag}>{selectedRoom.roomSize} sq.ft</span>}
              {selectedRoom.view && <span className={styles.tag}>{selectedRoom.view} view</span>}
              {selectedRoom.roomFacilities?.slice(0, 3).map((facility, index) => (
                <span key={index} className={styles.tag}>{facility}</span>
              ))}
            </div>
          </div>
          <div className={styles.roomFeatures}>
            <ul>
              {selectedRoom.roomFacilities?.slice(0, 2).map((facility, index) => (
                <li key={index}><FaCheck /> {facility}</li>
              ))}
              <li><button className={styles.seeDetailsButton}>See room details</button></li>
            </ul>
            <ul>
              {selectedRoom.roomFacilities?.slice(2, 4).map((facility, index) => (
                <li key={index}><FaCheck /> {facility}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Guest Information Form */}
        <section className={styles.guestForm} aria-label="Guest information">
          <h3>Guest Information</h3>
          
          <div className={styles.formSection}>
            <h4 className={styles.formSubtitle}>Booking Holder</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>First Name*</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.holder.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    holder: { ...formData.holder, name: e.target.value }
                  })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Last Name*</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.holder.surname}
                  onChange={(e) => setFormData({
                    ...formData,
                    holder: { ...formData.holder, surname: e.target.value }
                  })}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSubtitle}>Guest Details</h4>
            {formData.paxes.map((pax, index) => (
              <div key={index} className={styles.guestCard}>
                <h5 className={styles.guestTitle}>Guest {index + 1}</h5>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name*</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={pax.name}
                      onChange={(e) => {
                        const newPaxes = [...formData.paxes];
                        newPaxes[index] = { ...newPaxes[index], name: e.target.value };
                        setFormData({ ...formData, paxes: newPaxes });
                      }}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name*</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={pax.surname}
                      onChange={(e) => {
                        const newPaxes = [...formData.paxes];
                        newPaxes[index] = { ...newPaxes[index], surname: e.target.value };
                        setFormData({ ...formData, paxes: newPaxes });
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Requests */}
        <section className={styles.specialRequests} aria-label="Special requests">
          <h3>Special requests</h3>
          <div className={styles.requestsForm}>
            <div className={styles.requestsGroup}>
              <label className={styles.title}>Check-in/Check-out</label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.specialRequests.earlyCheckIn}
                  onChange={(e) => setFormData({
                    ...formData,
                    specialRequests: {
                      ...formData.specialRequests,
                      earlyCheckIn: e.target.checked
                    }
                  })}
                />
                Early or Late Check-in
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.specialRequests.lateCheckOut}
                  onChange={(e) => setFormData({
                    ...formData,
                    specialRequests: {
                      ...formData.specialRequests,
                      lateCheckOut: e.target.checked
                    }
                  })}
                />
                Late Check-out
              </label>
            </div>
            <div className={styles.requestsGroup}>
              <label className={styles.title}>Bed</label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.specialRequests.extraBed}
                  onChange={(e) => setFormData({
                    ...formData,
                    specialRequests: {
                      ...formData.specialRequests,
                      extraBed: e.target.checked
                    }
                  })}
                />
                <FaBed /> Extra bed
              </label>
            </div>
            <div className={styles.requestsGroup}>
              <label className={styles.title}>Room preferences</label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.specialRequests.smokingRoom}
                  onChange={(e) => setFormData({
                    ...formData,
                    specialRequests: {
                      ...formData.specialRequests,
                      smokingRoom: e.target.checked
                    }
                  })}
                />
                <FaSmokingBan /> Smoking room
              </label>
            </div>
          </div>
          <div className={styles.remarksSection}>
            <label className={styles.remarksLabel}>Additional Remarks</label>
            <textarea
              className={styles.remarksInput}
              value={formData.remark}
              onChange={(e) => setFormData({...formData, remark: e.target.value})}
              placeholder="Any special requests or notes..."
              rows={3}
            />
          </div>
        </section>
      </main>

      {/* Payment Summary Sidebar */}
      <aside className={styles.sidebar} aria-label="Booking summary and coupon">
        <section className={styles.priceBreakup} aria-labelledby="price-breakup-title">
          <h4 id="price-breakup-title">Price breakup</h4>
          <div className={styles.priceList}>
            <div>
              <span>1 room x {duration} night{duration > 1 ? 's' : ''}</span>
              <span>₹{(roomPrice * duration).toLocaleString()}</span>
            </div>
            <div>
              <span>Hotel taxes</span>
              <span>₹{(taxes * duration).toLocaleString()}</span>
            </div>
            <div>
              <span>Convenience fee</span>
              <span>₹0</span>
            </div>
            <div className={styles.total}>
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div>1 room · {duration} night{duration > 1 ? 's' : ''}</div>
          </div>
        </section>

        <section className={styles.couponSection} aria-labelledby="coupon-section-title">
          <h4 id="coupon-section-title">Apply coupon or gift card</h4>
          <div className={styles.couponToggle} role="tablist" aria-label="Coupon or gift card toggle">
            <button
              className={activeTab === 'coupon' ? styles.active : ''}
              onClick={() => setActiveTab('coupon')}
              type="button"
            >
              Coupon
            </button>
            <button
              className={activeTab === 'giftCard' ? styles.active : ''}
              onClick={() => setActiveTab('giftCard')}
              type="button"
              disabled
            >
              Gift card
            </button>
          </div>
          <form className={styles.couponForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Coupon code"
              aria-label="Coupon code"
              value={formData.couponCode}
              onChange={(e) => setFormData({...formData, couponCode: e.target.value})}
            />
            <button type="submit">Apply</button>
          </form>
        </section>

        <button
          className={styles.continueButton}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue to payment'}
        </button>
      </aside>
    </div>
  );
};

export default BookingPage;