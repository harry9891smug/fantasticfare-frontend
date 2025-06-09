import React, { useState } from "react";
import axios from "axios";
import styles from './AuthPopup.module.css';
import SetNewPassword from './SetNewPassword'; 
interface OtpVerificationProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void; // New prop for successful verification
  onResend: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ 
  email, 
  onBack, 
  onSuccess,
  onResend 
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const fullOtp = otp.join("");
  
  if (fullOtp.length !== 6) {
    setError("Please enter the 6-digit code");
    return;
  }

  setIsVerifying(true);
  setError("");

  try {
    const verifyResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/validate-otp`,
      { otp: fullOtp }
    );

    // Change this line to check 'status' instead of 'success'
    if (!verifyResponse.data.status) {  // ← Updated this line
      throw new Error(verifyResponse.data.message || "Invalid OTP");
    }

    setResetToken(verifyResponse.data.token);
    setShowSetNewPassword(true);
    onSuccess(); // Call the success handler if needed

  } catch (err: any) {
    // Improved error handling
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        "OTP verification failed";
    setError(errorMessage);
  } finally {
    setIsVerifying(false);
  }
};

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    try {
      await onResend();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };
 if (showSetNewPassword && resetToken) {
    return (
      <SetNewPassword 
        email={email}
        onBack={() => setShowSetNewPassword(false)}
        onSubmit={(newPassword) => {
          return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-password`, {
            token: resetToken,
            password: newPassword
          });
        }}
      />
    );
  }
  return (
    <div className={styles.otpContainer}>
      <h2 className={styles.otpTitle}>Password Recovery</h2>
      <p className={styles.otpSubtitle}>
        We sent a code to <span className={styles.otpEmail}>{email}</span>
      </p>

      <form onSubmit={handleSubmit} className={styles.otpForm}>
        <div className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className={styles.otpInput}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && <p className={styles.otpError}>{error}</p>}

        <p className={styles.otpResend}>
          {`Didn't`} receive the code?{" "}
          <button 
            type="button" 
            onClick={handleResend} 
            disabled={isResending}
            className={styles.resendButton}
          >
            {isResending ? "Sending..." : "Resend again"}
          </button>
        </p>

        <button 
          type="submit" 
          className={styles.otpButton} 
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </button>
      </form>

      <button type="button" onClick={onBack} className={styles.otpBackLink}>
        ← Back to login
      </button>
    </div>
  );
};

export default OtpVerification;