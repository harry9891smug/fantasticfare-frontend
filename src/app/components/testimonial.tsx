import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import user1 from "../../app/assets/images/user.svg";
import cornerImage from "../../app/assets/images/revimg.svg";
import Image from "next/image";
import { useState } from "react";
import "../assets/css/testimonial.css"; // Ensure this path is correct

const reviews = [
  {
    id: 1,
    name: "Emmanuel Menyereye",
    image: user1,
    review:
      "I got an email regarding this flight deal. Then I made a phone call, which was received by Mr. Jack Wilson. He took time to explain everything to me before the booking of the flight. He helped me get the flight I wanted. The whole experience went fantastically.",
  },
  {
    id: 2,
    name: "Navneet Kallapalli",
    image: user1,
    review:
      "Kevin smith, the fantastic fare representative helped me a lot in booking my flight tickets and also clarified all my queries. Also got me the best price available for my desired dates. All and all, fast and reliable service. Loved it!!",
  },
  {
    id: 3,
    name: "Guru Abhay Magapu",
    image: user1,
    review:
      "I recently booked a flight through Fantastic Fare, and I had a great experience! I spoke with Abhishek Rana, who was incredibly helpful and patient throughout the entire process. He took the time to explain the various flight options available to me, making sure I got the best deal that suited my preferences. His professionalism and calm approach made the booking process smooth and stress-free. Highly recommend their service—thank you, Abhishek, and the Fantastic Fare team!",
  },
  {
    id: 4,
    name: "SN",
    image: user1,
    review:
      "Great experience and Shekhar was excellent and very patient with all our requirements for an itinerary with different stops and countries We have used FF for years now and will continue to in future Great job Team. Keep the good work. Thanks",
  },
  {
    id: 5,
    name: "Dave Ankita",
    image: user1,
    review:
      "Jack Wilson was great help. He helped me to choose the right flight according to my requirements. He spent a good time and answered all my questions patiently. You can definitely go ahead and use this sight for affordable flight booking.",
  },
];

const Testimonial = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="review-section">
      <Image
        src={cornerImage}
        alt="Decorative Corner"
        width={150}
        height={150}
        className="corner-image"
      />
      <div className="review-card">
        <FaChevronLeft
          className="nav-icon left-icon"
          onClick={handlePrev}
          size={24}
        />

        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
          style={{
            width: "80px",
            height: "80px",
            fontSize: "20px",
            marginBottom: "20px",
            backgroundColor: "#0089C6",
          }}
        >
          {(() => {
            const nameParts = reviews[index].name.trim().split(" ");
            const initials =
              nameParts.length >= 2
                ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
                : nameParts[0][0].toUpperCase();
            return initials;
          })()}
        </div>
        <p className="review-text">{reviews[index].review}</p>
        <h4 className="user-name">{reviews[index].name}</h4>

        <FaChevronRight
          className="nav-icon right-icon"
          onClick={handleNext}
          size={24}
        />
      </div>
    </div>
  );
};

export default Testimonial;
