import React, { useState, ChangeEvent } from "react";
import styles from "./myaccount.module.css";

const MyProfile = () => {
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "John Doe",
        gender: "Male",
        dob: "1990-01-01",
        bio: "Web developer with 10 years of experience.",
        email: "johndoe@example.com",
        phone: "+1234567890",
        address: "123, Main Street, NY",
    });

    // 👇 Fix: Explicitly type the 'section' parameter
    const handleEdit = (section: "basic" | "contact") => {
        if (section === "basic") setIsEditingBasic(!isEditingBasic);
        if (section === "contact") setIsEditingContact(!isEditingContact);
    };

    // 👇 Optional: Add type for event
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.profileContainer}>
            {/* Basic Information */}
            <div className={styles.header}>
                <h1>Basic Information</h1>
                <button onClick={() => handleEdit("basic")} className={styles.editButton}>
                    {isEditingBasic ? "Update" : "Edit"}
                </button>
            </div>
            <div className={styles.infoGrid}>
                <div>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingBasic}
                    />
                </div>
                <div>
                    <label>Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingBasic}
                    />
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingBasic}
                    />
                </div>
                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingBasic}
                    ></textarea>
                </div>
            </div>

            {/* Contact Information */}
            <div className={styles.header}>
                <h1>Contact Information</h1>
                <button onClick={() => handleEdit("contact")} className={styles.editButton}>
                    {isEditingContact ? "Update" : "Edit"}
                </button>
            </div>
            <div className={styles.infoGrid}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingContact}
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingContact}
                    />
                </div>
                <div>
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingContact}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
