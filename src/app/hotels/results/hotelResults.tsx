'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiSearch, FiStar, FiChevronDown, FiChevronUp, FiMapPin ,FiImage, FiTrendingUp } from 'react-icons/fi';
import { FaSwimmingPool, FaWifi, FaSpa, FaDumbbell} from 'react-icons/fa';

import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import '../../assets/css/search.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

type Hotel = {
  code: number;
  name: string;
  categoryName: string;
  destinationName: string;
  zoneName: string;
  latitude: string;
  longitude: string;
  minRate: string;
  maxRate: string;
  currency: string;
  rooms: {
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
  }[];
  stars?: number;
  rating?: string;
  amenities?: string[];
  tags?: string[];
  trending?: boolean;
  petFriendly?: boolean;
  imageUrl?: string;
  images?: Array<{
    src: string;
    type: string;
  }>;
};

export default function HotelResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationId = searchParams.get('locationId');
  const locationType = searchParams.get('locationType');
  const locationName = searchParams.get('locationName');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [IsLoading,setIsLoading] = useState(true)
  const [collapsedFilters, setCollapsedFilters] = useState({
    sort: false,
    suggested: false,
    price: false,
    ratings: false,
    locations: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 10;
  const fetchHotelImages = async (hotelCode: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/searchHotel/${hotelCode}`);
      const data = await response.json();
  
      if (data?.status && data.data?.images) {
        // Only return images with type = "General view"
        const generalViewImages = data.data.images.filter(
          (img: any) => img.type?.toLowerCase() === 'general view'
        );
        return generalViewImages;
      }
  
      return [];
    } catch (error) {
      console.error(`Error fetching images for hotel ${hotelCode}:`, error);
      return [];
    }
  };
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        if (!locationId || !locationType) {
          console.error('Missing required location parameters');
          setLoading(false);
          return;
        }
  
        const requestBody = {
          stay: {
            checkIn: checkIn || new Date().toISOString().split('T')[0],
            checkOut: checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          },
          occupancies: [{
            rooms: 1,
            adults: adults ? parseInt(adults) : 2,
            children: children ? parseInt(children) : 0,
          }],
          type: locationType,
          id: locationId,
          radius: {
            radius: 20,
            radius_type: "km"
          }
        };
  
        console.log('Sending request:', requestBody);
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/searchHotelsByArea`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
        console.log('API response:', data);
  
       
      if (data?.status && data.data?.hotels) {
        let hotelsList = Array.isArray(data.data.hotels) 
          ? data.data.hotels 
          : data.data.hotels.hotels || [];

        // Fetch images for each hotel
        const hotelsWithImages = await Promise.all(
          hotelsList.map(async (hotel: any) => {
            const images = await fetchHotelImages(hotel.code || hotel.hotelCode);
            return {
              ...hotel,
              code: hotel.code || hotel.hotelCode,
              name: hotel.name || hotel.hotelName,
              minRate: hotel.minRate || hotel.price || '0',
              stars: hotel.stars || Math.floor(Math.random() * 5) + 1,
              rating: hotel.rating || (Math.random() * 2 + 3).toFixed(1),
              amenities: hotel.amenities || ['Pool', 'Wifi', 'Gym', 'Spa'].filter(() => Math.random() > 0.5),
              images: images,
              imageUrl: images[0]?.src || `/hotel-${Math.floor(Math.random() * 5) + 1}.jpg`
            };
          })
        );

        setHotels(hotelsWithImages);
        setFilteredHotels(hotelsWithImages);
      } else {
        console.error('No hotels found in response');
        setHotels([]);
        setFilteredHotels([]);
      }
    } catch (err) {
        console.error("Error fetching hotels:", err);
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHotels();
  }, [locationId, locationType, checkIn, checkOut, adults, children]);
  // Apply filters
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      console.log('Starting hotel fetch...');
      
      try {
        // Validate required params
        if (!locationId || !locationType) {
          console.error('Missing required parameters:', {
            locationId,
            locationType,
            checkIn,
            checkOut,
            adults,
            children
          });
          setLoading(false);
          return;
        }
  
        // Prepare request body
        const requestBody = {
          stay: {
            checkIn: checkIn || new Date().toISOString().split('T')[0],
            checkOut: checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          },
          occupancies: [{
            rooms: 1,
            adults: adults ? parseInt(adults) : 2,
            children: children ? parseInt(children) : 0,
          }],
          type: locationType,
          id: parseInt(locationId), // Ensure this is number
          radius: {
            radius: 20,
            radius_type: "km"
          }
        };
  
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
        // Make API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/searchHotelsByArea`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
  
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Full API response:', data);
  
        // Process response
        if (data?.status) {
          // Handle different response structures
          let hotelsList = [];
          
          if (Array.isArray(data.data)) {
            hotelsList = data.data;
          } else if (data.data?.hotels) {
            hotelsList = Array.isArray(data.data.hotels) 
              ? data.data.hotels 
              : [data.data.hotels];
          } else {
            console.warn('Unexpected response structure:', data);
            hotelsList = [];
          }
  
          console.log('Extracted hotels:', hotelsList);
  
          // Enhance hotel data
          const enhancedHotels = hotelsList.map((hotel: any) => ({
            ...hotel,
            code: hotel.code || hotel.hotelCode || Math.random().toString(36).substring(2, 9),
            name: hotel.name || hotel.hotelName || 'Unknown Hotel',
            minRate: hotel.minRate || hotel.price || '0',
            stars: hotel.stars || Math.floor(Math.random() * 5) + 1,
            rating: hotel.rating || (Math.random() * 2 + 3).toFixed(1),
            amenities: hotel.amenities || ['Pool', 'Wifi', 'Gym', 'Spa'].filter(() => Math.random() > 0.5),
            imageUrl: hotel.imageUrl || `/hotel-${Math.floor(Math.random() * 5) + 1}.jpg`
          }));
  
          setHotels(enhancedHotels);
          setFilteredHotels(enhancedHotels);
        } else {
          console.error('API returned non-success status:', data);
          setHotels([]);
          setFilteredHotels([]);
        }
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHotels();
  }, [locationId, locationType, checkIn, checkOut, adults, children]);
  const toggleFilterSection = (section: string) => {
    setCollapsedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleStarSelection = (star: number) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenitySelection = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleLocationSelection = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const currentHotels = filteredHotels.slice(0, indexOfLastHotel);
  const hasMoreHotels = filteredHotels.length > indexOfLastHotel;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (hotels.length === 0 && !loading) {
    return (
      <div className="no-results text-center py-5">
        <h3>No hotels found</h3>
        <p>Try adjusting your search filters or dates</p>
        <Button 
          variant="primary" 
          onClick={() => router.push('/hotels')}
          className="mt-3"
        >
          Modify Search
        </Button>
      </div>
    );
  }

  return (
    <div className="hotel-results-page">
      {/* Header with search */}
      <div className="search-header py-3 bg-light">
        <Container>
          <div className="search-box p-3 bg-white rounded shadow-sm">
            <div className="search-input d-flex align-items-center">
              <FiSearch className="search-icon me-2" />
              <input 
                type="text" 
                className="form-control border-0"
                placeholder="Search hotels..." 
                defaultValue={locationName || ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/hotels?city=${e.currentTarget.value}`);
                  }
                }}
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="my-4">
        <Row>
          {/* Filters Sidebar */}
          <Col md={3} className="mb-4">
            <div className="filters-sidebar bg-white p-3 rounded shadow-sm">
              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFilterSection('sort')}
                >
                  <h5 className="mb-0">Sort By</h5>
                  {collapsedFilters.sort ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!collapsedFilters.sort && (
                  <div className="filter-options mt-2">
                    <div 
                      className={`filter-option py-2 px-3 mb-1 rounded ${sortOption === 'popular' ? 'active' : ''}`}
                      onClick={() => setSortOption('popular')}
                    >
                      Popular
                    </div>
                    <div 
                      className={`filter-option py-2 px-3 mb-1 rounded ${sortOption === 'rating' ? 'active' : ''}`}
                      onClick={() => setSortOption('rating')}
                    >
                      User Rating
                    </div>
                    <div 
                      className={`filter-option py-2 px-3 mb-1 rounded ${sortOption === 'price-high' ? 'active' : ''}`}
                      onClick={() => setSortOption('price-high')}
                    >
                      Price (High to Low)
                    </div>
                    <div 
                      className={`filter-option py-2 px-3 rounded ${sortOption === 'price-low' ? 'active' : ''}`}
                      onClick={() => setSortOption('price-low')}
                    >
                      Price (Low to High)
                    </div>
                  </div>
                )}
              </div>

              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFilterSection('price')}
                >
                  <h5 className="mb-0">Price Range</h5>
                  {collapsedFilters.price ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!collapsedFilters.price && (
                  <div className="filter-options mt-2">
                    <input 
                      type="range" 
                      className="form-range mb-3"
                      min="0" 
                      max="1000" 
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="d-flex justify-content-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFilterSection('suggested')}
                >
                  <h5 className="mb-0">Star Rating</h5>
                  {collapsedFilters.suggested ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!collapsedFilters.suggested && (
                  <div className="filter-options mt-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div 
                        key={star}
                        className={`filter-option py-2 px-3 mb-1 rounded d-flex align-items-center ${selectedStars.includes(star) ? 'active' : ''}`}
                        onClick={() => toggleStarSelection(star)}
                      >
                        <div className="me-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < star ? 'text-warning' : 'text-secondary'} size={14} />
                          ))}
                        </div>
                        <span>& Up</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-section">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFilterSection('amenities')}
                >
                  <h5 className="mb-0">Amenities</h5>
                  {collapsedFilters.ratings ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!collapsedFilters.ratings && (
                  <div className="filter-options mt-2">
                    {['Pool', 'Wifi', 'Gym', 'Spa', 'Breakfast', 'Free Cancellation'].map(amenity => (
                      <div 
                        key={amenity}
                        className={`filter-option py-2 px-3 mb-1 rounded ${selectedAmenities.includes(amenity) ? 'active' : ''}`}
                        onClick={() => toggleAmenitySelection(amenity)}
                      >
                        {amenity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Hotel Results */}
          <Col md={9}>
            <div className="results-count mb-3">
              <h5>{filteredHotels.length} hotels in {locationName}</h5>
              {currentHotels.length < filteredHotels.length && (
                <small className="text-muted">(Showing {currentHotels.length} of {filteredHotels.length})</small>
              )}
            </div>

            <div className="hotel-results">
              {currentHotels.map(hotel => (
               <div key={hotel.code} className="hotel-card-enhanced mb-4">
               <Row className="g-0">
                 {/* Image Slider Column */}
                 <Col md={4} className="pe-md-2">
                   <div className="hotel-image-container h-100">
                     {hotel.images && hotel.images.length > 0 ? (
                       <Swiper
                         modules={[Pagination, Autoplay]}
                         spaceBetween={0}
                         slidesPerView={1}
                         pagination={{ clickable: true }}
                         autoplay={{ delay: 3000, disableOnInteraction: false }}
                         loop={hotel.images.length > 1}
                         className="h-100"
                         style={{
                            '--swiper-pagination-bullet-size': '8px',
                            '--swiper-pagination-bullet-horizontal-gap': '6px'
                          } as React.CSSProperties}
                       >
                         {hotel.images.map((image, index) => (
                           <SwiperSlide key={index}>
                             <div className="image-wrapper h-100">
                               <Image
                                 src={image.src}
                                 alt={`${hotel.name} - ${image.type}`}
                                 fill
                                 className="swiper-image"
                                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 priority={index === 0}
                                 unoptimized={true}
                               />
                             </div>
                           </SwiperSlide>
                         ))}
                       </Swiper>
                     ) : (
                       <div className="no-image-placeholder h-100">
                         <FiImage className="placeholder-icon" />
                       </div>
                     )}
                     
                     {hotel.trending && (
                       <div className="trending-badge">
                         <FiTrendingUp className="me-1" /> Trending
                       </div>
                     )}
                     
                     <div className="rating-badge">
                       <FiStar className="me-1" />
                       {hotel.rating}
                     </div>
                   </div>
                 </Col>
             
                 {/* Details Column */}
                 <Col md={5} className="py-3 py-md-0">
                   <div className="hotel-details h-100 ps-md-3">
                     <h3 className="hotel-name mb-2">
                       <Link href={`/hotels/${hotel.code}`} className="text-decoration-none">
                         {hotel.name}
                       </Link>
                     </h3>
                     
                     <div className="hotel-location mb-2">
                       <FiMapPin className="me-1" />
                       <span>{hotel.zoneName}, {hotel.destinationName}</span>
                     </div>
                     
                     <div className="hotel-stars mb-2">
                       {[...Array(5)].map((_, i) => (
                         <FiStar 
                           key={i} 
                           className={`star-icon ${i < (hotel.stars || 0) ? 'filled' : 'empty'}`} 
                         />
                       ))}
                     </div>
                     
                     <div className="hotel-amenities mb-3">
                       {hotel.amenities?.slice(0, 4).map(amenity => (
                         <span key={amenity} className="amenity-badge">
                           {amenity === 'Pool' && <FaSwimmingPool className="me-1" />}
                           {amenity === 'Wifi' && <FaWifi className="me-1" />}
                           {amenity === 'Gym' && <FaDumbbell className="me-1" />}
                           {amenity === 'Spa' && <FaSpa className="me-1" />}
                           {amenity}
                         </span>
                       ))}
                     </div>
                     
                     {hotel.tags?.includes('Breakfast Included') && (
                       <div className="highlight-tag">
                         <FiCoffee className="me-1" /> Breakfast Included
                       </div>
                     )}
                     {hotel.tags?.includes('Free Cancellation') && (
                       <div className="highlight-tag">
                         <FiCheckCircle className="me-1" /> Free Cancellation
                       </div>
                     )}
                   </div>
                 </Col>
             
                 {/* Pricing Column */}
                 <Col md={3} className="py-3 py-md-0">
                   <div className="hotel-pricing h-100">
                     <div className=" mb-3">
                       <div className="original-price">
                         <span>${(parseFloat(hotel.minRate) * 1.2).toFixed(2)}</span>
                         <span className="discount-badge">20% OFF</span>
                       </div>
                       <div className="current-price">${hotel.minRate}</div>
                       <div className="price-note">per night (incl. taxes)</div>
                     </div>
                     
                     <Button
  variant="primary"
  className="book-now-btn w-100 mb-2"
  onClick={() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`hotel_${hotel.code}`, JSON.stringify({
        hotel,
        rooms: hotel.rooms,
        checkIn,
        checkOut,
      }));

      // Use delay to ensure it's written before navigating
      setTimeout(() => {
        router.push(`/hotels/${hotel.code}`);
      }, 200);
    }
  }}
>
  View Deal
</Button>

                     
                     <div className="text-center">
                       <small className="text-muted">Login to Book Now & Pay Later</small>
                     </div>
                   </div>
                 </Col>
               </Row>
             </div>
              ))}
            </div>

            {hasMoreHotels && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline-primary"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4"
                >
                  Load More Hotels
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}