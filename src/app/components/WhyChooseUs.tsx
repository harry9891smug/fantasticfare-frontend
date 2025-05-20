'use client';
import Image from 'next/image';
import Happy from "../assets/images/Happy.svg"; 
import rating from "../assets/images/star-filled.svg";
import voucher from "../assets/images/voucher.svg"; 
import support from "../assets/images/online-support.svg"; 
import devider from "../assets/images/devider.svg"; 

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us">
      <Image
        src={devider}
        alt="Divider"
        width={1920}
        height={50}
        className="divider-image divider-top"
      />

      <h2>Why Choose Fantastic Fare</h2>
      <p>
        Choose Fantastic Fare for <strong>UNBEATABLE DEALS</strong> on{' '}
        <strong>Flights, Hotels</strong>, and <strong>Tour Packages</strong>. Experience
        seamless travel planning.
      </p>

      <div className="features">
        {/* Feature 1 */}
        <div className="feature">
          <div className="icon-wrapper icon-rating">
            <Image src={rating} alt="Rating" width={48} height={48} />
          </div>
          <h3>Rating</h3>
          <p>
            Trusted, <strong>Top-Rated</strong> Travel Partner
          </p>
        </div>

        <div className="divider"></div>

        {/* Feature 2 */}
        <div className="feature">
          <div className="icon-wrapper icon-customers">
            <Image src={Happy} alt="Happy Customers" width={48} height={48} />
          </div>
          <h3>Happy Customers</h3>
          <p>
            Trusted by <strong>Happy Travelers</strong> Worldwide
          </p>
        </div>

        <div className="divider"></div>

        {/* Feature 3 */}
        <div className="feature">
          <div className="icon-wrapper icon-offers">
            <Image src={voucher} alt="Premium Offers" width={48} height={48} />
          </div>
          <h3>Premium Offers</h3>
          <p>
            <strong>Premium Offers</strong> for Smarter Travel
          </p>
        </div>

        <div className="divider"></div>

        {/* Feature 4 */}
        <div className="feature">
          <div className="icon-wrapper icon-support">
            <Image
              src={support}
              alt="24/7 Support"
              width={48}
              height={48}
            />
          </div>
          <h3>24/7 Support</h3>
          <p>
            Non-Stop Support for <strong>Worry-Free Travel</strong>
          </p>
        </div>
      </div>

      <Image
        src={devider}
        alt="Divider"
        width={1920}
        height={50}
        className="divider-image divider-bottom"
      />
    </div>
  );
};

export default WhyChooseUs;
