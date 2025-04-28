import React from "react";
import styles from './myaccount.module.css';
import support from '../../assets/images/support.svg';
import accounts from '../../assets/images/account.svg';
import setting from '../../assets/images/settings.svg';
import coupon from '../../assets/images/coupons.svg';
import booking from '../../assets/images/event.svg';
import communications from '../../assets/images/Letter.svg';
import userIcon from "../../assets/images/male-user0.png";
import logoutIcon from "../../assets/images/logout.svg";
import Image from "next/image";

interface SidebarProps {
  onSelect: (section: string) => void;
  user: {
    name: string;
    email: string;
    mobile_number: string;
    profileImage?: string;
  } | null;
  setUser: (user: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          <Image src={user?.profileImage || userIcon} alt="User Profile" className="userIcon" width={60} height={60} />
        </div>
        <div className={styles.profileInfo}>
          <h4>{user?.name || "John Doe"}</h4>
          <p>{user?.email || "johndoe@example.com"}</p>
        </div>
      </div>

      <ul className={styles.sidebarLinks}>
        <li onClick={() => onSelect("profile")} className={styles.sidebarItem}>
          <Image src={accounts} alt="Profile" className={styles.sidebarIcon} />
          My Profile
        </li>
        <li onClick={() => onSelect("bookings")} className={styles.sidebarItem}>
          <Image src={booking} alt="Bookings" className={styles.sidebarIcon} />
          My Bookings
        </li>
        <li onClick={() => onSelect("communications")} className={styles.sidebarItem}>
          <Image src={communications} alt="Communications" className={styles.sidebarIcon} />
          Communications
        </li>
        <li onClick={() => onSelect("coupons")} className={styles.sidebarItem}>
          <Image src={coupon} alt="Coupons" className={styles.sidebarIcon} />
          Coupons
        </li>
        <li onClick={() => onSelect("security")} className={styles.sidebarItem}>
          <Image src={setting} alt="Security" className={styles.sidebarIcon} />
          Security & Settings
        </li>
        <li onClick={() => onSelect("support")} className={styles.sidebarItem}>
          <Image src={support} alt="Support" className={styles.sidebarIcon} />
          Support & FAQ
        </li>
        <li onClick={handleLogout} className={styles.logoutBtn}>
          <Image src={logoutIcon} alt="Logout" className="logoutIcon" width={20} height={20} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
