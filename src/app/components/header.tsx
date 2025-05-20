"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/header.css";
import logo from "../assets/images/logo.png";
import userIcon from "../assets/images/account.svg";
import loginIcon from "../assets/images/login.png";
import logoutIcon from "../assets/images/logout.svg";
import bell from "../assets/images/bell.png";
import SubHeader from "./sub-header";
import AuthPopup from "./apppopup";
import { FaPhoneAlt } from "react-icons/fa";
const Header: React.FC = () => {
  const [user, setUser] = useState<{ name: string; profileImage?: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min").catch((err) =>
        console.error("Failed to load Bootstrap JS:", err)
      );
    }
  }, []);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }, []);

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <Image src={logo} alt="Fantastic Fare Logo" width={170} height={50} priority />
          </Link>

         
          <div className="floating-call-button">
  <a href="tel:+18334227770" aria-label="Call Us">
  <FaPhoneAlt />
  <span className="tooltip-text">Call Us</span>
  </a>
</div>
          <button
            className="navbar-custom"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            onClick={handleNavToggle}
          >
            <span className="navbar-toggler-iconct"></span>
          </button>

          <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
            <div className="d-flex flex-grow-1 align-items-center flex-lg-row">
              <form className="form-inline d-flex align-items-center flex-column my-lg-0 w-100 mx-lg-3">
                <div className="search-box">
                  <input type="text" placeholder="Search Country" />
                </div>
              </form>


              {user ? (
                <div className="userMenu" onMouseEnter={() => setShowDropdown(true)}>
                  <span className="greeting">Hi, {user.name.split(" ")[0]}</span>
                
                  <button className="notificationBtn">
                    <Image src={bell} alt="Notifications" width={16} height={16} />
                  </button>
                
                  <div className="profileActions">
                    <div
                      className="profileWrapper"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <Link href="/myaccount">
                        <Image
                          src={user.profileImage || userIcon}
                          alt="User Profile"
                          width={40}
                          height={40}
                          className="userIcon"
                        />
                      </Link>
                
                      {showDropdown && (
                      <div className="dropdownMenu" 
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}>
                        <button className="logoutBtn" onClick={handleLogout}>
                          Logout
                          <Image src={logoutIcon} alt="Logout" width={20} height={20} />
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  href="#"
                  className="sign-in-box"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPopup(true);
                  }}
                >
                  <Image src={loginIcon} alt="User Icon" width={20} height={20} />
                  <span className="btn">Sign In</span>
                </a>
              )}
            </div>
          </div>
          {showPopup && <AuthPopup onClose={() => setShowPopup(false)} />}
        </div>
      </nav>

      <SubHeader />
    </>
  );
};

export default Header;
