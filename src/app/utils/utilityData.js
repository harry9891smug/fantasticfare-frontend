import Img1 from "../assets/images/destinations/1.svg";
import Img2 from "../assets/images/destinations/2.svg";
import Img3 from "../assets/images/destinations/4.svg";
import Img4 from "../assets/images/destinations/4.svg";
import Img5 from "../assets/images/destinations/5.svg";
import Img6 from "../assets/images/destinations/3.svg";

export const priceDislayInComma = function (price) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
};

export const cabinOptions = [
  { value: "Economy", label: "Economy" },
  { value: "Premium economy", label: "Premium economy" },
  { value: "Business class", label: "Business class" },
  { value: "First class", label: "First class" },
];

export const nearByFlights = [
  {
    id: 1,
    img: Img1,
    title: "Miami to San Juan",
    dates: "Apr 5 - Apr 12 . Round-trip",
  },
  {
    id: 2,
    img: Img2,
    title: "Miami to Santo Domingo",
    dates: "Apr 5 - Apr 12 . Round-trip",
  },
  {
    id: 3,
    img: Img3,
    title: "Miami to Punta Cana",
    dates: "Apr 5 - Apr 12 . Round-trip",
  },
  {
    id: 4,
    img: Img4,
    title: "Miami to cancun",
    dates: "Apr 5 - Apr 12 . Round-trip",
  },
  {
    id: 5,
    img: Img5,
    title: "Miami to ",
    dates: "Apr 5 - Apr 12 . Round-trip",
  },
  {
    id: 6,
    img: Img6,
    title: "Miami to ",
    dates: "Apr 5 - Apr 12 . Round-trip",
  },
];

export const trendingCities = [
  {
    id: 8,
    img: Img1,
    title: "Miami",
    description: "The Magic City",
  },
  {
    id: 9,
    img: Img2,
    title: "New York",
    description: "The Big Apple",
  },
  {
    id: 10,
    img: Img3,
    title: "Los Angeles",
    description: "City of Angels",
  },
  {
    id: 11,
    img: Img4,
    title: "Chicago",
    description: "The Windy City",
  },
  {
    id: 12,
    img: Img5,
    title: "San Francisco",
    description: "The Golden City",
  },
];

export const topFlights = [
  { id: 1, departure: "Miami", arrival: "Orlando", imgs: Img6 },
  { id: 2, departure: "New York", arrival: "Miami", imgs: Img5 },
  { id: 3, departure: "Mexico City", arrival: "Chicago", imgs: Img4 },
  { id: 4, departure: "Dallas", arrival: "Las Vegas", imgs: Img3 },
  { id: 5, departure: "Miami", arrival: "Los Angeles", imgs: Img2 },
  { id: 6, departure: "Las Vegas", arrival: "Los Angeles", imgs: Img1 },
  { id: 7, departure: "Los Angeles", arrival: "New York", imgs: Img5 },
  { id: 8, departure: "Las Vegas", arrival: "Orlando", imgs: Img2 },
  { id: 9, departure: "Miami", arrival: "Washington, D.C.", imgs: Img6 },
];

export const faqList = [
  {
    id: 1,
    question:
      "Which are the lowest fare months to travel from the USA to India?",
    ans: "The cheapest months to purchase flights from the USA to India are usually February, March, and September. During peak holiday periods such as December and July when school holidays and festive periods result in high demand, prices tend to increase. Planning ahead and booking 2-3 months prior, and departing on mid-week days, can also increase your possibilities of getting lower-priced tickets.",
  },
  {
    id: 2,
    question: "Can I make round-trip and one-way flight reservations?",
    ans: "Yes, FantasticFare has round-trip and one-way flight reservation capabilities. Our system automatically displays to you the most cost-effective option for your dates.",
  },
  {
    id: 3,
    question: "Can I book last-minute flights to India?",
    ans: "Yes, FantasticFare.com has last-minute flights to India. Though higher prices are charged nearer the departure time, sometimes airlines publish lowered fares to occupy seats left empty. We suggest you monitor our website frequently or call our customer service to obtain the latest deals.",
  },
  {
    id: 4,
    question: "What is the best time to book cheap flights?",
    ans: "In general, making reservations 6-8 weeks ahead of time for domestic flights and 2-3 months ahead of time for international flights provides the most affordable rates. Tuesday and Wednesday flights tend to be less expensive.",
  },
  {
    id: 5,
    question: "What should I do if my flight is delayed or canceled?",
    ans: "In the event of a delay or cancellation, the airline will provide information on rebooking options or refunds. It's advisable to check the airline's policy and contact their customer service for assistance.",
  },
  {
    id: 6,
    question: "Is it safe to book flights online with FantasticFare?",
    ans: "Absolutely! We use industry-standard SSL encryption and secure payment gateways. Your personal and financial information is fully protected.",
  },
  {
    id: 7,
    question: "Are there student discounts on flights to India?",
    ans: "Yes, several airlines provide international student discounts. The discounts can range from lowered fares to free extra baggage allowance or changeable ticketing policies. In order to benefit from these schemes, students are usually required to submit proper identification, like a student visa or university identity card.",
  },
  {
    id: 8,
    question: "Does Fantastic Fare offer discounted flights?",
    ans: "Absolutely. We specialize in affordable international and domestic fares, providing exclusive discounts on flights to popular destinations like India, Europe, Southeast Asia, and more. Keep an eye out for our seasonal promotions and flash sales.",
  },
  {
    id: 9,
    question: "How long in advance should I check in for my flight to India?",
    ans: "<strong>For flights to India :</strong><br><strong>Online Check-in:</strong> 24 to 48 hours prior to flight departure.<br><strong>Airport Check-in:</strong> Suggested at least 3 hours before departure.",
  },
  {
    id: 10,
    question:
      "Is it cheaper to book flights directly with airlines or through travel agencies?",
    ans: "Prices can vary between airlines and travel agencies. Travel agencies like Fantastic Fare often have access to exclusive deals and bundled packages that may not be available directly through airlines. It's advisable to compare prices across platforms to find the best deal.",
  },
  {
    id: 11,
    question: "Can I book flights for tonight or today?",
    ans: 'Yes! FantasticFare has same-day and last-minute flight bookings. Take advantage of our "Today" or "Tomorrow" quick search to fulfill immediate travel requirements.',
  },
  {
    id: 12,
    question: "How do I contact Fantastic Fare customer support?",
    ans: 'Our customer support team is available 24/7 to assist you. You can reach us via the "Contact Us" page on our website, where you\'ll find options for live chat, email, and phone support.',
  },
];

export const metaData = [
  {
    id: 1,
    title: "Top Cities",
    destinations:
      "Hotels in Thailand, Hotels In Goa, Hotels In Mumbai, Hotels In Mahabaleshwar, Hotels In Matheran, Hotels In Lonavala, Hotels In Delhi, Hotels In Shimla, Hotels In Lansdowne, Hotels In Digha, Hotels In Puri, Hotels In Nainital, Hotels In Shirdi, Hotels In Bangalore, Hotels In Mussoorie, Hotels In Manali, Hotels Near Me, Cheap Hotels, Hotels In Jaipur, Hotels In Udaipur, Hotels In Pune, Hotels In Pondicherry, Hotels In Ooty, Hotels In Kodaikanal, Hotels In Darjeeling, Hotels In Chandigarh, Hotels In Mount abu, Hotels In Ahmedabad, Hotels In Kolkata, Hotels In Ranthambore, Jaisalmer Hotels, Mysore Hotels",
  },
  {
    id: 2,
    title: "States of India",
    destinations:
      "Hotels in Kerala, Hotels in Punjab, Hotels in Gujarat, Hotels in Andhra Pradesh, Hotels in Arunachal Pradesh, Hotels in Assam, Hotels in Bihar, Hotels in Chhattisgarh, Hotels in Haryana, Hotels in Himachal Pradesh, Hotels in Jharkhand, Hotels in Karnataka, Hotels in Ladakh, Hotels in Madhya Pradesh, Hotels in Maharashtra, Hotels in Manipur, Hotels in Meghalaya, Hotels in Mizoram, Hotels in Nagaland, Hotels in Odisha, Hotels in Telangana, Hotels in Tripura, Hotels in Rajasthan, Hotels in Tamil Nadu, Hotels in Uttar Pradesh, Hotels in Uttarakhand, Hotels in West Bengal",
  },
  {
    id: 3,
    title: "Top Properties",
    destinations:
      "W Goa, The Leela Goa, The Tamara Coorg, Evolve Back Coorg, Grand Hyatt Goa, Taj Lake Palace Udaipur, The Leela Palace Udaipur, Grand Hyatt Mumbai, Jw Marriott Chandigarh, Alila Diwa Goa, Evolve Back Hampi, Evolve Back Kabini, Hyatt Regency Mumbai, Le Meridien Delhi, Itc Grand Chola Chennai, Rambagh Palace Jaipur, Le Meridien Goa, Taj Lands End Mumbai, Jai Mahal Palace Jaipur, Vythiri Resort Wayanad, Red Earth Kabini, Taj Mahal Tower Mumbai, The Serai Bandipur, Wildflower Hall Shimla, Azaya Beach Resort Goa, Four Seasons Hotel Mumbai, Taj Fort Aguada Resort & Spa Goa, Itc Maratha Mumbai, Park Hyatt Chennai, Sea Shell Havelock, Spice Tree Munnar, ITC Grand Bharat, St Regis In Mumbai, Chennai Leela Palace, Hyatt Regency Delhi, Hyatt Grand Mumbai, Goa Radisson Blu, Fariyas Hotel, ITC Gardenia Bengaluru, Kumarakom Lake Resort, Taj Delhi Hotel, Surajkund Vivanta, JW Marriott Banglore, Alila Diwa Goa, Westin Goa, Trident Hotel Udaipur, Ritz Carlton Bangalore, Taj Hotel Lucknow, Leela In Kovalam, Trident Hotel Jaipur",
  },
  {
    id: 4,
    title: "Corporate Travel",
    destinations:
      "Business Travel, Corporate Travel, Corporate Travel Management, Corporate Travel Solution, Corporate Hotel Booking, Corporate Flight Booking, Expense Management, Corporate Expense Management, GST on Hotel Rooms, GST on Flight Tickets, Business Travel for SME, GST on International Flight Tickets, GST on Bus Tickets, GST on Train Tickets, T&E (Travel & Expense), myBiz - Best Business Travel Platform, GST Invoice for Corporate Travel, myBiz for Small Business, Free cancellation on International Flights",
  },
  {
    id: 5,
    title: "Top Homestay Cities",
    destinations:
      "Homestays In Chikmagalur, Homestays In Coorg, Homestays In Sakleshpur, Homestays In Goa, Homestays In Ooty, Homestays In Darjeeling, Homestays In Manali, Homestays In Munnar, Homestays In Wayanad, Homestays In Bengaluru, Homestays In Kasauli, Homestays In Kodaikanal, Homestays In Shimla, Homestays In Mysore, Homestays In Dandeli, Homestays In Dehradun, Homestays In Gokarna, Homestays In Mussoorie, Homestays In Nainital, Homestays In Rishikesh, Homestays In Vagamon, Homestays In Alibaug, Homestays In Kalimpong, Homestays In Mangalore, Homestays In Pondicherry, Homestays In Yercaud, Homestays In Coonoor, Homestays In Kabini, Homestays In Kasol, Homestays In Kurseong, Homestays In Mukteshwar",
  },
  {
    id: 6,
    title: "Trending Resort Cities",
    destinations:
      "Mahabaleshwar Resorts, Resorts In Agra, Resorts In Bhimtal, Resorts In Bordi, GraResorts In Br Hills, Resorts In Chikmagalur, Resorts In Cochin, Resorts In Darjeeling, Resorts In Dehradun, Resorts In Dharamshala, Resorts In Gorai, Resorts In Jaipur, Resorts In Jaisalmer, Resorts In Jodhpur, Resorts In Kanakapura, Resorts In Kollam, Resorts In Kotagiri, Resorts In Lucknow, Resorts In Madikeri, Resorts In Mahabaleshwar, Resorts In Masinagudi, Resorts In Matheran, Resorts In Mount Abu, Resorts In Mumbai, Resorts In Munnar, Resorts In Mussoorie, Resorts In Mysore, Resorts In Nainital, Resorts In Neemrana, Resorts In Kodaikanal",
  },
];
