import React, { useEffect, useState } from "react";
import Sidebar from "./myaccount/sidebar";
import MyProfile from "./myaccount/myprofile";
import MyBookings from "./myaccount/mybookings";
import Communications from "./myaccount/communications";
import Coupons from "./myaccount/coupons";
import SecuritySettings from "./myaccount/securitysettings";
import SupportFAQ from "./myaccount/supportfaq";
import styles from './myaccount/myaccount.module.css';

interface User {
  name: string;
  email: string;
  mobile_number: string;
  profileImage?: string;
}

const MyAccount: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const userWithImage = {
          ...parsedUser,
          profileImage: parsedUser.profileImage || "/default-profile.png",
        };
        setUser(userWithImage);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  const renderSection = () => {
    switch (selectedSection) {
      case "profile": return <MyProfile />;
      case "bookings": return <MyBookings />;
      case "communications": return <Communications />;
      case "coupons": return <Coupons />;
      case "security": return <SecuritySettings />;
      case "support": return <SupportFAQ />;
      default: return <MyProfile />;
    }
  };

  return (
    <div className={styles.myAccountContainer}>
      <Sidebar onSelect={setSelectedSection} user={user} setUser={setUser} />
      <div className={styles.content}>
        {renderSection()}
      </div>
    </div>
  );
};

export default MyAccount;
