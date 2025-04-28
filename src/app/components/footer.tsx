import React from "react";
import Link from "next/link";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/footer.css"; // Your custom CSS

import logo from "../assets/images/logo.png";
import fbIcon from "../assets/images/fb.svg";
import twitterIcon from "../assets/images/twitter.svg";
import instaIcon from "../assets/images/insta.svg";
import ytIcon from "../assets/images/yt.svg";
import img101 from "../assets/images/img101.png";
import thailand from "../assets/images/thailand.png";
import ladakh from "../assets/images/ladakh.png";
import hongkong from "../assets/images/hongkong.png";
import dubai from "../assets/images/dubai.png";
import singapore from "../assets/images/singapore.png";
import andaman from "../assets/images/andaman.png";
import bali from "../assets/images/bali.png";

const Footer: React.FC = () => {
  return (
    <section className="footer-section">
      <div className="footer-background">
        <div className="shadow-container">
          <div className="background-border-shadow">
            <div className="menus">
              <div className="links menu-links">
                <h4>About Fantasticfare</h4>
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/about-us">About</Link>
                  </li>
                  <li>
                    <Link href="/services">Services</Link>
                  </li>
                  <li>
                    <Link href="/contact-us">Contact</Link>
                  </li>
                </ul>
              </div>

              <div className="partition"></div>

              <div className="links quick-links">
                <h4>Quick Links</h4>
                <ul>
                  <li>
                    <Link href="/tips-and-article">Tips & Articles</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="social-media">
              <ul>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Image src={fbIcon} alt="Facebook" width={30} height={30} />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Image src={twitterIcon} alt="Twitter" width={30} height={30} />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Image src={instaIcon} alt="Instagram" width={30} height={30} />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Image src={ytIcon} alt="YouTube" width={30} height={30} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="background-border-shadow-1">
            <div className="gallery">
              {[{ src: img101, title: "Sri Lanka" },
                { src: thailand, title: "Thailand" },
                { src: ladakh, title: "Ladakh" },
                { src: hongkong, title: "Hong Kong" },
                { src: dubai, title: "Dubai" },
                { src: singapore, title: "Singapore" },
                { src: andaman, title: "Andaman" },
                { src: bali, title: "Bali" },
                { src: dubai, title: "Dubai" }].map((item, index) => (
                <div className="gallery-item" key={index}>
                  <Image src={item.src} alt={item.title} width={100} height={100} />
                  <div className="image-title">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-logo-copyright">
          <div className="footer-logo">
            <Image src={logo} alt="Logo" width={150} height={50} />
          </div>
          <div className="footer-copyright">
            <p>
              The content and images on this website are protected by copyright, with
              all rights belonging to their respective owners. They are used solely to
              promote their works, <br /> with no intent to imply endorsement of the
              artists. Any unauthorized use is strictly prohibited and may result in
              legal action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
