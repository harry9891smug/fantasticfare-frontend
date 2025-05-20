import "../assets/css/countries.css"
const countries = [
    "Italy Tour", "France Tour", "Switzerland Tour", "Spain Tour",
    "Netherlands Tour", "Greece Tour", "Germany Tour", "Portugal Tour",
    "Japan Tour", "South Korea Tour", "Thailand Tour", "Malaysia Tour",
    "United States Tour", "Canada Tour", "Brazil Tour", "Australia Tour"
  ];
  
  const TourSection = () => {
    return (
      <div className="tour-section">
        <div className="tour-content">
          <h2 className="tour-title"> Fantastic Fare’s Exclusive Travel Deals!</h2>
          <p className="tour-subtitle">Top Europe Destinations</p>
  
          {/* Scrollable country list */}
          <div className="tour-list-container">
            <div className="tour-list">
              {countries.map((country, index) => (
                <a key={index} href={`/tours/${country.replace(/\s+/g, "-").toLowerCase()}`}>
                  {country}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TourSection;
  