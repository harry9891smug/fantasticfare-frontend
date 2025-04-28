'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter} from 'next/navigation';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/details.css';
import { FiMapPin, FiStar, FiPhone, FiWifi } from 'react-icons/fi';
import { FaSwimmingPool, FaSpa, FaDumbbell, FaParking, FaUtensils, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';
import AuthPopup from "./apppopup";
interface Hotel {
  code: number;
  name: string;
  description: string;
  categoryName: string;
  destinationName: string;
  zoneName: string;
  latitude: string;
  longitude: string;
  minRate: string;
  maxRate: string;
  currency: string;
  images?: Array<{
    src: string;
    type: string;
  }>;
  amenities?: string[];
  facilities?: string[];
  stars?: number;
  rating?: string;
  policies?: {
    checkIn: string;
    checkOut: string;
    pets: string;
    paymentMethods: string[];
  };
  phones?: Array<{
    phoneNumber: string;
    phoneType: string;
  }>;
  rooms?: Room[];
  
  checkInx?: string;

  checkOut?: string;
}

interface Room {
  code: string;
  name: string;
  rates: {
    rateKey: string;
    rateClass: string;
    rateType: string;
    net: string;
    boardName: string;
    cancellationPolicies: {
      amount: string;
      from: string;
    }[];
  }[];
  roomFacilities?: string[];
  size?: string;
  images?: Array<{
    path: string;
    roomCode: string;
    roomType: string;
  }>;
}

interface HotelData {
  code: number;
  name?: { content?: string };
  description?: { content?: string };
  category?: { code?: string; description?: { content?: string } };
  destination?: { name?: { content?: string } };
  city?: { content?: string };
  zone?: { name?: string };
  coordinates?: { latitude?: number; longitude?: number };
  images?: Array<{
    path?: string;
    type?: { code?: string };
    roomCode?: string;
    roomType?: string;
  }>;
  facilities?: Array<{
    facilityGroupCode?: number;
    facilityCode?: number;
    description?: { content?: string };
    timeFrom?: string;
    timeTo?: string;
    number?: number;
  }>;
  phones?: Array<{
    phoneNumber?: string;
    phoneType?: string;
  }>;
  rooms?: Array<{
    roomCode?: string;
    description?: string;
    roomFacilities?: Array<{
      description?: { content?: string };
      facilityCode?: number;
      number?: number;
    }>;
  }>;
}
const HotelDetails = () => {
  const params = useParams();
  const hotelId = params?.id as string;
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllRules, setShowAllRules] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({
    roomType: '',
    breakfast: ''
  });
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleBookClick = async (room: Room) => {
    // Check if we have a token in localStorage
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!authToken) {
      // No token found - show login popup
      setSelectedRoom(room);
      setShowLoginPopup(true);
      return;
    }
  
    // Optional: Basic token validation
    try {
      setIsAuthenticating(true);
      
      // Simple check if token exists and looks valid
      if (authToken && authToken.split('.').length === 3) {
        // Token exists and has JWT structure (header.payload.signature)
        proceedToBooking(room);
      } else {
        // Token exists but is malformed
        localStorage.removeItem('authToken');
        setSelectedRoom(room);
        setShowLoginPopup(true);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setSelectedRoom(room);
      setShowLoginPopup(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const proceedToBooking = (room: Room) => {
    sessionStorage.setItem(`booking_${hotelId}`, JSON.stringify({
      hotel,
      room
    }));
    router.push(`/booking/${hotelId}`);
  };


 const handleLoginSuccess = async () => {
  if (selectedRoom) {
    try {
      proceedToBooking(selectedRoom);
    } catch (error) {
      console.error('Booking failed after login:', error);
      setAuthError('Failed to proceed with booking');
    }
  }
};
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);
  

        // Fetch hotel details
        const hotelRes = await fetch("http://localhost:8000/api/hotels/hotel-details", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotel_id: hotelId }),
          signal: abortController.signal
        });
        
        if (!hotelRes.ok) throw new Error('Failed to fetch hotel details');
        
        const hotelJson = await hotelRes.json();
        const hotelData: HotelData = hotelJson.data?.hotel || hotelJson.hotel;
        let cachedRating: string | null = null;
        let checkInx: string | null = null;
        let checkOut: string | null = null;
        // Fetch room rates
        const searchSession = sessionStorage.getItem(`hotel_${hotelId}`);
        let availableRoomDetails: Room[] = [];
  
        if (searchSession) {
          const parsed = JSON.parse(searchSession);
          cachedRating = parsed?.hotel?.rating ? parseFloat(parsed.hotel.rating).toString() : null;
           checkInx = parsed?.checkIN;
           checkOut = parsed?.checkOut;
          const validRateKeys = parsed.rooms
            ?.map((room: any) => room.rates?.[0]?.rateKey)
            ?.filter(Boolean) || [];
  
          if (validRateKeys.length > 0) {
            try {
              const ratesRes = await fetch('http://localhost:8000/api/hotels/checkFare', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWVhNTA5OTUwMzllOTk5ZGZkYTljYSIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNzQ1NTc0MTExLCJleHAiOjE3NDU1OTIxMTF9.x_09fZRiZvgFadL-14icvjNZ_fPsWQFzG9hpF2kmVWw'
                },
                body: JSON.stringify({
                  rooms: validRateKeys.slice(0, 10).map((rateKey: string) => ({ rateKey }))
                }),
                signal: abortController.signal
              });
      
              if (!ratesRes.ok) throw new Error('Failed to fetch room rates');
      
              const ratesJson = await ratesRes.json();
              const availableRoomsData: Room[] = ratesJson.data?.hotel?.rooms || ratesJson.rooms || [];
  
              const normalizeCode = (str: string = '') => str.replace(/[\s_\-.]/g, '').toLowerCase();
              const availableRoomsMap = availableRoomsData.reduce((acc: Record<string, Room>, avRoom) => {
                const key = normalizeCode(avRoom.code);
                if (key) acc[key] = avRoom;
                return acc;
              }, {});
  
              availableRoomDetails = hotelData.rooms
                ?.map(room => {
                  const normalizedCode = normalizeCode(room.roomCode);
                  const matchedRoom = availableRoomsMap[normalizedCode];
                  if (!matchedRoom) return null;
  
                  const images = hotelData.images?.filter(img => img.roomCode === room.roomCode) || [];
          
                  return {
                    code: room.roomCode || '',
                    name: room.description || '',
                    rates: matchedRoom.rates || [],
                    roomFacilities: room.roomFacilities?.map(fac => fac.description?.content || '') || [],
                    size: room.roomFacilities?.find(fac => fac.facilityCode === 295)?.number?.toString(),
                    images: images.map(img => ({
                      path: img.path || '',
                      roomCode: img.roomCode || '',
                      roomType: img.roomType || ''
                    }))
                  };
                })
                .filter((room): room is Room => room !== null) || [];
            } catch (err) {
              console.error('Error fetching room rates:', err);
            }
          } // Closing brace for if(validRateKeys.length > 0)
        } // Closing brace for if(searchSession)
  
        // Calculate min and max rates
        const rates = availableRoomDetails.flatMap(room => room.rates.map(rate => parseFloat(rate.net || '0')));
        const minRate = rates.length ? Math.min(...rates).toString() : '0';
        const maxRate = rates.length ? Math.max(...rates).toString() : '0';
  
        // Transform data
        const transformedHotel: Hotel = {
          
          code: hotelData.code || 0,
          name: hotelData.name?.content || 'Hotel',
          description: hotelData.description?.content || 'No description available',
          categoryName: hotelData.category?.description?.content || 'Hotel',
          destinationName: hotelData.destination?.name?.content || hotelData.city?.content || 'City',
          zoneName: hotelData.zone?.name || hotelData.city?.content || 'Zone',
          latitude: hotelData.coordinates?.latitude?.toString() || '0',
          longitude: hotelData.coordinates?.longitude?.toString() || '0',
          minRate,
          maxRate,
          currency: 'USD',
          rating: cachedRating ?? "0",
          checkInx: checkInx ?? "0",
          checkOut: checkOut ?? "0",
          // Ensure rating is always a string
          stars: hotelData.category?.code ? parseInt(hotelData.category.code) / 10 : 3,
          images: hotelData.images?.map(img => ({
            src: img.path ? `https://photos.hotelbeds.com/giata/${img.path}` : '',
            type: img.type?.code || ''
          })) || [],
          amenities: (hotelData.facilities || [])
            .filter(fac => fac?.facilityGroupCode === 60)
            .map(fac => fac?.description?.content || '')
            .filter(Boolean) as string[],
          facilities: (hotelData.facilities || [])
            .filter(fac => fac?.facilityGroupCode !== 60)
            .map(fac => fac?.description?.content || '')
            .filter(Boolean) as string[],
          policies: {
            checkIn: (hotelData.facilities || []).find(f => f?.facilityCode === 260 && f?.facilityGroupCode === 70)?.timeFrom || '2 PM',
            checkOut: (hotelData.facilities || []).find(f => f?.facilityCode === 390 && f?.facilityGroupCode === 70)?.timeTo || '12 Noon',
            pets: (hotelData.facilities || []).find(f => f?.facilityCode === 287) ? 'Allowed' : 'Not allowed',
            paymentMethods: ['Credit Card', 'Cash']
          },
          phones: (hotelData.phones || []).map(phone => ({
            phoneNumber: phone.phoneNumber || '',
            phoneType: phone.phoneType || ''
          })),
          rooms: availableRoomDetails
        };
  
        // Cache to localStorage
        localStorage.setItem(`hotel_${hotelId}_full`, JSON.stringify({
          data: transformedHotel,
          timestamp: Date.now()
        }));
  
        setHotel(transformedHotel);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };
  
    fetchHotelData();
    return () => abortController.abort();
  }, [hotelId]);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    if (!hotel?.rooms) return [];
    
    return hotel.rooms.filter(room => {
      // Room type filter
      const typeMatch = !filters.roomType || 
                       room.name?.toLowerCase().includes(filters.roomType.toLowerCase());
      
      // Breakfast filter
      const hasBreakfast = room.rates?.some(rate => 
        rate.boardName?.toLowerCase().includes('breakfast'));
      
      if (filters.breakfast === 'with-breakfast') {
        return typeMatch && hasBreakfast;
      } else if (filters.breakfast === 'without-breakfast') {
        return typeMatch && !hasBreakfast;
      }
      
      return typeMatch;
    });
  }, [hotel?.rooms, filters]);

  const getRoomImage = (roomCode: string) => {
    if (!hotel) return 'https://photos.hotelbeds.com/giata/01/017573/017573a_hb_a_037.jpg';
    
    const roomWithImages = hotel.rooms?.find(r => r.code === roomCode);
    if (roomWithImages?.images?.length) {
      return `https://photos.hotelbeds.com/giata/${roomWithImages.images[0].path}`;
    }
    
    const roomImage = hotel.images?.find(img => img.type === 'HAB');
    return roomImage?.src || 'https://photos.hotelbeds.com/giata/01/017573/017573a_hb_a_037.jpg';
  };

  const nextSlide = () => setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1));
  const goToSlide = (index: number) => setCurrentSlide(index);

  if (loading) return <div className="container py-4 text-center">Loading hotel details...</div>;
  if (error) return <div className="container py-4 alert alert-danger">Error: {error}</div>;
  if (!hotel) return <div className="container py-4 alert alert-warning">No hotel data found</div>;

  // Extract rules from hotel data
  const rules = [
    `Check-in from ${hotel.policies?.checkIn || '2 PM'}`,
    `Check-out until ${hotel.policies?.checkOut || '12 Noon'}`,
    hotel.policies?.pets === 'Allowed' ? 'Pets allowed' : 'No pets allowed',
    'Valid ID required at check-in'
  ];

  // Display first 5 images or default image
  const displayedImages = hotel.images?.slice(0, 5) || [];
  const mainImage = displayedImages[0]?.src || 'https://photos.hotelbeds.com/giata/01/017573/017573a_hb_a_037.jpg';

  // Get unique room types for filter dropdown
  const uniqueRoomTypes = Array.from(new Set(hotel?.rooms?.map(room => room.name).filter(Boolean)) || []);

  return (
    <div className="container py-4">
        {showLoginPopup && (
      <AuthPopup
        onClose={() => {
          setShowLoginPopup(false);
          setAuthError(null);
          setSelectedRoom(null);
        }}
        onSuccess={handleLoginSuccess}
        error={authError}
      />
    )}
      {/* Title & Price */}
      <div className="d-flex justify-content-between flex-wrap mb-4">
        <div className="pe-md-5">
          <h4 className="fw-bold">{hotel.name}</h4>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success fs-6">{hotel.categoryName}</span>
            <span className="text-muted">250+ reviews</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <FiMapPin size={14} />
            <span className="text-muted">{hotel.destinationName} | {hotel.zoneName}</span>
          </div>
          <div className="d-flex align-items-center mt-2">
  {[1, 2, 3, 4, 5].map((star) => {
    const numericRating = parseFloat(hotel.rating || "0");
    // Show full star if rating is within 0.25 of the star value
    const showFullStar = numericRating >= star - 0.25;
    // Show half star if rating is within 0.25-0.75 of the star value
    const showHalfStar = !showFullStar && numericRating >= star - 0.75;
    
    return (
      <span key={star}>
        {showFullStar ? (
          <FiStar className="text-warning" />
        ) : showHalfStar ? (
          <FaStarHalfAlt className="text-warning" />
        ) : (
          <FaRegStar className="text-warning" />
        )}
      </span>
    );
  })}
  <span className="ms-2 badge bg-light text-dark">
    {parseFloat(hotel.rating || "0").toFixed(1)} / 5
  </span>
</div>
        </div>
        <div className="text-end mt-3 mt-md-0">
          <h4>
            ${hotel.minRate}<small className="text-muted fs-6">/ night </small>
          </h4>
          <button className="btn btn-primary mt-2">Select Room</button>
        </div>
      </div>

      {/* Anchor Nav */}
      <ul className="custom-tabs nav flex-wrap gap-3 mb-4">
        {['amenities', 'about', 'rules', 'reviews', 'rooms'].map((section) => (
          <li key={section} className="nav-item">
            <a href={`#${section}`} className="nav-link custom-tab-link text-capitalize">
              {section}
            </a>
          </li>
        ))}
      </ul>

      <div className="row mb-4">
        {/* Left Side Images */}
        <div className="col-md-6">
          <div className="row">
            {displayedImages.slice(0, 4).map((img, idx) => (
              <div className="col-6 mb-3" key={idx}>
                {img?.src && (
                  <Image
                    src={img.src}
                    alt={`Hotel view ${idx + 1}`}
                    width={500}
                    height={300}
                    className="img-fluid w-100 rounded"
                    priority={idx === 0}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="col-md-6">
          <Image
            src={mainImage}
            alt="Main hotel view"
            width={500}
            height={600}
            className="img-main w-100 h-100 object-cover rounded"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Left: 60% */}
        <div className="col-lg-7">
          {/* Section: Amenities */}
          <div id="amenities" className="mb-5">
            <h5 className="fw-bold">Amenities</h5>
            <Row>
              {(showAllAmenities ? hotel.amenities : hotel.amenities?.slice(0, 12)).map((amenity, index) => (
                <Col xs={6} md={4} key={index} className="mb-2">
                  <div className="amenity-item">
                    {amenity === 'Pool' && <FaSwimmingPool className="me-2" />}
                    {amenity === 'Wifi' && <FiWifi className="me-2" />}
                    {amenity === 'Gym' && <FaDumbbell className="me-2" />}
                    {amenity === 'Spa' && <FaSpa className="me-2" />}
                    {amenity === 'Parking' && <FaParking className="me-2" />}
                    {amenity === 'Restaurant' && <FaUtensils className="me-2" />}
                    {amenity}
                  </div>
                </Col>
              ))}
            </Row>
            {hotel.amenities && hotel.amenities.length > 12 && (
              <button className="custom-btn" onClick={() => setShowAllAmenities(!showAllAmenities)}>
                {showAllAmenities ? 'Hide Amenities' : 'View All Amenities'}
              </button>
            )}
            <hr />
          </div>

          {/* Section: About */}
          <div id="about" className="mb-5">
            <h5 className="fw-bold">About the Hotel</h5>
            <p>{hotel.description}</p>
            <hr />
          </div>

          {/* Section: Rules */}
          <div id="rules" className="mb-5">
            <h5 className="fw-bold">Hotel Rules</h5>
            <ul className="list-unstyled">
              {(showAllRules ? rules : rules.slice(0, 3)).map((rule, idx) => (
                <li key={idx}>📝 {rule}</li>
              ))}
            </ul>
            <button className="custom-btn" onClick={() => setShowAllRules(!showAllRules)}>
              {showAllRules ? 'Hide Rules' : 'View All Rules'}
            </button>
            <hr />
          </div>
        </div>

        {/* Right: 40% */}
        <div className="col-lg-5">
          {/* Sidebar Cards */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Why Book With Us?</h5>
              <ul className="list-unstyled">
                <li>✔️ 24/7 customer support</li>
                <li>✔️ No hidden charges</li>
                <li>✔️ Instant booking confirmation</li>
                <li>✔️ Easy cancellation policies</li>
              </ul>
            </div>
          </div>

          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Map Location</h5>
              <div className="ratio ratio-4x3 rounded overflow-hidden">
                {hotel.latitude && hotel.longitude ? (
                  <iframe
                    src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" style={{height: '100%'}}>
                    <p>Location not available</p>
                  </div>
                )}
              </div>
              <p className="mt-2 mb-0">
                {hotel.zoneName}, {hotel.destinationName}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Contact Information</h5>
              <ul className="list-unstyled">
                {hotel.phones?.map((phone, idx) => (
                  <li key={idx}>
                    <strong>{phone.phoneType || 'Phone'}:</strong> {phone.phoneNumber || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className='row mb-4'>
        <div className="reviews-container">
          <div id="reviews" className="mb-4">
            <h5 className="fw-bold">Reviews</h5>
          </div>

          <div className="reviews-slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}> 
            {/* Review cards would go here */}
          </div>

          {/* Slider Controls */}
          <div className="slider-controls">
            <button className="slider-prev" onClick={prevSlide}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="slider-dots">
              {[0, 1, 2].map((index) => (
                <span 
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
            <button className="slider-next" onClick={nextSlide}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="rooms-container">
        <h5 className="fw-bold mb-4">Rooms Available</h5>
        
        {/* Filters */}
        <div className="filter-container d-flex align-items-center gap-3 mb-4">
          <div className="position-relative">
            <select 
              className="form-select capsule-select" 
              value={filters.roomType}
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
            >
              <option value="">All Room Types</option>
              {uniqueRoomTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div className="position-relative">
            <select 
              className="form-select capsule-select" 
              value={filters.breakfast}
              onChange={(e) => setFilters({...filters, breakfast: e.target.value})}
            >
              <option value="">All Options</option>
              <option value="with-breakfast">With Breakfast</option>
              <option value="without-breakfast">Without Breakfast</option>
            </select>
          </div>

          {(filters.roomType || filters.breakfast) && (
            <button 
              className="btn btn-outline-secondary ms-2"
              onClick={() => setFilters({ roomType: '', breakfast: '' })}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Room Cards */}
        <div className="room-cards">
          {filteredRooms.length ? (
            filteredRooms.map((room, roomIdx) => (
              <div className="room-card card shadow-sm mb-4" key={roomIdx}>
                <div className="card-body p-4">
                  {/* Image & Details Row */}
                  <div className="row g-4 align-items-start">
                    {/* Image Column - Left */}
                    <div className="col-md-4">
                      <div className="room-image-container" style={{ height: '51%' }}>
                        <Image
                          src={getRoomImage(room.code)}
                          alt={room.name || 'Room image'}
                          width={300}
                          height={225}
                          className="rounded-3 img-fluid"
                          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Details Column - Right */}
                    <div className="col-md-8">
                      <h5 className="card-title fw-bold mb-2">{room.name || 'Room'}</h5>
                      <p className="text-muted mb-3">
                        {room.size || 'N/A'} sq.ft · Standard
                      </p>
                      
                      <div className="amenities bg-light p-3 rounded">
                        <div className="row">
                          <div className="col-6">
                            {(room.roomFacilities || []).slice(0, 3).map((facility, idx) => (
                              <div className="d-flex align-items-center mb-2" key={idx}>
                                <i className="fas fa-check text-primary me-2" style={{ width: '20px' }}></i>
                                <span>{facility}</span>
                              </div>
                            ))}
                          </div>
                          <div className="col-6">
                            {(room.roomFacilities || []).slice(3, 6).map((facility, idx) => (
                              <div className="d-flex align-items-center mb-2" key={idx}>
                                <i className="fas fa-check text-primary me-2" style={{ width: '20px' }}></i>
                                <span>{facility}</span>
                              </div>
                            ))}
                            {room.roomFacilities && room.roomFacilities.length > 6 && (
                              <div className="d-flex align-items-center">
                                <a href="#" className="text-primary small">
                                  + {room.roomFacilities.length - 6} more
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room Plans Row */}
                  <div className="row mt-4 g-3">
                    {room.rates?.length ? (
                      room.rates.map((rate, rateIdx) => (
                        <div className="col-md-4" key={rateIdx}>
                          <div className="plan-card p-3 border rounded h-100">
                            <div className="d-flex flex-column h-100">
                              <div>
                                <h6 className="fw-bold mb-2">{rate.boardName || 'Room Only'}</h6>
                                <p className="small text-muted mb-1">
                                  {rate.cancellationPolicies[0]?.amount === '0' 
                                    ? 'Free Cancellation' 
                                    : 'Cancellation charges apply'}
                                </p>
                              </div>
                              <div className="mt-auto">
                                <h5 className="mb-1">${rate.net}</h5>
                                <p className="small text-muted mb-1">+ $000 taxes & fees</p>
                                <button className="btn btn-primary w-100"  key={room.code}
           onClick={() => handleBookClick(room)}
           disabled={isAuthenticating}
         >
           {isAuthenticating ? 'Checking...' : 'Book Now'}</button>
                              </div>
                             
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <div className="alert alert-warning">No rates available for this room</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info">No rooms match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;