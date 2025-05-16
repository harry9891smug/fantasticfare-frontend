import React from "react";
import Link from "next/link";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/footer.css"; // Your custom CSS

import logo from "../assets/images/logo.png";
import fbIcon from "../assets/images/fb.svg";
import xIcon from "../assets/images/x.svg";
import instaIcon from "../assets/images/insta.svg";
import ytIcon from "../assets/images/yt.svg";
import thailand from "../assets/images/footer_images/thailand.png";
import ladakh from "../assets/images/footer_images/ladakh.png";
import hongkong from "../assets/images/footer_images/hongkong.png";
import dubai from "../assets/images/footer_images/dubai.png";
import singapore from "../assets/images/footer_images/singapore.png";
import andaman from "../assets/images/footer_images/andaman.png";
import bali from "../assets/images/footer_images/bali.png";
import NewYork from "../assets/images/footer_images/new-york.png";
import SriLanka from "../assets/images/footer_images/sri-lanka.png";


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
                  {/* <li>
                    <Link href="/faq">FAQ</Link>
                  </li> */}
                  <li>
                    <Link href="/disclaimer">Disclaimer</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">Privacy-policy</Link>
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
                  <a href="https://www.facebook.com/fantasticfare" target="_blank" rel="noopener noreferrer">
                    <Image src={fbIcon} alt="Facebook" width={30} height={30} />
                  </a>
                </li>
                <li>
                  <a href="https://x.com/fantasticfare" target="_blank" rel="noopener noreferrer">
                  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.033 0C7.169 0 0 7.169 0 16.033C0 24.897 7.169 32.066 16.033 32.066C24.897 32.066 32.066 24.897 32.066 16.033C32.001 7.169 24.832 0 16.033 0ZM24.5 8.5L18.5 16L24.5 23.5H21.5L16 17.5L10.5 23.5H7.5L13.5 16L7.5 8.5H10.5L16 14.5L21.5 8.5H24.5Z" fill="#B7B7B7"/>
</svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/fantasticfare/" target="_blank" rel="noopener noreferrer">
                    <Image src={instaIcon} alt="Instagram" width={30} height={30} />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@FantasticFare" target="_blank" rel="noopener noreferrer">
                    <Image src={ytIcon} alt="YouTube" width={30} height={30} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="background-border-shadow-1">
            <div className="gallery">
              {[{ src: SriLanka, title: "Sri Lanka" },
                { src: thailand, title: "Thailand" },
                { src: ladakh, title: "Ladakh" },
                { src: hongkong, title: "Hong Kong" },
                { src: dubai, title: "Dubai" },
                { src: singapore, title: "Singapore" },
                { src: andaman, title: "Andaman" },
                { src: bali, title: "Bali" },
                { src: NewYork, title: "New york" }].map((item, index) => (
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
