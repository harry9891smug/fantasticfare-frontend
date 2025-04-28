
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Head from "next/head";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/package_details.css";
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/articledetails.css"
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";


interface Packages {
  _id: string;
  package_name: string;
  package_image: string[];
  package_heading: string;
  from_country: string;
  to_country: string;
  total_price: string;
  discounted_price: string;
  days?: string;
}
interface Package {
  _id: string;
  package_name: string;
  package_url: string;
  package_image: string[];
  package_heading: string;
  region: string;
  continent: string;
  country: string;
  total_price: string;
  discounted_price: string;
  itineraries: Array<{
    _id: string;
    package_id: string;
    days: Array<{
      day_name: string;
      day_description: string;
      day_images: string[];
      itenary_type: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  activities: Array<{
    _id: string;
    package_id: string;
    days: Array<{
      day_name: string;
      day_activities: string;
      activity_images: string[];
      activity_type: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  stays: Array<{
    _id: string;
    package_id: string;
    days: Array<{
      hotel_name: string;
      hotel_description: string;
      hotel_images: string[];
      stay_type: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  inclusion?: Array<{
    type: string;
    description: string[];
  }>;
  faq: Array<{
    _id: string;
    package_id: string;
    questions: Array<{
      question: string;
      answer: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  meta_name: string;
  meta_description: string;
  status: number;
  country_name:{
    name:string,
  };
  created_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface CountryOption {
  value: string;
  label: string;
}
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  country_code: yup.string().required("Country code is required"),
  mobile_number: yup
    .string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  travel_date: yup.string().required("Travel date is required"),
  traveller_count: yup
    .number()
    .min(1, "Minimum 1 traveller")
    .required("Traveller count is required"),
  message: yup.string().required("Message is required"),
});

const PackageDetails: React.FC = () => {
  const params = useParams();
  const { id } = params;

  const [packages, setPackages] = useState<Packages[]>([]);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const {
    register,
    handleSubmit,control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const fetchPackages = async (country) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/list-package?country=${country}`);
      if (!response.ok) throw new Error("Failed to fetch packages.");

      const data = await response.json();
      if (data.status && data.data) {
        setPackages(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/package_view/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch package");
        }
        const data = await response.json();
        if (data.status && data.data) {
          setPackageData(data.data);
          if (data.data.itineraries && data.data.itineraries.length > 0 && data.data.itineraries[0].days.length > 0) {
            setExpandedDay(data.data.itineraries[0].days[0].day_name);
          }
        }
        fetchPackages(data?.data?.country);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  const toggleAccordion = (dayName: string) => {
    setExpandedDay(expandedDay === dayName ? null : dayName);
  };
 useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/country-code");
        const data = await res.json();
        if (data.status && Array.isArray(data.countryCodes)) {
          const formatted = data.countryCodes.map((code: string) => ({
            value: code,
            label: code,
          }));
          setCountryOptions(formatted);
        }
      } catch (err) {
        console.error("Error fetching country codes:", err);
        toast.error("Failed to load country codes");
      }
    };

    fetchCountryCodes();
  }, []);
  const onSubmit = async (data: any) => {
    setFormSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/package-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          package_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      toast.success("Enquiry submitted successfully!");
      reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit enquiry"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading package details...</div>;
  }

  if (error) {
    return <div className="container py-5 text-center text-danger">Error: {error}</div>;
  }

  if (!packageData) {
    return <div className="container py-5 text-center">Package not found</div>;
  }

  const inclusions = packageData?.inclusion
    ?.find(item => item.type === "inclusion")
    ?.description || [];

  const exclusions = packageData?.inclusion
    ?.find(item => item.type === "exclusion")
    ?.description || [];
  return (
    <>
      <Head>
        <title>{packageData.package_name} | Package Details</title>
        <meta name="description" content={packageData.package_heading} />
      </Head>

      <ToastContainer position="top-right" autoClose={5000} />
      <div className="paris-package">
        <div className="package-image">
        <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{ delay: 2500 }}
          >
            {Array.isArray(packageData.package_image) && 
              packageData.package_image.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image 
                    src={img}
                    alt={`Package image ${index + 1}`}
                    width={400}
                    height={250}
                    className="card-img-top"
                    style={{ objectFit: "cover" }}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="package-details">
          <h2 className="package-title">{packageData.package_name}</h2>
          <div className="package-duration">
            <span>{packageData.itineraries?.[0]?.days?.length || 0}N/{(packageData.itineraries?.[0]?.days?.length || 0) - 1}D</span>
          </div>
          <div className="package-inclusions">
            <div className="inclusion">
              <Image src="/images/images/car.svg" alt="Transfer" width={20} height={20} />
              <span>Transfer Included</span>
            </div>
            <div className="inclusion">
              <Image src="/images/images/home.svg" alt="Stay" width={20} height={20} />
              <span>Stay Included</span>
            </div>
            <div className="inclusion">
              <Image src="/images/images/hot-air-balloon.svg" alt="Sightseeing" width={20} height={20} />
              <span>Sightseeing Included</span>
            </div>
          </div>
          <div className="package-price-container">
            <div className="package-price">
              <div className="offered-price">USD {packageData.discounted_price || packageData.total_price}</div>
              {packageData.discounted_price && (
                <>
                  <div className="original-price">
                    <div className="cross">USD {packageData.total_price}</div>
                  </div>
                </>
              )}
              <div className="enquire-btn">
                <button>Enquire Now</button>
              </div>
            </div>
            <div className="rating">
              <span>4.6</span> (890)
            </div>
          </div>
        </div>
      </div>

      <div className="container-2">
        <div className="first-column">
          <div className="itenary-activity">
            <div className="background">
              <div
                className={`tab ${activeTab === "itinerary" ? "active" : ""}`}
                onClick={() => setActiveTab("itinerary")}
              >
                <Image src="/images/images/place-marker0.png" alt="Activities" width={20} height={20} />
                <div>Itinerary</div>
              </div>
              <div
                className={`tab ${activeTab === "activities" ? "active" : ""}`}
                onClick={() => setActiveTab("activities")}
              >
                <Image src="/images/images/bulb.png" alt="Activities" width={20} height={20} />
                <div>Activities</div>
              </div>
              <div
                className={`tab ${activeTab === "stay" ? "active" : ""}`}
                onClick={() => setActiveTab("stay")}
              >
                <Image src="/images/images/clip-path-group0.svg" alt="Stay" width={20} height={20} />
                <div>Stay</div>
              </div>
            </div>

            {/* Itinerary Tab */}
            <div id="itinerary" className={`tab-content ${activeTab === "itinerary" ? "active" : ""}`}>
              {packageData.itineraries?.[0]?.days?.length > 0 ? (
                <>
                  {/* Carousel Slider */}
                  <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                      {packageData.itineraries[0].days.map((_, index) => (
                        <li
                          key={index}
                          data-target="#carouselExampleIndicators"
                          data-slide-to={index}
                          className={index === 0 ? "active" : ""}
                        ></li>
                      ))}
                    </ol>
                    <div className="carousel-inner">
                      {packageData.itineraries[0].days.map((day, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                          {day.day_images?.length > 0 ? (
                            <Image
                              className="d-block w-100"
                              src={day.day_images[0]}
                              alt={`Day ${index + 1}`}
                              width={800}
                              height={400}
                            />
                          ) : (
                            <div className="d-block w-100 placeholder-image">
                              No image available
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <a
                      className="carousel-control-prev"
                      href="#carouselExampleIndicators"
                      role="button"
                      data-slide="prev"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="sr-only">Previous</span>
                    </a>
                    <a
                      className="carousel-control-next"
                      href="#carouselExampleIndicators"
                      role="button"
                      data-slide="next"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="sr-only">Next</span>
                    </a>
                  </div>

                  {/* Accordions */}
      
<div className="accordions">
  {packageData.itineraries[0].days.map((day, index) => (
    <div className={`accordion ${expandedDay === day.day_name ? 'active' : ''}`} key={index}>
      <button
        className="accordion-button"
        onClick={() => toggleAccordion(day.day_name)}
        aria-expanded={expandedDay === day.day_name}
      >
        <span className="day-title">{day.day_name}</span>
        <span className="accordion-tab-title">Itinerary Details</span>
        <span className={`accordion-arrow ${expandedDay === day.day_name ? 'expanded' : ''}`}>
          {expandedDay === day.day_name ? '▼' : '►'}
        </span>
      </button>
      <div
        className={`accordion-content ${expandedDay === day.day_name ? 'expanded' : ''}`}
        style={{
          display: expandedDay === day.day_name ? 'block' : 'none'
        }}
      >
        {/* Rest of your accordion content remains the same */}
        {day.day_images?.length > 0 && (
          <div className="image-row">
            {day.day_images.slice(0, 3).map((img, imgIndex) => (
              
              <Image
                key={imgIndex}
                src={img}
                alt={`${day.day_name} Image ${imgIndex + 1}`}
                width={200}
                height={150}
              />
            ))}
          </div>
        )}
        <div className="day-title-section">
          <div className="day-capsule">{day.day_name}</div>
          <h3 className="accordion-title">Itinerary Details</h3>
        </div>
        <div className="content">
          <p>{day.day_description}</p>
        </div>
      </div>
    </div>
  ))}
</div>
                </>
              ) : (
                <p>No itinerary available for this package.</p>
              )}
            </div>

            {/* Activities Tab */}
            <div id="activities" className={`tab-content ${activeTab === "activities" ? "active" : ""}`}>
              {packageData.activities?.length > 0 ? (
                packageData.activities.map((activityGroup, groupIndex) => (
                  <div key={groupIndex}>
                    {activityGroup.days.map((day, dayIndex) => (
                      <div className="activity-item" key={dayIndex}>
                        <h3>{day.day_name}</h3>
                        <p>{day.day_activities}</p>
                        {day.activity_images?.length > 0 && (
                          <div className="image-row">
                            {day.activity_images.map((img, imgIndex) => (
                              <Image
                                key={imgIndex}
                                src={img}
                                alt={`Activity ${dayIndex + 1} Image ${imgIndex + 1}`}
                                width={200}
                                height={150}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No activities available for this package.</p>
              )}
            </div>

            {/* Stay Tab */}
            <div id="stay" className={`tab-content ${activeTab === "stay" ? "active" : ""}`}>
              {packageData.stays?.length > 0 ? (
                packageData.stays.map((stayGroup, groupIndex) => (
                  <div key={groupIndex}>
                    {stayGroup.days.map((day, dayIndex) => (
                      <div className="itinerary-card" key={dayIndex}>
                        <div className="day-header">
                          <span className="day-badge">DAY {dayIndex + 1}</span>
                          <h3>{day.hotel_name}</h3>
                        </div>
                        <p>{day.hotel_description}</p>
                        <div className="checkin-info">
                          <div>
                            Check-in <br /> <strong>10:00 AM</strong>
                          </div>
                          <div>
                            Check-out <br /> <strong>10:00 AM</strong>
                          </div>
                        </div>
                        {day.hotel_images?.length > 0 && (
                          <div className="image-row">
                            {day.hotel_images.slice(0, 2).map((img, imgIndex) => (
                              <div className="image-container" key={imgIndex}>
                                <Image
                                  src={img}
                                  alt={`${day.hotel_name} Image ${imgIndex + 1}`}
                                  width={300}
                                  height={200}
                                />
                                <p className="hotel-info">{day.hotel_name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="inclusions">
                          <strong>Inclusions:</strong>
                          <ul>
                            <li>Breakfast & Dinner</li>
                            <li>Luxury Stay</li>
                            <li>Local Sightseeing</li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No stay information available for this package.</p>
              )}
            </div>
          </div>
        </div>

        {/* Second Column: Enquiry Form */}
        <div className="tour-package">
          {/* Price Section */}
          <div className="price-section">
            <h2 className="package-title">{packageData.package_name}</h2>
            <div className="price-details">
              <span className="current-price">USD {packageData.discounted_price || packageData.total_price}</span>
              {packageData.discounted_price && (
                <>
                  <span className="original-price">USD {packageData.total_price}</span>
                  <div className="save-badge">
                    <span className="save-text">SAVE</span>
                    <span className="save-percent">
                      Upto {Math.round((parseFloat(packageData.total_price) - parseFloat(packageData.discounted_price)) / parseFloat(packageData.total_price) * 100)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="enquiry-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input 
                type="text" 
                id="full-name" 
                placeholder="Enter your full name" 
                {...register("first_name")}
                className={errors.first_name ? "error" : ""}
              />
              {errors.first_name && (
                <p className="error-message">{errors.first_name.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                id="last-name" 
                placeholder="Enter your last name" 
                {...register("last_name")}
                className={errors.last_name ? "error" : ""}
              />
              {errors.last_name && (
                <p className="error-message">{errors.last_name.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                {...register("email")}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>
            
            <div className="form-group phone-group">
              <div className="phone-input">
              <Controller
  name="country_code"
  control={control}
  rules={{ required: "Country code is required" }}
  render={({ field }) => (
    <Select
      {...field}
      options={countryOptions}
      placeholder="+91"
      classNamePrefix="react-select"
      className={`${errors.country_code ? "is-invalid" : ""}`}
      value={countryOptions.find((option) => option.value === field.value)}
      onChange={(selectedOption) => field.onChange(selectedOption?.value)}
      styles={{
        control: (base, state) => ({
          ...base,
          width: "90px",        // Set width here
          height: "35px",        // Set height here
          borderColor: errors.country_code ? "#dc3545" : "#ced4da",
          minHeight: "40px",     // Makes sure height isn't overridden
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  )}
/>

            {errors.country_code && (
              <div className="invalid-feedback d-block">
                {errors.country_code.message}
              </div>
            )}
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  {...register("mobile_number")}
                  className={errors.mobile_number ? "error" : ""}
                />
              </div>
              {errors.mobile_number && (
                <p className="error-message">{errors.mobile_number.message}</p>
              )}
            </div>
            
            <div className="form-group date-traveller-group">
              <div className="form-group">
                <input 
                  type="date" 
                  id="travel-date" 
                  {...register("travel_date")}
                  className={errors.travel_date ? "error" : ""}
                />
                {errors.travel_date && (
                  <p className="error-message">{errors.travel_date.message}</p>
                )}
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  id="traveller-count" 
                  placeholder="Number of travellers" 
                  {...register("traveller_count")}
                  className={errors.traveller_count ? "error" : ""}
                  min="1"
                />
                {errors.traveller_count && (
                  <p className="error-message">{errors.traveller_count.message}</p>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <textarea 
                id="message" 
                placeholder="Enter your message..." 
                {...register("message")}
                className={errors.message ? "error" : ""}
              ></textarea>
              {errors.message && (
                <p className="error-message">{errors.message.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        </div>
        </div>
      </div>

      <div className="package-section">
        <div className="package-header">{`What's inside the package?`}</div>

        <div className="package-content">
          {/* Inclusions */}
          <div className="package-column inclusions">
            <h3>Inclusions</h3>
            <ul className="package-list">
              {inclusions.map((item, index) => (
                <li key={index}>
                  <Image src="/images/images/check.svg" alt="✔" width={16} height={16} />
                  {item.trim()}
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="package-column exclusions">
            <h3>Exclusions</h3>
            <ul className="package-list">
              {exclusions.map((item, index) => (
                <li key={index}>
                  <Image src="/images/images/cross.svg" alt="✘" width={16} height={16} />
                  {item.trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container-1">
        <h1 style={{ marginTop: "28px" }}>Hidden Gems In {packageData.country_name.name}</h1>
        <div className="cards">
          {[1, 2, 3].map((item) => (
            <div className="card" key={item}>
              <div className="sainte-chapelle">
                <Image
                  className="mask-group"
                  src="/images/images/cardimage.svg"
                  alt="Hidden Gem"
                  width={300}
                  height={200}
                />
                <div className="heading-2-dubai">Hidden Gem {item}</div>
                <div className="comp-text">
                  Discover amazing places in {packageData.country_name.name}
                  <br />
                  {`that most tourists don't know about`}
                </div>
                <div className="link">
                  <Image
                    className="component-1"
                    src="/images/images/call.svg"
                    alt="Call Icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="background-border">
                  <div className="request-callback">Request Callback</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PackageDetails;