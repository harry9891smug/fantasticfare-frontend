"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from "next/image";
import '../assets/css/about.css';

// Dynamically import icons to prevent SSR issues
const FaChevronLeft = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaChevronLeft),
  { ssr: false }
);

const FaChevronRight = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaChevronRight),
  { ssr: false }
);

// Import images
import bgImage from '../assets/images/bg-1.svg';
import circleImage from '../assets/images/bg2.svg';
import innerCircleImage from '../assets/images/banner-image.svg';
import visionIcon from "../assets/images/People.svg"; 
import missionIcon from "../assets/images/Goal.svg"; 
import teamworkIcon from "../assets/images/sight.svg"; 
import bali from "../assets/images/bali.svg"; 
import dubai from "../assets/images/dubai.svg"; 
import paris from "../assets/images/paris.svg"; 
import italy from "../assets/images/italy.svg"; 
import cornerImage from "../assets/images/revimg.svg";
import underLine from "../assets/images/Line-1.svg"; 
import user1 from "../assets/images/user.svg"; 

const reviews = [
  {
    id: 1,
    name: "John Doe",
    image: user1,
    review: "This was an amazing experience! Highly recommend for anyone looking to explore new places.",
  },
  {
    id: 2,
    name: "Emma Smith",
    image: user1,
    review: "A breathtaking journey with top-notch service. I loved every moment of the trip!",
  },
  {
    id: 3,
    name: "Michael Johnson",
    image: user1,
    review: "Best sightseeing tour ever! Everything was well organized, and the guides were fantastic.",
  },
];

const AboutUs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (!isMounted) {
    return null; // Return null during SSR
  }

  return (
    <div className="container about-us-section">
      <div className="row align-items-center">
        {/* Left Column */}
        <div className="col-md-6">
          <h2 className="about-title">Discover the Best Sightseeing Tours for an Unforgettable Experience</h2>
          <p className="about-description">
            Explore breathtaking destinations, iconic landmarks, and hidden gems with our expertly curated sightseeing tours. Whether you seek adventure, culture, or relaxation.
          </p>
          <button className="btn btn-primary about-button">View Packages</button>
        </div>

        {/* Right Column */}
        <div className="col-md-6">
          <div className="image-stack">
            {/* Background Image - Now using CSS class instead of inline style */}
            <div className="background-image"></div>

            {/* Circle Image */}
            <div className="circle-image">
              <Image
                src={circleImage}
                alt="Circle Image"
                width={400}
                height={400}
                className="inner-circle-image"
              />

              {/* Inner Circle Image */}
              <div className="inner-circle">
                <Image
                  src={innerCircleImage}
                  alt="Inner Circle Image"
                  width={200}
                  height={200}
                  className="inner-circle-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Boxes Section */}
      <div className="row text-center mt-5">
        <div className="col-md-4">
          <div className="info-box">
            <Image src={visionIcon} alt="Vision Icon" width={60} height={60} className="info-icon" />
            <h3>Great Teamwork</h3>
            <p>Great teamwork drives success through collaboration, trust, and clear communication, leading to efficiency and innovation.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="info-box">
            <Image src={teamworkIcon} alt="Teamwork Icon" width={60} height={60} className="info-icon" />
            <h3>Our Vision</h3>
            <p>To inspire and connect travelers with unforgettable experiences by providing seamless, immersive, and high-quality tours that create lasting memories.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="info-box">
            <Image src={missionIcon} alt="Mission Icon" width={60} height={60} className="info-icon" />
            <h3>Our Mission</h3>
            <p>To deliver exceptional travel experiences by offering curated tours, seamless planning, and outstanding customer service, ensuring every journey is memorable and hassle-free.</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="content-wrapper">
          <h1 className="content-title">Let's Make Your</h1>
          <h1 className="content-title">Next Holiday Amazing</h1>
          <Image 
            src={underLine} 
            alt="Underline" 
            width={200}
            height={20}
            className="underline-image" 
          />
        </div>
      </div>

      {/* Unforgettable Moments Section */}
      <div className="unforgettable-section">
        <h2 className="section-title">Unforgettable Moments</h2>
        <div className="image-grid">
          <div className="large-image">
            <Image 
              src={bali} 
              alt="Bali" 
              width={600}
              height={800}
            />
          </div>

          <div className="right-column">
            <div className="top-full-width">
              <Image 
                src={dubai} 
                alt="Dubai" 
                width={600}
                height={400}
              />
            </div>
            
            <div className="bottom-two">
              <Image 
                src={paris} 
                alt="Paris" 
                width={300}
                height={400}
              />
              <Image 
                src={italy} 
                alt="Italy" 
                width={300}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
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

          <Image 
            src={reviews[index].image} 
            alt={reviews[index].name} 
            width={80}
            height={80}
            className="user-image" 
          />
          <p className="review-text">{reviews[index].review}</p>
          <h4 className="user-name">{reviews[index].name}</h4>

          <FaChevronRight 
            className="nav-icon right-icon" 
            onClick={handleNext} 
            size={24}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;