"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/contact.css";
import ellipseBig from "../assets/images/ellipse-big.png";
import ellipseSmall from "../assets/images/ellipse-small.png";
import { Phone, Mail, MapPin } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CountryOption {
  value: string;
  label: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("http://localhost:8000/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent successfully!",
        });
        reset();
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/country-code");
        const data = await res.json();
        if (data.status && Array.isArray(data.countryCodes)) {
          const formatted = data.countryCodes.map((code: string) => ({
            value: code,
            label: code,
          }));
          setCountryOptions(formatted);
        }
      } catch (err) {
        console.error("Error fetching country codes:", err);
        toast.error("Failed to load country codes");
      }
    };

    fetchCountryCodes();
  }, []);

  return (
    <div className="contact-us-container">
      <ToastContainer />
      <div className="text-center my-5 px-4">
        <h5 className="fw-bold text-dark w-75 mx-auto">
          Feel free to reach out by filling out the contact form below.
        </h5>
        <h6 className="fw-bold text-dark w-75 mx-auto mt-2">
          Our team will respond promptly to your inquiry.
        </h6>
      </div>

      {submitStatus && (
        <div
          className={`alert ${
            submitStatus.success ? "alert-success" : "alert-danger"
          } text-center mx-auto`}
          style={{ maxWidth: "600px" }}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="container-fluid contact-info-form">
        <div className="row">
          <div className="col-md-4 bg-primary text-white p-5 rounded-start position-relative">
            <h2 className="contact-info-title">Contact Information</h2>
            <ul className="list-unstyled mt-4" style={{ paddingTop: "34px" }}>
              <li className="mb-4">
                <Phone className="me-2" /> +1-833-422-7770
              </li>
              <li className="mb-4">
                <Mail className="me-2" /> care@fantasticfare.com
              </li>
              <li>
                <MapPin className="me-2" /> 3524 Silverside Rd, Wilmington, DE 19810, United States
              </li>
            </ul>

            <div className="ellipses-container position-absolute bottom-0 end-0">
              <Image src={ellipseBig} alt="Ellipse Big" className="ellipse-big" />
              <Image src={ellipseSmall} alt="Ellipse Small" className="ellipse-small position-absolute" />
            </div>
          </div>

          <div className="col-md-8 p-5 rounded-end">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control underlined-input"
                    placeholder="First Name"
                    {...register("first_name", { required: true })}
                  />
                  {errors.first_name && <small className="text-danger">First name is required</small>}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control underlined-input"
                    placeholder="Last Name"
                    {...register("last_name", { required: true })}
                  />
                  {errors.last_name && <small className="text-danger">Last name is required</small>}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control underlined-input"
                    placeholder="Email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && <small className="text-danger">Email is required</small>}
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <div style={{ flex: "0 0 100px" }}>
                    <Controller
  name="country_code"
  control={control}
  rules={{ required: "Country code is required" }}
  render={({ field }) => (
    <Select
      {...field}
      options={countryOptions}
      placeholder="+91"
      classNamePrefix="react-select"
      value={countryOptions.find((option) => option.value === field.value)}
      onChange={(selectedOption) => field.onChange(selectedOption?.value)}
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "transparent",
          border: "none",
          borderBottom: state.isFocused ? "2px solid #0d6efd" : "1px solid #ced4da",
          boxShadow: "none",
          borderRadius: 0,
          minHeight: "40px",
          height: "40px",
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#0d6efd",
          padding: "0 8px",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0",
        }),
        input: (base) => ({
          ...base,
          margin: "0",
          padding: "0",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#000",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  )}
/>

                      {errors.country_code && <small className="text-danger">{errors.country_code.message}</small>}
                    </div>
                    <input
                      type="tel"
                      className="form-control underlined-input"
                      placeholder="Phone Number"
                      {...register("mobile_number", { required: true })}
                    />
                  </div>
                  {errors.mobile_number && <small className="text-danger">Phone number is required</small>}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <textarea
                    className="form-control underlined-input"
                    placeholder="Your Message"
                    rows={5}
                    {...register("message", { required: true })}
                  ></textarea>
                  {errors.message && <small className="text-danger">Message is required</small>}
                </div>
              </div>

              <button
                type="submit"
                className="customButton"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
