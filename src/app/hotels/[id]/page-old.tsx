'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/details.css';

interface Hotel {
  code?: number;
  name?: {
    content?: string;
  };
  description?: {
    content?: string;
  };
  category?: {
    description?: {
      content?: string;
    };
  };
  address?: {
    content?: string;
  };
  city?: {
    content?: string;
  };
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  facilities?: Array<{
    facilityCode?: number;
    facilityGroupCode?: number;
    description?: {
      content?: string;
    };
    indLogic?: boolean;
    number?: number;
    timeFrom?: string;
    timeTo?: string;
    indYesOrNo?: boolean;
  }>;
  images?: Array<{
    path?: string;
    type?: {
      code?: string;
      description?: {
        content?: string;
      };
    };
  }>;
  rooms?: Array<{
    roomCode?: string;
    description?: string;
    type?: {
      description?: {
        content?: string;
      };
    };
    characteristic?: {
      description?: {
        content?: string;
      };
    };
    roomFacilities?: Array<{
      description?: {
        content?: string;
      };
      number?: number;
    }>;
  }>;
  phones?: Array<{
    phoneNumber?: string;
    phoneType?: string;
  }>;
  terminals?: Array<{
    terminalCode?: string;
    terminalType?: string;
    distance?: number;
    description?: {
      content?: string;
    };
  }>;
}

interface HotelData {
  data?: {
    hotel?: Hotel;
  };
  hotel?: Hotel;
}

const HotelDetails = () => {
  const params = useParams();
  const hotelId = params?.id as string;
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllRules, setShowAllRules] = useState(false);
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/${hotelId}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotel data');
        }
        const data = await response.json();
        setHotelData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (error) {
    return <div className="container py-4">Error: {error}</div>;
  }

  const hotel = hotelData?.data?.hotel || hotelData?.hotel || null;

  if (!hotel) {
    return <div className="container py-4">No hotel data found</div>;
  }


  // Extract amenities from facilities with fallbacks
  const amenities = (hotel.facilities || [])
    .filter(fac => fac?.facilityGroupCode === 60) // Room facilities
    .map(fac => fac?.description?.content || '')
    .filter(content => content) // Remove empty strings
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  // Extract rules from facilities with fallbacks
  const checkInTime = (hotel.facilities || []).find(f => f?.facilityCode === 260 && f?.facilityGroupCode === 70)?.timeFrom || '2 PM';
  const checkOutTime = (hotel.facilities || []).find(f => f?.facilityCode === 390 && f?.facilityGroupCode === 70)?.timeTo || '12 Noon';
  const smokingAllowed = (hotel.facilities || []).find(f => f?.facilityCode === 287 && f?.facilityGroupCode === 60)?.indYesOrNo !== false;

  const rules = [
    `Check-in from ${checkInTime}`,
    `Check-out until ${checkOutTime}`,
    smokingAllowed ? 'Smoking allowed' : 'No smoking in rooms',
    (hotel.facilities || []).find(f => f?.facilityCode === 264 && f?.facilityGroupCode === 60) 
      ? 'Cot on demand' 
      : 'No cots available',
    'Valid ID required at check-in'
  ];

  // Filter room images and other images with fallbacks
  const roomImages = (hotel.images || []).filter(img => img?.type?.code === 'HAB');
  const otherImages = (hotel.images || []).filter(img => img?.type?.code !== 'HAB');
  const displayedImages = [...roomImages, ...otherImages].slice(0, 5);
  const mainImage = displayedImages[0]?.path 
    ? `https://photos.hotelbeds.com/giata/${displayedImages[0].path}` 
    : 'https://photos.hotelbeds.com/giata/01/017573/017573a_hb_a_037.jpg';

  // Extract phone numbers with fallbacks
  const phoneNumbers = (hotel.phones || []).map(phone => ({
    type: phone?.phoneType || 'Phone',
    number: phone?.phoneNumber || 'N/A'
  }));

  // Extract terminals (airport, etc.) with fallbacks
  const terminals = (hotel.terminals || []).map(terminal => ({
    type: terminal?.description?.content || 'Terminal',
    name: terminal?.terminalCode || 'N/A',
    distance: terminal?.distance || 0
  }));

  // Unique room types for filter
  const uniqueRoomTypes = Array.from(
    new Set(
      (hotel.rooms || [])
        .map(room => room?.characteristic?.description?.content)
        .filter(Boolean) as string[]
    )
  );

  return (
    <div className="container py-4">
      {/* Title & Price */}
      <div className="d-flex justify-content-between flex-wrap mb-4">
        <div className="pe-md-5">
          <h4 className="fw-bold">{hotel.name?.content || 'Hotel'}</h4>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success fs-6">{hotel.category?.description?.content || 'Hotel'}</span>
            <span className="text-muted">250+ reviews</span>
          </div>
          <p className="text-muted mb-2">{hotel.city?.content || 'City'} | Tue, 08 Apr - Wed, 09 Apr | 1 Room, 2 Adults</p>
        </div>
        <div className="text-end mt-3 mt-md-0">
          <h4>
            ₹6,500 <small className="text-muted fs-6">/ night + ₹970 taxes</small>
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
                {img?.path && (
                  <Image
                    src={`https://photos.hotelbeds.com/giata/${img.path}`}
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
            <ul className="list-unstyled">
              {(showAllAmenities ? amenities : amenities.slice(0, 5)).map((item, idx) => (
                <li key={idx}>✔️ {item}</li>
              ))}
            </ul>
            {amenities.length > 5 && (
              <button className="custom-btn" onClick={() => setShowAllAmenities(!showAllAmenities)}>
                {showAllAmenities ? 'Hide Amenities' : 'View All Amenities'}
              </button>
            )}
            <hr />
          </div>

          {/* Section: About */}
          <div id="about" className="mb-5">
            <h5 className="fw-bold">About the Hotel</h5>
            <p>{hotel.description?.content || 'No description available'}</p>
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
                {hotel.coordinates?.latitude && hotel.coordinates?.longitude ? (
                  <iframe
                    src={`https://maps.google.com/maps?q=${hotel.coordinates.latitude},${hotel.coordinates.longitude}&z=15&output=embed`}
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
                {hotel.address?.content || 'Address not available'}, {hotel.city?.content || ''}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Contact Information</h5>
              <ul className="list-unstyled">
                {phoneNumbers.map((phone, idx) => (
                  <li key={idx}>
                    <strong>{phone.type}:</strong> {phone.number}
                  </li>
                ))}
              </ul>
              {terminals.length > 0 && (
                <>
                  <h6 className="mt-3">Nearby Terminals</h6>
                  <ul className="list-unstyled">
                    {terminals.map((terminal, idx) => (
                      <li key={idx}>
                        {terminal.type}: {terminal.name} ({terminal.distance} km)
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
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

      {/* Section: Rooms */}
      <div className="rooms-container">
        <h5 className="fw-bold mb-4">Rooms Available</h5>
        
        {/* Filters */}
        <div className="filter-container d-flex align-items-center gap-3 mb-4">
          <div className="position-relative">
            <select className="form-select capsule-select" id="roomTypeFilter">
              <option value="">All Room Types</option>
              {uniqueRoomTypes.map((type, idx) => (
                <option key={idx} value={type.toLowerCase().replace(/\s+/g, '-')}>
                  {type}
                </option>
              ))}
            </select>
            <i className="fas fa-chevron-down select-arrow"></i>
          </div>
          
          <div className="position-relative">
            <select className="form-select capsule-select" id="breakfastFilter">
              <option value="">All Options</option>
              <option value="with-breakfast">With Breakfast</option>
              <option value="without-breakfast">Without Breakfast</option>
            </select>
            <i className="fas fa-chevron-down select-arrow"></i>
          </div>
        </div>

        {/* Room Cards */}
        <div className="room-cards">
          {(hotel.rooms || []).slice(0, 2).map((room, roomIdx) => (
            <div className="room-card card shadow-sm mb-4" key={roomIdx}>
              <div className="card-body p-4">
                {/* Image & Details Row */}
                <div className="row g-4 align-items-start">
                  {/* Image Column - Left */}
                  <div className="col-md-4">
                    <div className="room-image-container" style={{ height: '51%' }}>
                      <Image
                        src={roomImages.length > 0 && roomImages[0]?.path
                          ? `https://photos.hotelbeds.com/giata/${roomImages[0].path}` 
                          : 'https://photos.hotelbeds.com/giata/01/017573/017573a_hb_ro_002.jpg'}
                        alt={room.description || 'Room image'}
                        width={300}
                        height={225}
                        className="rounded-3 img-fluid"
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Details Column - Right */}
                  <div className="col-md-8">
                    <h5 className="card-title fw-bold mb-2">{room.description || 'Room'}</h5>
                    <p className="text-muted mb-3">
                      {room.roomFacilities?.find(f => f.description?.content === 'Room size (sqm)')?.number || 'N/A'} sq.ft · {room.characteristic?.description?.content || 'Standard'}
                    </p>
                    
                    <div className="amenities bg-light p-3 rounded">
                      <div className="row">
                        <div className="col-6">
                          {(room.roomFacilities || []).slice(0, 3).map((facility, idx) => (
                            <div className="d-flex align-items-center mb-2" key={idx}>
                              <i className="fas fa-check text-primary me-2" style={{ width: '20px' }}></i>
                              <span>{facility.description?.content || 'Facility'}</span>
                            </div>
                          ))}
                        </div>
                        <div className="col-6">
                          {(room.roomFacilities || []).slice(3, 6).map((facility, idx) => (
                            <div className="d-flex align-items-center mb-2" key={idx}>
                              <i className="fas fa-check text-primary me-2" style={{ width: '20px' }}></i>
                              <span>{facility.description?.content || 'Facility'}</span>
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
                  <div className="col-md-4">
                    <div className="plan-card p-3 border rounded h-100">
                      <div className="d-flex flex-column h-100">
                        <div>
                          <h6 className="fw-bold mb-2">Room Only</h6>
                          <p className="small text-muted mb-1">No meals included</p>
                          <p className="small text-muted mb-2">Cancellation charges apply</p>
                        </div>
                        <div className="mt-auto">
                          <h5 className="mb-1">$000</h5>
                          <p className="small text-muted mb-1">+ $000 taxes & fees</p>
                          <button className="btn btn-primary w-100">Book</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="plan-card p-3 border rounded h-100">
                      <div className="d-flex flex-column h-100">
                        <div>
                          <h6 className="fw-bold mb-2">Room with Breakfast</h6>
                          <p className="small text-muted mb-1">Breakfast included</p>
                          <p className="small text-muted mb-2">Cancellation charges apply</p>
                        </div>
                        <div className="mt-auto">
                          <h5 className="mb-1">$500</h5>
                          <p className="small text-muted mb-1">+ $150 taxes & fees</p>
                          <button className="btn btn-primary w-100">Book</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="plan-card p-3 border rounded h-100">
                      <div className="d-flex flex-column h-100">
                        <div>
                          <h6 className="fw-bold mb-2">All Inclusive</h6>
                          <p className="small text-muted mb-1">All meals included</p>
                          <p className="small text-muted mb-2">Free cancellation</p>
                        </div>
                        <div className="mt-auto">
                          <h5 className="mb-1">$800</h5>
                          <p className="small text-muted mb-1">+ $200 taxes & fees</p>
                          <button className="btn btn-primary w-100">Book</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;