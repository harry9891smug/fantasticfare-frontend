import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import styles from './AuthPopup.module.css';

interface SetNewPasswordProps {
  email: string;
  token: string; // Add token prop
  onBack: () => void;
  onSuccess?: () => void; // Optional success callback
}

const SetNewPassword: React.FC<SetNewPasswordProps> = ({ 
  email, 
  token,
  onBack,
  onSuccess
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call the update-password endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/update-password`,
        {
          token: token, // Use the token passed from parent
          password: password
        }
      );

      if (response.data.success) {
        setSuccess("Password updated successfully!");
        if (onSuccess) onSuccess(); // Call success callback if provided
        
        // Optionally redirect after delay
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to update password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.setPasswordContainer}>
      <h2 className={styles.setPasswordTitle}>Set New Password</h2>
      <p className={styles.passwordRequirement}>Must be at least 8 letters</p>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <FaLock className={styles.inputIcon} />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className={styles.inputGroup}>
          <FaLock className={styles.inputIcon} />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {error && <p className={styles.topError}>{error}</p>}
        {success && <p className={styles.successText}>{success}</p>}

        <button 
          type="submit" 
          className={styles.authButtonReset} 
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default SetNewPassword;