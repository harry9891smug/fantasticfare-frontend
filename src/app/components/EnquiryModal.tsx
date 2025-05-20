// components/EnquiryModal.tsx
'use client';

import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EnquiryModalProps {
  packageData: {
    _id: string;
    package_name: string;
    total_price: string;
    discounted_price?: string;
  };
  show: boolean;
  onClose: () => void;
  countryOptions: Array<{ value: string; label: string }>;
}

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  country_code: yup.string().required("Country code is required"),
  mobile_number: yup
    .string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  travel_date: yup.string().required("Travel date is required"),
  traveller_count: yup
    .number()
    .min(1, "Minimum 1 traveller")
    .required("Traveller count is required"),
  message: yup.string().required("Message is required"),
});

const EnquiryModal: React.FC<EnquiryModalProps> = ({ 
  packageData, 
  show, 
  onClose,
  countryOptions 
}) => {
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors, isSubmitting: formSubmitting }, 
    reset 
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package-enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          package_id: packageData._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      toast.success("Enquiry submitted successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit enquiry"
      );
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        
        {/* Price Section */}
        <div className="price-section">
          <h2 className="package-title">{packageData.package_name}</h2>
          <div className="price-details">
            <span className="current-price">USD {packageData.discounted_price || packageData.total_price}</span>
            {packageData.discounted_price && (
              <>
                <span className="original-price">USD {packageData.total_price}</span>
                <div className="save-badge">
                  <span className="save-text">SAVE</span>
                  <span className="save-percent">
                    Upto {Math.round((parseFloat(packageData.total_price) - parseFloat(packageData.discounted_price)) / parseFloat(packageData.total_price) * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="enquiry-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                type="text"
                id="full-name"
                placeholder="Enter your full name"
                {...register("first_name")}
                className={errors.first_name ? "error" : ""}
              />
              {errors.first_name && (
                <p className="error-message">{errors.first_name.message}</p>
              )}
            </div>

            <div className="form-group">
              <input
                type="text"
                id="last-name"
                placeholder="Enter your last name"
                {...register("last_name")}
                className={errors.last_name ? "error" : ""}
              />
              {errors.last_name && (
                <p className="error-message">{errors.last_name.message}</p>
              )}
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group phone-group">
              <div className="phone-input">
                <Controller
                  name="country_code"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countryOptions}
                      placeholder="+1"
                      classNamePrefix="react-select"
                      className={`${errors.country_code ? "is-invalid" : ""}`}
                      value={countryOptions.find((option) => option.value === field.value)}
                      onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "90px",
                          height: "35px",
                          borderColor: errors.country_code ? "#dc3545" : "#ced4da",
                          minHeight: "40px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  )}
                />

                {errors.country_code && (
                  <div className="invalid-feedback d-block">
                    {errors.country_code.message}
                  </div>
                )}
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  {...register("mobile_number")}
                  className={errors.mobile_number ? "error" : ""}
                />
              </div>
              {errors.mobile_number && (
                <p className="error-message">{errors.mobile_number.message}</p>
              )}
            </div>

            <div className="form-group date-traveller-group">
              <div className="form-group">
                <input
                  type="date"
                  id="travel-date"
                  {...register("travel_date")}
                  className={errors.travel_date ? "error" : ""}
                />
                {errors.travel_date && (
                  <p className="error-message">{errors.travel_date.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="number"
                  id="traveller-count"
                  placeholder="Number of travellers"
                  {...register("traveller_count")}
                  className={errors.traveller_count ? "error" : ""}
                  min="1"
                />
                {errors.traveller_count && (
                  <p className="error-message">{errors.traveller_count.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <textarea
                id="message"
                placeholder="Enter your message..."
                {...register("message")}
                className={errors.message ? "error" : ""}
              ></textarea>
              {errors.message && (
                <p className="error-message">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;