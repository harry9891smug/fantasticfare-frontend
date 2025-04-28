import React from "react";
import Link from "next/link"; // ✅ Fixed Link Import
import Image from "next/image"; // ✅ Using Next.js Image Optimization
import home from "../assets/images/home.png";
//import about from "../assets/images/about.png";
// import flights from "../assets/images/flight.png";
import hotels from "../assets/images/hotels.png";
import packages from "../assets/images/packages.png";
import "../assets/css/sub-header.css"; // ✅ Ensure Correct Path

const SubHeader = () => {
  return (
    <nav className="sub-header sticky-top">
      <div className="container">
        <ul>
          <li>
            <Link href="/" className="flex items-center gap-2">
              <Image src={home} alt="Home" width={20} height={20} />
              <span>Home</span>
            </Link>
          </li>
          {/* <li>
            <Link href="/about-us">
              <Image src={about} alt="About Us" width={20} height={20} />
              About Us
            </Link>
          </li> */}
          {/* <li>
            <Link href="/flights">
              <Image src={flights} alt="Flights" width={20} height={20} />
              Flights
            </Link>
          </li> */}
          <li>
          <Link href="/hotels" className="flex items-center gap-2">
            <Image src={hotels} alt="Hotels" width={20} height={20} />
            <span>Hotels</span>
          </Link>

          </li>
          <li>
            <Link href="/packages" className="flex items-center gap-2">
              <Image src={packages} alt="Packages" width={20} height={20} />
              <span>Packages</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default SubHeader;