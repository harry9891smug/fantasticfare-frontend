'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiStar, FiChevronDown, FiChevronUp, FiMapPin, FiImage, FiTrendingUp, FiCoffee, FiCheckCircle } from 'react-icons/fi';
import { FaSwimmingPool, FaWifi, FaSpa, FaDumbbell } from 'react-icons/fa';
import gif from "../../assets/images/app.gif";
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import '../../assets/css/search.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import HotelSearchComponent from '../../components/HotelSearchComponent';

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
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedFilters, setCollapsedFilters] = useState({
    sort: false,
    price: false,
    stars: false,
    amenities: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 10;

  const fetchHotelImages = async (hotelCode: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/searchHotel/${hotelCode}`);
      const data = await response.json();
  
      if (data?.status && data.data?.images) {
        return data.data.images.filter(
          (img: any) => img.type?.toLowerCase() === 'general view'
        );
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
        
        setIsLoading(true);
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
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels/searchHotelsByArea`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) throw new Error('Failed to fetch hotels');
        
        const data = await response.json();
       
        if (data?.status && data.data?.hotels) {
          let hotelsList = Array.isArray(data.data.hotels) 
            ? data.data.hotels 
            : data.data.hotels.hotels || [];

          const hotelsWithImages = await Promise.all(
            hotelsList.map(async (hotel: any) => {
              const images = await fetchHotelImages(hotel.code || hotel.hotelCode);
              return {
                ...hotel,
                code: hotel.code || hotel.hotelCode,
                name: hotel.name || hotel.hotelName,
                minRate: hotel.minRate || hotel.price || '0',
                maxRate: hotel.maxRate || parseInt(hotel.minRate || '0') * 1.5,
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
        setIsLoading(false);
      }
    };
  
    fetchHotels();
  }, [locationId, locationType, checkIn, checkOut, adults, children]);

  // Apply filters and sorting
  useEffect(() => {
    if (hotels.length === 0) return;

    let results = [...hotels];

    // Apply star rating filter
  if (selectedStars.length > 0) {
  results = results.filter(hotel => 
    selectedStars.some(star => (hotel.stars || 0) >= star)
  );
}

    // Apply price range filter
    results = results.filter(hotel => {
      const price = parseFloat(hotel.minRate);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply amenities filter
   if (selectedAmenities.length > 0) {
  results = results.filter(hotel => 
    selectedAmenities.every(amenity => 
      hotel.amenities?.includes(amenity)
    )
  );
}


    // Apply sorting
    switch (sortOption) {
      case 'rating':
        results.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
        break;
      case 'price-high':
        results.sort((a, b) => parseFloat(b.minRate) - parseFloat(a.minRate));
        break;
      case 'price-low':
        results.sort((a, b) => parseFloat(a.minRate) - parseFloat(b.minRate));
        break;
      default: // 'popular'
        results.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
        break;
    }

    setFilteredHotels(results);
    setCurrentPage(1);
  }, [hotels, sortOption, priceRange, selectedStars, selectedAmenities]);

  const toggleFilterSection = (section: keyof typeof collapsedFilters) => {
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

  const loadMoreHotels = () => {
    setCurrentPage(prev => prev + 1);
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

  if (isLoading) {
    return (
      <div className="flex justify-center -mt-2 mb-4">
        <div className="border-x-2 border-b-2 border-blue-400 rounded-b-lg overflow-hidden max-w-md w-full">
          <Image
            src={gif}
            alt="Decorative animation"
            width={800}
            height={100}
            className="w-full h-auto object-cover"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>
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
      {/* Search Component */}
      <div className="search-header py-3 bg-light">
        <Container>
          <HotelSearchComponent 
            initialData={{
              locationId: locationId || '',
              locationType: locationType || '',
              locationName: locationName || '',
              checkIn: checkIn ? new Date(checkIn) : null,
              checkOut: checkOut ? new Date(checkOut) : null,
              adults: adults ? parseInt(adults) : 2,
              children: children ? parseInt(children) : 0
            }}
            compact={true}
            showTitle={false}
          />
        </Container>
      </div>

      <Container className="my-4">
        <Row>
          {/* Filters Sidebar */}
          <Col md={3} className="mb-4">
            <div className="filters-sidebar bg-white p-3 rounded shadow-sm sticky-top" style={{ top: '20px' }}>
              {/* Sort By Filter */}
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

              {/* Price Range Filter */}
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

              {/* Star Rating Filter */}
              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFilterSection('stars')}
                >
                  <h5 className="mb-0">Star Rating</h5>
                  {collapsedFilters.stars ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!collapsedFilters.stars && (
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

              {/* Amenities Filter */}
              <div className="filter-section">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleFilterSection('amenities')}
                >
                  <h5 className="mb-0">Amenities</h5>
                  {collapsedFilters.amenities ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!collapsedFilters.amenities && (
                  <div className="filter-options mt-2">
                    {['Pool', 'Wifi', 'Gym', 'Spa', 'Breakfast', 'Free Cancellation'].map(amenity => (
                      <div 
                        key={amenity}
                        className={`filter-option py-2 px-3 mb-1 rounded d-flex align-items-center ${selectedAmenities.includes(amenity) ? 'active' : ''}`}
                        onClick={() => toggleAmenitySelection(amenity)}
                      >
                        {amenity === 'Pool' && <FaSwimmingPool className="me-2" />}
                        {amenity === 'Wifi' && <FaWifi className="me-2" />}
                        {amenity === 'Gym' && <FaDumbbell className="me-2" />}
                        {amenity === 'Spa' && <FaSpa className="me-2" />}
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
                <div key={hotel.code} className="hotel-card-enhanced mb-4 bg-white rounded shadow-sm overflow-hidden">
                  <Row className="g-0">
                    {/* Image Slider Column */}
                    <Col md={4} className="pe-md-2">
                      <div className="hotel-image-container h-100 position-relative" style={{ minHeight: '200px' }}>
                        {hotel.images && hotel.images.length > 0 ? (
                          <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={hotel.images.length > 1}
                            className="h-100"
                          >
                            {hotel.images.map((image, index) => (
                              <SwiperSlide key={index}>
                                <div className="image-wrapper h-100 w-100 position-relative">
                                  <Image
                                    src={image.src}
                                    alt={`${hotel.name} - ${image.type}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index === 0}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : (
                          <div className="no-image-placeholder h-100 d-flex justify-content-center align-items-center bg-light">
                            <FiImage className="text-muted" size={48} />
                          </div>
                        )}
                        
                        {hotel.trending && (
                          <div className="trending-badge bg-primary text-white px-2 py-1 rounded d-flex align-items-center">
                            <FiTrendingUp className="me-1" /> Trending
                          </div>
                        )}
                        
                        <div className="rating-badge bg-white text-dark px-2 py-1 rounded d-flex align-items-center shadow-sm">
                          <FiStar className="text-warning me-1" />
                          {hotel.rating}
                        </div>
                      </div>
                    </Col>
                
                    {/* Details Column */}
                    <Col md={5} className="py-3 py-md-3">
                      <div className="hotel-details h-100 ps-md-3 d-flex flex-column">
                        <h3 className="hotel-name mb-2">
                         <a
  href="#"
  className="text-decoration-none current-price"
  onClick={(e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`hotel_${hotel.code}`, JSON.stringify({
        hotel,
        rooms: hotel.rooms,
        checkIn,
        checkOut, 
        occupancies: {
                       adults:adults,
                       children:children
        }
      }));
      setTimeout(() => {
        router.push(`/hotels/${hotel.code}`);
      }, 200);
    }
  }}
>
  {hotel.name}
</a>

                        </h3>
                        
                        <div className="hotel-location mb-2 d-flex align-items-center text-muted">
                          <FiMapPin className="me-1" />
                          <span>{hotel.zoneName}, {hotel.destinationName}</span>
                        </div>
                        
                        <div className="hotel-stars mb-2 d-flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`me-1 ${i < (hotel.stars || 0) ? 'text-warning' : 'text-secondary'}`} 
                            />
                          ))}
                        </div>
                        
                        <div className="hotel-amenities mb-3 d-flex flex-wrap gap-2">
                          {hotel.amenities?.slice(0, 4).map(amenity => (
                            <span key={amenity} className="amenity-badge bg-light text-dark px-2 py-1 rounded d-flex align-items-center">
                              {amenity === 'Pool' && <FaSwimmingPool className="me-1" />}
                              {amenity === 'Wifi' && <FaWifi className="me-1" />}
                              {amenity === 'Gym' && <FaDumbbell className="me-1" />}
                              {amenity === 'Spa' && <FaSpa className="me-1" />}
                              {amenity}
                            </span>
                          ))}
                        </div>
                        
                        {hotel.tags?.includes('Breakfast Included') && (
                          <div className="highlight-tag bg-light-success text-success px-2 py-1 rounded d-inline-flex align-items-center mb-1">
                            <FiCoffee className="me-1" /> Breakfast Included
                          </div>
                        )}
                        {hotel.tags?.includes('Free Cancellation') && (
                          <div className="highlight-tag bg-light-success text-success px-2 py-1 rounded d-inline-flex align-items-center">
                            <FiCheckCircle className="me-1" /> Free Cancellation
                          </div>
                        )}
                      </div>
                    </Col>
                
                    {/* Pricing Column */}
                    <Col md={3} className="py-3 py-md-3">
                      <div className="hotel-pricing h-100 d-flex flex-column justify-content-between">
                        <div className="price-section">
                          <div className="original-price d-flex align-items-center">
                            <span className="text-decoration-line-through text-muted me-2">
                              ${(parseFloat(hotel.minRate) * 1.2).toFixed(2)}
                            </span>
                            <span className="discount-badge bg-danger text-white px-1 rounded small">
                              20% OFF
                            </span>
                          </div>
                          <div className="current-price fw-bold fs-4 my-1">
                            ${hotel.minRate}
                          </div>
                          <div className="price-note text-muted small">
                            per night (incl. taxes)
                          </div>
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
                                occupancies: {
                                  adults:adults,
                                  children:children
                                }
                              }));
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
                  onClick={loadMoreHotels}
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