import React, { useState } from "react";
import axios from "axios";
import styles from './AuthPopup.module.css';
import OtpVerification from './OtpVerification';
interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSelected, setIsEmailSelected] = useState(true);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const body: any = {};
    if (isEmailSelected) {
      body.email = emailOrPhone;
    } else {
      body.phone = emailOrPhone;
      body.country_code = countryCode;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, body);
      setSuccess("Reset instructions sent successfully.");
      setUserEmail(emailOrPhone); 
      setShowOtpVerification(true); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
if (showOtpVerification) {
    return (
      <OtpVerification 
        email={userEmail}
        onBack={() => setShowOtpVerification(false)}
        onVerify={(otp) => {
          // Handle OTP verification
          console.log("Verifying OTP:", otp);
          // Add your OTP verification API call here
        }}
        onResend={() => {
          // Handle resend logic
          return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resend-otp`, { 
            email: userEmail 
          });
        }}
      />
    );
  }
  return (
    <div className={styles.forgotPasswordContainer}>
      <h2 className={styles.forgotTitle}>Forgot Password?</h2>
      <p className={styles.forgotSubtitle}>No worries, {`we'll`} send you reset instructions.</p>

      <div className={styles.tabSelector}>
        <button
          className={`${styles.tabButton} ${isEmailSelected ? styles.activeTab : ''}`}
          onClick={() => setIsEmailSelected(true)}
        >
          Continue with Email
        </button>
        <button
          className={`${styles.tabButton} ${!isEmailSelected ? styles.activeTab : ''}`}
          onClick={() => setIsEmailSelected(false)}
        >
          Continue with Phone
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        {isEmailSelected ? (
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
        ) : (
          <div className={styles.phoneContainerN}>
            <input
              type="text"
              className={styles.countryCodeN}
              value={countryCode}
              required
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <input
              type="tel"
              className={styles.phoneNumberN}
              placeholder="1234567890"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
        )}

        {error && <p className={styles.topError}>{error}</p>}
        {success && <p className={styles.successText}>{success}</p>}

        <button type="submit" className={styles.authButton} disabled={loading}>
          {loading ? "Sending..." : "Continue"}
        </button>

        <button type="button" onClick={onBack} className={styles.backLink}>
          ← Back to login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;