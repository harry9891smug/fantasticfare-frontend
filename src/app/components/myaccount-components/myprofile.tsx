"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "../../assets/css/myaccount.module.css";
import Image from "next/image";
interface User {
    _id: string;
    name: string;
    email: string;
    mobile_number: string;
    role: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    // Add any additional fields from your API if needed
}

const MyProfile = () => {
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        _id: "", 
        name: "",
        gender: "", // Add if available in API
        dob: "", // Add if available in API
        bio: "", // Add if available in API
        email: "",
        mobile_number: "",
        address: "", // Add if available in API
        role: "",
        profile_picture: null as File | null
    });

    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    setError("Authentication token not found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.status && data.user) {
                    setFormData({
                        _id: data.user._id || "",
                        name: data.user.name || "",
                        gender: data.user.gender || "",
                        dob: data.user.dob || "",
                        bio: data.user.bio || "",
                        email: data.user.email || "",
                        mobile_number: data.user.mobile_number || "",
                        address: data.user.address || "",
                        role: data.user.role || "",
                        profile_picture: data.user.profile_picture || null
                    });
                } else {
                    setError(data.message || "Failed to fetch user data");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred while fetching user data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = (section: "basic" | "contact") => {
        if (section === "basic") setIsEditingBasic(!isEditingBasic);
        if (section === "contact") setIsEditingContact(!isEditingContact);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (section: "basic" | "contact") => {
    try {
        const token = getAuthToken();
        if (!token) {
            setError("Authentication token not found");
            return;
        }

        let body: FormData | string;
        let headers: HeadersInit;

        if (section === "basic") {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("gender", formData.gender);
            formDataToSend.append("dob", formData.dob);
            formDataToSend.append("bio", formData.bio);
            if (formData.profile_picture) {
                formDataToSend.append("profile_picture", formData.profile_picture);
            }

            body = formDataToSend;
            headers = {
                'Authorization': `Bearer ${token}`
                // Do NOT set 'Content-Type' when using FormData
            };
        } else {
            // contact section (non-file)
            body = JSON.stringify({
                userId: formData._id,
                email: formData.email,
                mobile_number: formData.mobile_number,
                address: formData.address
            });
            headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        }
console.log("Updating user with ID:", formData._id);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update/${formData._id}`, {
            method: 'PUT',
            headers,
            body
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();

        if (result.status) {
            setSuccessMessage("Profile updated successfully");
            setTimeout(() => setSuccessMessage(null), 3000);

            if (section === "basic") setIsEditingBasic(false);
            if (section === "contact") setIsEditingContact(false);
        } else {
            setError(result.message || "Update failed");
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during update");
        console.error(err);
    }
};


    if (loading) return <div className={styles.profileContainer}>Loading...</div>;
    if (error) return <div className={styles.profileContainer}>Error: {error}</div>;

    return (
        <div className={styles.profileContainer}>
            {successMessage && (
                <div className={styles.successMessage}>
                    {successMessage}
                </div>
            )}
            
            {/* Basic Information */}
            <div className={styles.header}>
                <h1>Basic Information</h1>
                <button 
                    onClick={() => isEditingBasic ? handleSubmit("basic") : handleEdit("basic")} 
                    className={styles.editButton}
                >
                    {isEditingBasic ? "Save" : "Edit"}
                </button>
            </div>
            <div className={styles.infoGrid}>
                <div>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingBasic}
                    />
                </div>
                 <div>
    <label>Profile Picture</label>
   {isEditingBasic ? (
    <input
        type="file"
        accept="image/*"
        onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
                setFormData({ ...formData, profile_picture: e.target.files[0] });
            }
        }}
        className={styles.inputField}
    />
) : (
    <div className={styles.imagePreview}>
        {/* Show current profile picture if you have it */}
        <Image
    src={
    formData.profile_picture instanceof File
      ? URL.createObjectURL(formData.profile_picture)
      : formData.profile_picture || "/assets/images/account.svg"
  }
    alt="Profile"
    width={100} // required
    height={100} // required
    style={{ objectFit: "cover", borderRadius: "50%" }} // optional
/>
    </div>
)}

</div>

                <div>
                    <label>Gender</label>
                    {isEditingBasic ? (
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={styles.inputField}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            readOnly
                            className={styles.inputField}
                        />
                    )}
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
                    <label>Role</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        className={styles.inputField}
                        readOnly={true}
                    />
                </div>
                <div className={styles.fullWidth}>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingBasic}
                        rows={4}
                    ></textarea>
                </div>
            </div>

            {/* Contact Information */}
            <div className={styles.header}>
                <h1>Contact Information</h1>
                <button 
                    onClick={() => isEditingContact ? handleSubmit("contact") : handleEdit("contact")} 
                    className={styles.editButton}
                >
                    {isEditingContact ? "Save" : "Edit"}
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
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingContact}
                    />
                </div>
                <div className={styles.fullWidth}>
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={styles.inputField}
                        readOnly={!isEditingContact}
                        rows={3}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;