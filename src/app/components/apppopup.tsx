"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import styles from './AuthPopup.module.css'; 
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; 
import googleIcon from '../assets/images/gmail.svg';
import facebookIcon from '../assets/images/facebook.svg';
import appleIcon from '../assets/images/apple.svg';
//import bgImage from '../assets/images/bg.svg';
// import LeftImage from '../assets/images/left.svg';
// import RightImage from '../assets/images/right.svg';
import PlaneImage from '../assets/images/plane.svg';

interface AuthPopupProps {
    onClose: () => void;
    onSuccess: () => void; 
    error?: string | null;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ onClose,  onSuccess, error}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+91",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [topError, setTopError] = useState(""); // Top-level error message
    const [invalidFields, setInvalidFields] = useState<string[]>([]); // List of invalid fields

    const validateForm = () => {
        const { fullName, email, phone, password, confirmPassword } = formData;
        const newInvalidFields: string[] = [];

        // Full Name Validation
        if (!isLogin && fullName.trim() === "") {
            newInvalidFields.push("fullName");
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newInvalidFields.push("email");
        }

        // Password Validation
        if (password.length < 6) {
            newInvalidFields.push("password");
        }

        // Confirm Password Validation (Only for Sign-up)
        if (!isLogin && password !== confirmPassword) {
            newInvalidFields.push("confirmPassword");
        }

        // Phone Number Validation (Only for Sign-up)
        if (!isLogin && !/^\d{10}$/.test(phone)) {
            newInvalidFields.push("phone");
        }

        setInvalidFields(newInvalidFields);

        if (newInvalidFields.length > 0) {
            setTopError("Please fill in all required fields correctly.");
            return false;
        } else {
            setTopError("");
            return true;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTopError("");
        setSuccessMessage("");
    
        if (!validateForm()) {
          setLoading(false);
          return;
        }

        try {
           let response;
      if (isLogin) {
        response = await axios.post("http://localhost:8000/api/login", {
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await axios.post("http://localhost:8000/api/register", {
          name: formData.fullName,
          email: formData.email,
          mobile_number: formData.phone,
          password: formData.password,
        });
      }

            console.log("User data from response:", response);

            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      window.dispatchEvent(new Event("userUpdated"));
      setSuccessMessage(response.data.message);


            // Redirect to "My Account" page after 2 seconds
            setTimeout(() => {
                onSuccess(); // This will trigger the booking flow
                onClose();    // Close the popup
              }, 1000);
            } catch (err: any) {
              setTopError(
                err.response?.data?.errors?.[0]?.message || 
                err.response?.data?.message || 
                err.message || 
                "An unknown error occurred"
              );
            }
            setLoading(false);
          };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.authPopupOverlay}>
            <div className={styles.authPopupContainer}>
                {/* Left Section */}
                {/* <div className={`${styles.authPopupLeft} ${styles.leftTopImage}`} style={{ backgroundImage: `url(${bgImage})` }}>
                    <div className={styles.authPopupContent}>
                        <h2 className={styles.leftTitle}>Fantastic Fare</h2>
                        <p>Travel is the only purchase that enriches you in ways beyond material wealth.</p>
                    </div>
                </div> */}

                {/* Right Section - Form */}
                <div className={styles.authPopupRight}>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                    <Image src={PlaneImage} alt="Plane Icon" className={styles.authTopImage} />
                    <h3 className={isLogin ? styles.welcomeMargin : ''}>
                        {isLogin ? 'Welcome Back 👋' : 'Join Fantastic Fare!'}
                    </h3>
                    <p className={styles.greyText}>{isLogin ? 'Login with Email' : 'Sign up and let your travel dreams take flight'}</p>

                    {/* Top-Level Error Message */}
                    {topError && <p className={styles.topError}>{topError}</p>}

                    <form className={styles.authForm} onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className={`${styles.inputGroup} ${invalidFields.includes("fullName") ? styles.inputError : ""}`}>
                                <FaUser className={styles.inputIcon}  />
                                <input 
                                    type="text" 
                                    name="fullName"
                                    placeholder="Full Name" 
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                        )}

                        <div className={`${styles.inputGroup} ${invalidFields.includes("email") ? styles.inputError : ""}`}>
                            <FaEnvelope className={styles.inputIcon} />
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                value={formData.email}
                                onChange={handleChange}
                               
                            />
                        </div>

                        {!isLogin && (
                            <div className={styles.phoneContainer}>
                                <input 
                                    type="text" 
                                    className={`${styles.countryCode} ${invalidFields.includes("phone") ? styles.inputError : ""}`} 
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                    placeholder="+91" 
                                />
                                <input 
                                    type="text" 
                                    className={`${styles.phoneNumber} ${invalidFields.includes("phone") ? styles.inputError : ""}`}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number" 
                                />
                            </div>
                        )}

                        <div className={`${styles.inputGroup} ${invalidFields.includes("password") ? styles.inputError : ""}`}>
                            <FaLock className={styles.inputIcon} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleChange}
                               
                            />
                            {showPassword ? 
                                <FaEyeSlash className={styles.eyeIcon} onClick={() => setShowPassword(false)} /> : 
                                <FaEye className={styles.eyeIcon} onClick={() => setShowPassword(true)} />
                            }
                        </div>

                        {!isLogin && (
                            <div className={`${styles.inputGroup} ${invalidFields.includes("confirmPassword") ? styles.inputError : ""}`}>
                                <FaLock className={styles.inputIcon} />
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    placeholder="Confirm Password" 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                   
                                />
                            </div>
                        )}

                        {isLogin && <p className={styles.forgotPassword}>Forgot password?</p>}

                        <button type="submit" className={styles.authButton} disabled={loading}>
                            {loading ? "Processing..." : isLogin ? 'Login' : 'Sign Up'}
                        </button>

                        {isLogin && (
                            <div className={styles.divider}>
                                <span>or</span>
                            </div>
                        )}

                        {isLogin && (
                            <div className={styles.socialLogin}>
                                <Image src={googleIcon} alt="Google" />
                                <Image src={facebookIcon} alt="Facebook" />
                                <Image src={appleIcon} alt="Apple" />
                            </div>
                        )}
                    </form>

                    <p className={styles.toggleForm}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Login"}</span>
                    </p>

                    {/* Decorative Images */}
                    {/* <Image src={RightImage} className={`${styles.sideImage} ${styles.rightImage}`} alt="Right Decoration"/>
                    <Image src={LeftImage} className={`${styles.sideImage} ${styles.leftImage}`} alt="Left Decoration"/> */}
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;