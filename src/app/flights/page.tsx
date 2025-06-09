"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Form, Button, InputGroup } from "react-bootstrap";
import gif from "../assets/images/app.gif";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUsers,
  FaExchangeAlt,
  FaAngleDown,
  FaPhone,
  FaChevronRight,
  FaChevronLeft,
  FaAngleUp,
} from "react-icons/fa";
import FlightSearchComponent from '../components/SharedFlightSearch';
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/flights.css";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Tab, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  nearByFlights,
  trendingCities,
  topFlights,
  faqList,
  metaData,
} from "../utils/utilityData";
import { Chip, Stack, Grid } from "@mui/material";
import Accordion from "react-bootstrap/Accordion";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface Travelers {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

interface DateItem {
  day: string;
  price: string;
}
interface FlightSegment {
  from: string;
  to: string;
  date: string;
}
interface AirportData {
  iata: string;
  city: string;
  country: string;
}
interface FormData {
  tripType: string;
  leavingFrom: string[];
  goingTo: string[];
  startDate: Date;
  returnDate: Date;
  mobile_number: string;
  email: string;
  travellers: Travelers;
  cabinClass: string;
}
const FlightSearch = () => {
  const [filtersOpen, setFiltersOpen] = useState({
    stops: true,
    departureTime: true,
    priceRange: true,
    airlines: true,
    tripDuration: true,
    departureAirport: true,
  });
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [tripType, setTripType] = useState<
    "one-way" | "round-trip" | "multi-city"
  >("round-trip");
  const [airportSuggestions, setAirportSuggestions] = useState<AirportData[]>(
    []
  );
  const [focusedField, setFocusedField] = useState<
    "leavingFrom" | "goingTo" | null
  >(null);
  const [formErrors, setFormErrors] = useState<FormData>({} as FormData);

  const cabinOptions = [
    { value: "Economy", label: "Economy" },
    { value: "Premium economy", label: "Premium economy" },
    { value: "Business class", label: "Business class" },
    { value: "First class", label: "First class" },
  ];
  const filtersRef = useRef<HTMLDivElement>(null);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [formData, setFormData] = useState<FormData>({
    travellers: travelers,
    cabinClass: "economy",
    tripType: "round-trip",
  } as FormData);
  const [sortDirection, setSortDirection] = useState("left");
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const dates: DateItem[] = [
    { day: "Tue, 11 Mar", price: "$4,708" },
    { day: "Wed, 12 Mar", price: "$4,029" },
    { day: "Thu, 13 Mar", price: "$4,114" },
    { day: "Fri, 14 Mar", price: "$4,325" },
    { day: "Sat, 15 Mar", price: "$4,114" },
    { day: "Sun, 16 Mar", price: "$4,325" },
    { day: "Mon, 17 Mar", price: "$4,399" },
  ];
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const toggleFilter = (filter: keyof typeof filtersOpen) => {
    setFiltersOpen((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      filtersRef.current &&
      !filtersRef.current.contains(event.target as Node)
    ) {
      setFiltersOpen({
        stops: false,
        departureTime: false,
        priceRange: false,
        airlines: false,
        tripDuration: false,
        departureAirport: false,
      });
    }
  };
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    { from: "", to: "", date: "" },
    { from: "", to: "", date: "" },
  ]);

  const addFlightSegment = () => {
    setFlightSegments([...flightSegments, { from: "", to: "", date: "" }]);
  };
  // Update flight segment
  const updateFlightSegment = (
    index: number,
    field: keyof FlightSegment,
    value: string
  ) => {
    const updatedSegments = [...flightSegments];
    updatedSegments[index] = { ...updatedSegments[index], [field]: value };
    setFlightSegments(updatedSegments);
  };

  // Remove flight segment
  const removeFlightSegment = (index: number) => {
    if (flightSegments.length > 1) {
      const updatedSegments = [...flightSegments];
      updatedSegments.splice(index, 1);
      setFlightSegments(updatedSegments);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTravelerChange = (type: keyof Travelers, increment: boolean) => {
    const updatedTravelers: Travelers = {
      ...travelers,
      [type]: Math.max(
        0,
        increment ? travelers[type] + 1 : travelers[type] - 1
      ),
    };
    setTravelers(updatedTravelers);
    setFormData((prev) => ({
      ...prev,
      travellers: updatedTravelers,
    }));
  };
  const handleAirportChange = async (
    e: React.ChangeEvent,
    type: "leavingFrom" | "goingTo"
  ) => {
    const value = e.target.value;
    setFocusedField(type);
    if (value.length < 3) {
      setAirportSuggestions([]);
      return;
    }
    try {
      console.log(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/airportSuggestions?area=${value}`
      );
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flights/airportSuggestions?area=${value}`
      );
      setAirportSuggestions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching airport suggestions:", error);
    }
  };
  const handleAirportSelect = (airport: string) => {
    if (focusedField === "leavingFrom") {
      document.querySelector<HTMLInputElement>(
        'input[name="leavingFrom"]'
      )!.value = airport;
    } else if (focusedField === "goingTo") {
      document.querySelector<HTMLInputElement>('input[name="goingTo"]')!.value =
        airport;
    }
    setFormData((prev) => ({
      ...prev,
      [focusedField!]: airport,
    }));

    setAirportSuggestions([]);
    setFocusedField(null);
  };

  const exchangeAreas = () => {
    setFormData((prev) => ({
      ...prev,
      leavingFrom: prev.goingTo,
      goingTo: prev.leavingFrom,
    }));
  };
  const submitForm = async () => {
    try {
      console.log(formData);
      if (!formData.email) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please Enter Email",
        }));
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flight-enquiry`,
        formData
      );

      console.log("Enquiry submitted:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

const handleClick = () => {
  console.log("You clicked the Chip.");
};


  return (
    <div className="container py-5">
     
<FlightSearchComponent 
  variant="full"
  onSearch={(formData) => {
    // Handle the search with your own logic
    console.log("Search data:", formData);
    // Or submit to your API
    axios.post('/your-api-endpoint', formData);
  }}
/>
    
      <div className="container ">
        <h2 className="fw-bold mt-5">Popular Flights near you</h2>
        <p className="text-muted  mb-4">
          Find deals on domestic and international flights
        </p>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Flight Tabs"
            >
              <Tab label="International" {...a11yProps(0)} />
              <Tab label="Domestic" {...a11yProps(0)} />
            </Tabs>
          </Box>
          <FlightsTabPanel value={value} index={0}>
            <Swiper
              className="flight-swiper"
              spaceBetween={10}
              breakpoints={{
                320: { slidesPerView: 2 }, // Minimum 2 slides on small screens
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {nearByFlights.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="flight-card-container">
                    <div className="flight-card">
                      <Image
                        className="flight-image "
                        src={item.img}
                        alt={item.title}
                      />
                    </div>
                    <h3 className="flight-title mt-3">{item.title}</h3>
                    <p className="flight-date">{item.dates}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </FlightsTabPanel>
          <FlightsTabPanel value={value} index={1}></FlightsTabPanel>
        </Box>
      </div>
      <div className="container">
        <h2 className="fw-bold mt-3">Trending Cities</h2>
        <p className="text-muted  mb-4">
          Book flight to a destination popular with travelers from the United
          States
        </p>
        <Swiper
          className="flight-swiper"
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 2 }, 
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {trendingCities.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flight-card-container">
                <div className="flight-card">
                  <Image
                    className="flight-image "
                    src={item.img}
                    alt={item.title}
                  />
                </div>
                <h3 className="flight-title mt-3">{item.title}</h3>
                <p className="flight-date">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container d-flex flex-column ">
        <h2 className="fw-bold mt-3">Top Flights from United States</h2>
        <p className="text-muted  mb-4">
          Explore destination you can reach from Unites States and start making
          new plans
        </p>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            label="Popular routes"
            variant="outlined"
            color="primary"
            onClick={handleClick}
          />
          <Chip label="Cities" variant="outlined" />
          <Chip label="Countries" variant="outlined" />
          <Chip label="Regions" variant="outlined" />
          <Chip label="Airports" variant="outlined" />
        </Stack>
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
            {topFlights.map((item) => (
              <Grid key={item.id} xs={2} sm={4} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  <Image
                    className="flight-image"
                    src={item.imgs}
                    alt={item.departure}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <h4 style={{ marginTop: "10px", fontSize: "14px" }}>
                    {item.departure} → {item.arrival}
                  </h4>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>

      <div className=" container mt-5">
        <h1 className="d-flex justify-content-center mt-5">
          Frequently Asked Question
        </h1>
        <div className="row mt-5">
          <div className="col-12 col-md-8">
            {faqList.map((faq, index) => (
              <Accordion key={index}>
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="count-badge bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center"
                        style={{
                          width: 30,
                          height: 30,
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.6rem",
                        }}
                      >
                        {index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>{faq.ans}</Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))}
          </div>
          <div
            className="col-12 col-md-4  d-flex flex-column justify-content-evenly py-4 px-3"
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "20%",
              }}
            >
              <ChatBubbleIcon style={{ fontSize: 40, color: "#212529" }} />
            </div>

            <h5 className="fw-bold">
              Anything Unclear about your trip or stay?
            </h5>
            <p className="text-body mb-4">
              Got any questions about your trip plan, stay or activities? Feel
              free to ask - we are here to help! Make your travel experience
              seamless and enjoyable.
            </p>
            <Button variant="primary" size="lg">
              Further Question
            </Button>
          </div>
        </div>
      <div className="flex justify-center -mt-2 mb-4">
     <div className="gif-container">
  <Image
    src={gif}
    alt="Decorative animation"
    width={800}
    height={100}
    className="w-full h-auto"
    style={{
      display: 'block',
      margin: '0 auto',
    }}
  />
</div>
      </div>

      <div className="container mt-5 d-flex flex-column align-items-center">
        {metaData.map((item, index) => (
          <div key={index}>
            <h6 className="fw-bold mt-2 mb-0">{item.title}</h6>
            <p className="text-dark" style={{ fontSize: "x-small" }}>
              {item.destinations}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function FlightsTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="flightTabpanel"
      hidden={value !== index}
      id={`flight-tabpanel-${index}`}
      aria-labelledby={`flight-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-arrow next`}
    style={{ ...style, right: "-15px", color: "black", top: "17px" }}
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-arrow prev`}
    style={{ ...style, left: "-15px", color: "black", top: "17px" }}
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
);


export default FlightSearch;
