import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/lax.css';
import Image from 'next/image';
import devider from '../assets/images/lax-icons/line.png';
import pop from '../assets/images/lax-icons/akasa.png';
import icon1 from '../assets/images/lax-icons/cheap-month.png';
import icon2 from '../assets/images/lax-icons/cheap-price.png';
import icon3 from '../assets/images/lax-icons/avg-time.png';
import icon4 from '../assets/images/lax-icons/pop-airline.png';
import WhyChooseUs from '../components/WhyChooseUs';
import Accordion from 'react-bootstrap/Accordion';
import AccordionItem from 'react-bootstrap/AccordionItem';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import AccordionBody from 'react-bootstrap/AccordionBody';
import { Button } from "react-bootstrap";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const Page = () => {
    const faqs = [
    "What is the cheapest flight from LAX to India?",
    "Are there non-stop flights from LAX to India?",
    "How long is the flight from Los Angeles to India?",
    "What’s the best time to fly from LAX to India?",
    "Which Indian cities can I fly to from Los Angeles?",
    "Is Paris safe for tourists?",
    "What are the best restaurants or places to try authentic French cuisine?",
  ];
  const flightCard = (
    <div className="flight-card p-4 border rounded d-flex justify-content-between align-items-center mb-3">
     <div className="position-relative me-4">
  {/* Logo and Name (positioned above LAX) */}
  <div className="airline-meta position-absolute top-0 start-0 d-flex align-items-center gap-1">
    <Image src={pop} alt="Airline Logo" className="airline-icon" />
    <p className="airline-name mb-0">Akasa Air</p>
  </div>

  {/* LAX & City */}
  <div className="pt-2 mt-2">
    <p className="airport-code mb-0">LAX</p>
    <p className="airport-city mb-0">Los Angeles</p>
  </div>
</div>




      <div className="pt-2 mt-2 text-center route-divider">
        <p className="mb-1 route-class">Economy</p>
        <Image src={devider} alt="Divider" className="divider-img mb-1" />
        <p className="mb-0 route-date">15 days from today's date</p>
      </div>
<div className="d-flex align-items-center">
       
        <div className="pt-2 mt-2 text-center">
          <p className="airport-code mb-0">DEL</p>
          <p className="airport-city mb-0">Delhi</p>
        </div>
      </div>
      <div className="text-end">
        <button className="viewButton btn btn-primary btn-sm">View Price</button>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
        <h2 className="fw-bold mb-3">Los Angeles to India</h2>
      <p className="text-muted mb-4">
        From festivals to family time — make your India trip happen!! Book USA to Delhi flights starting from just ($666) and enjoy exclusive MTI discounts over & above.</p>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="tab-heading">
            <button className="btn active-tab">One Way</button>
          </div>
          {Array(4).fill(flightCard)}
        </div>

        <div className="col-md-6">
          <div className="tab-heading">
            <button className="btn active-tab">Round Trip</button>
          </div>
          {Array(4).fill(flightCard)}
        </div>
      </div>
     <div className="text-section text-start mb-5">
        <h2 className="fw-bold">Cheap Flights from Los Angeles (LAX) to India – Book Now from $379*</h2>
        <h4 className="text-muted">Fly from Los Angeles to India – Best Airfare Deals</h4>
        <p className="text-muted">
          Looking for affordable <strong>flights from Los Angeles to India</strong>? You’re in the right place! At Fantastic Fare, we specialize in unbeatable airfare deals for travelers flying from LAX to top Indian cities like <strong>Delhi, Mumbai, Bangalore</strong>, and more. Whether you're booking a <strong>last-minute flight</strong>, a <strong>business class ticket</strong>, or a <strong>non-stop journey</strong>, we’ve got you covered with fares as low as <strong>$379 one-way</strong> and <strong>$649 round trip</strong>.
        </p>
      </div>

      <div className="row text-center mb-5">
        <div className="col-md-3 col-6 mb-3">
          <div className="border p-3 h-100">
            <Image src={icon1} alt="Price Icon" className="mb-2" width={40} height={40} />
            <p className="mb-1 fst-italic">Cheapest Flight Price</p>
            <p className="text-primary fw-bold">$666* <small className="text-muted">Round-Trip</small></p>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="border p-3 h-100">
            <Image src={icon2} alt="Calendar Icon" className="mb-2" width={40} height={40} />
            <p className="mb-1 fst-italic">Cheapest Month</p>
            <p className="text-primary fw-bold">September*</p>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="border p-3 h-100">
            <Image src={icon3} alt="Clock Icon" className="mb-2" width={40} height={40} />
            <p className="mb-1 fst-italic">Average Flight Time</p>
            <p className="text-primary fw-bold">18 Hrs-40 Mins</p>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="border p-3 h-100">
            <Image src={icon4} alt="Plane Icon" className="mb-2" width={40} height={40} />
            <p className="mb-1 fst-italic">Popular Airline</p>
            <p className="text-primary fw-bold">United Airlines</p>
          </div>
        </div>
      </div>
       {/* Additional Details Section */}
      <div className="additional-info-section text-start">
        <h5 className="fw-bold">Popular Routes from LAX to India</h5>
        <ul className="info-list">
          <li><strong>Los Angeles to Delhi Flights</strong> – Find cheap deals with top airlines</li>
          <li><strong>LAX to Mumbai Flights</strong> – Great fares and flexible schedules</li>
          <li><strong>Non-stop Flights from LAX to India</strong> – Available on selected airlines</li>
          <li><strong>LAX to Bangalore, Hyderabad & Chennai</strong> – Connect easily with the best layovers</li>
        </ul>

        <h5 className="fw-bold mt-4">Which Airlines Fly from Los Angeles to India?</h5>
        <p className="text-muted">Looking for the best airlines from LAX to India? Here are the top carriers trusted by travelers:</p>
        <ul className="info-list">
          <li><strong>Air India</strong> – Direct flights to Delhi</li>
          <li><strong>Qatar Airways</strong> – Premium comfort & smooth connections</li>
          <li><strong>Emirates</strong> – Award-winning service via Dubai</li>
          <li><strong>Lufthansa</strong> – Fast connections via Frankfurt</li>
          <li><strong>Singapore Airlines</strong> – Exceptional service to major Indian cities</li>
        </ul>

        <h5 className="fw-bold mt-4  pb-2">Flight Duration & Non-stop Options</h5>
        <ul className="info-list ">
          <li><strong>Non-stop flight time from LAX to India:</strong> ~16–17 hours (to Delhi)</li>
          <li><strong>Total travel time (1-stop):</strong> ~20–24 hours depending on layover</li>
          <li><strong>Best time to book:</strong> 4–6 weeks in advance for lowest fares</li>
        </ul>

        <h5 className="fw-bold mt-4">Why Book LAX to India Flights with Fantastic Fare?</h5>
        <ul className="info-list">
          <li>One-Way Fares from Just $379*</li>
          <li>Round Trips as Low as $649*</li>
          <li>24/7 Travel Expert Support</li>
          <li>Exclusive Business Class Offers</li>
          <li>Quick Comparison for Over 30 Airlines</li>
          <li>Last-Minute Deals Available Daily</li>
        </ul>
      </div>
      <WhyChooseUs/>
       <div className="container py-5">
      {/* FAQ Section */}
      <h2 className="fw-bold text-center mb-4">Frequently Asked Question</h2>
      <div className="row">
        <div className="col-md-8">
       <Accordion defaultActiveKey="0">
  {faqs.map((question, index) => (
    <AccordionItem eventKey={index.toString()} key={index} className="mb-3">
      <AccordionHeader>
        <span className="faq-number me-2">{index + 1}</span>
        {question}
      </AccordionHeader>
      <AccordionBody>
        Answer content goes here for: {question}
      </AccordionBody>
    </AccordionItem>
  ))}
</Accordion>


        </div>
        <div className="col-md-4">
           <div
            className="d-flex flex-column justify-content-evenly py-4 px-3"
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
            <Button className="btn-orange"  size="lg">
              Further Question
            </Button>
          </div>
        </div>
      </div>
    </div>
    {/* Footer Content Section */}
<div className="container py-5 footer-links">
  <h6 className="fw-bold">Fantastic Fare</h6>
  <p className="text-muted">About Us, Investor Relations, Careers, Sustainability, MMT Foundation, Legal Notices, CSR Policy, myPartner - Travel Agent Portal, List your hotel</p>

  <h6 className="fw-bold mt-4">About the Site</h6>
  <p className="text-muted">Customer Support, MMT Black Loyalty Program, Payment Security, Privacy Policy, Cookie Policy, User Agreement, Terms of Service, Franchise Offices</p>

  <h6 className="fw-bold mt-4">States of India</h6>
  <p className="text-muted">Hotels in Kerala, Hotels in Punjab, Hotels in Gujarat, Hotels in Andhra Pradesh, Hotels in Arunachal Pradesh, Hotels in Assam, Hotels in Bihar, Hotels in Chhattisgarh, Hotels in Haryana, Hotels in Himachal Pradesh, Hotels in Jharkhand, Hotels in Karnataka, Hotels in Ladakh, Hotels in Madhya Pradesh, Hotels in Maharashtra, Hotels in Manipur, Hotels in Meghalaya, Hotels in Mizoram, Hotels in Nagaland, Hotels in Odisha, Hotels in Telangana, Hotels in Tripura, Hotels in Rajasthan, Hotels in Tamil Nadu, Hotels in Uttar Pradesh, Hotels in Uttarakhand, Hotels in West Bengal</p>
  <h6 className="fw-bold mt-4">Top Properties</h6>
  <p className="text-muted">W Goa, The Leela Goa, The Tamara Coorg, Evolve Back Coorg, Grand Hyatt Goa, Taj Lake Palace Udaipur, The Leela Palace Udaipur, Grand Hyatt Mumbai, Jw Marriott Chandigarh, Alila Diwa Goa, Evolve Back Hampi, Evolve Back Kabini, Hyatt Regency Mumbai, Le Meridien Delhi, Itc Grand Chola Chennai, Rambagh Palace Jaipur, Le Meridien Goa, Taj Lands End Mumbai, Jai Mahal Palace Jaipur, Vythiri Resort Wayanad, Red Earth Kabini, Taj Mahal Tower Mumbai, The Serai Bandipur, Wildflower Hall Shimla, Azaya Beach Resort Goa, Four Seasons Hotel Mumbai, Taj Fort Aguada Resort & Spa Goa, Itc Maratha Mumbai, Park Hyatt Chennai, Sea Shell Havelock, Spice Tree Munnar, ITC Grand Bharat, St Regis In Mumbai, Chennai Leela Palace, Hyatt Regency Delhi, Hyatt Grand Mumbai, Goa Radisson Blu, Fariyas Hotel, ITC Gardenia Bengaluru, Kumarakom Lake Resort, Taj Delhi Hotel, Surajkund Vivanta, JW Marriott Banglore, Alila Diwa Goa, Westin Goa, Trident Hotel Udaipur, Ritz Carlton Bangalore, Taj Hotel Lucknow, Leela In Kovalam, Trident Hotel Jaipur</p>
  <h6 className="fw-bold mt-4">Corporate Travel</h6>
  <p className="text-muted">Business Travel, Corporate Travel, Corporate Travel Management, Corporate Travel Solution, Corporate Hotel Booking, Corporate Flight Booking, Expense Management, Corporate Expense Management, GST on Hotel Rooms, GST on Flight Tickets, Business Travel for SME, GST on International Flight Tickets​, GST on Bus Tickets, GST on Train Tickets, T&E (Travel & Expense), myBiz - Best Business Travel Platform, GST Invoice for Corporate Travel, myBiz for Small Business, Free cancellation on International Flights</p>
  <h6 className="fw-bold mt-4">Top Homestay Cities</h6>
  <p className="text-muted">HHomestays In Chikmagalur, Homestays In Coorg, Homestays In Sakleshpur, Homestays In Goa, Homestays In Ooty, Homestays In Darjeeling, Homestays In Manali, Homestays In Munnar, Homestays In Wayanad, Homestays In Bengaluru, Homestays In Kasauli, Homestays In Kodaikanal, Homestays In Shimla, Homestays In Mysore, Homestays In Dandeli, Homestays In Dehradun, Homestays In Gokarna, Homestays In Mussoorie, Homestays In Nainital, Homestays In Rishikesh, Homestays In Vagamon, Homestays In Alibaug, Homestays In Kalimpong, Homestays In Mangalore, Homestays In Pondicherry, Homestays In Yercaud, Homestays In Coonoor, Homestays In Kabini, Homestays In Kasol, Homestays In Kurseong, Homestays In Mukteshwar</p>
  <h6 className="fw-bold mt-4">Trending Resort Cities</h6>
  <p className="text-muted">RMahabaleshwar Resorts, Resorts In Agra, Resorts In Bhimtal, Resorts In Bordi, GraResorts In Br Hills, Resorts In Chikmagalur, Resorts In Cochin, Resorts In Darjeeling, Resorts In Dehradun, Resorts In Dharamshala, Resorts In Gorai, Resorts In Jaipur, Resorts In Jaisalmer, Resorts In Jodhpur, Resorts In Kanakapura, Resorts In Kollam, Resorts In Kotagiri, Resorts In Lucknow, Resorts In Madikeri, Resorts In Mahabaleshwar, Resorts In Masinagudi, Resorts In Matheran, Resorts In Mount Abu, Resorts In Mumbai, Resorts In Munnar, Resorts In Mussoorie, Resorts In Mysore, Resorts In Nainital, Resorts In Neemrana, Resorts In Kodaikanal</p></div>



    </div>
  );
};

export default Page;
