"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from 'next/navigation';
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/articledetails.css"
import Select from "react-select";
import '../../assets/css/lax.css';

interface Article {
  _id: string;
  article_heading: string;
  article_description: string;
  article_image: string[];
  faqs: {
    question: string;
    answer: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface EnquiryFormData {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  message: string;
}

interface CountryOption {
  value: string;
  label: string;
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
  message: yup.string().required("Message is required"),
});

const TravelOfferPage = () => {
  const params = useParams();
  const articleId = params?.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: yupResolver(schema),
  });

  // Optimized session storage logic
  useEffect(() => {
    if (!pathname) return;

    const tipsPrefix = "/tips-and-article/";
    if (pathname.startsWith(tipsPrefix)) {
      const dynamicId = pathname.replace(tipsPrefix, "");
      const sessionKey = `reloadedTipsArticle_${dynamicId}`;

      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "true");
        window.location.reload();
      }
    }
  }, [pathname]);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/frontend/article/${articleId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        setArticle(data.data);
        setImageUrls(data.data?.article_image || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) fetchArticle();
  }, [articleId]);

  // Fetch country codes
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/country-code`);
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


  const onSubmit = async (data: EnquiryFormData) => {
    setFormSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to submit enquiry");
      }

      toast.success("Enquiry submitted successfully!");
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed";
      toast.error(message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const renderArticleContent = () => {
    if (!article) return null;

    const paragraphs = article.article_description.split("</p>");
    const result = [];
    let imageIndex = 0;

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        result.push(
          <div
            key={`p-${index}`}
            dangerouslySetInnerHTML={{ __html: paragraph + "</p>" }}
          />
        );

        if (index % 2 === 1 && imageIndex < imageUrls.length) {
          result.push(
            // <Image
            //   key={`img-${imageIndex}`}
            //   src={imageUrls[imageIndex]}
            //   alt={`Article image ${imageIndex + 1}`}
            //   width={800}
            //   height={500}
            //   className="img-fluid rounded mb-4"
            //   style={{ objectFit: "cover" }}
            //   priority={imageIndex === 0} // Only prioritize first image
            //   loading={imageIndex > 0 ? "lazy" : "eager"}
            // />
          );
          imageIndex++;
        }
      }
    });

    // Add remaining images
    for (let i = imageIndex; i < imageUrls.length; i++) {
      result.push(
        <Image
          key={`img-${i}`}
          src={imageUrls[i]}
          alt={`Article image ${i + 1}`}
          width={800}
          height={500}
          className="img-fluid rounded mb-4"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
      );
    }

    return result;
  };

  if (loading) {
    return <div className="container py-5">Loading article...</div>;
  }

  if (error) {
    return <div className="container py-5">Error: {error}</div>;
  }

  if (!article) {
    return <div className="container py-5">Article not found</div>;
  }

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="row">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-4 ">{article.article_heading}</h2>

          {imageUrls[0] && (
            <Image
              src={imageUrls[0]}
              alt="Main article image"
              width={800}
              height={500}
              className="img-fluid rounded mb-4"
              style={{ objectFit: "cover" }}
              priority
            />
          )}

          {renderArticleContent()}

          {article.faqs?.length > 0 && (
            <div className="mt-5">
              <h5 className="fw-bold mb-4">Frequently Asked Questions</h5>
              <div className="accordion" id="faqAccordion">
                {article.faqs.map((faq, index) => (
                  <div key={faq._id} className="accordion-item">
                    <h6 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-${index}`}
                      >
                        {faq.question}
                      </button>
                    </h6>
                    <div
                      id={`faq-${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="card-title">Contact Us</h6>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <input
                      {...register("first_name")}
                      className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                      placeholder="First Name*"
                    />
                    {errors.first_name && (
                      <div className="invalid-feedback">
                        {errors.first_name.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <input
                      {...register("last_name")}
                      className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                      placeholder="Last Name*"
                    />
                    {errors.last_name && (
                      <div className="invalid-feedback">
                        {errors.last_name.message}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="email"
                  {...register("email")}
                  className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email*"
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email.message}
                  </div>
                )}

                <div className="input-group mb-2 custom-input-wrap">
                  <Controller
                    name="country_code"
                    control={control}
                    rules={{ required: "Country code is required" }}
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
                            width: "100px",        // Set width here
                            height: "50px",        // Set height here
                            borderColor: errors.country_code ? "#dc3545" : "#ced4da",
                            minHeight: "40px",     // Makes sure height isn't overridden
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
                    {...register("mobile_number")}
                    className={`form-control mb-2 ${errors.mobile_number ? "is-invalid" : ""}`}
                    placeholder="Your Phone*"
                  />
                  {errors.mobile_number && (
                    <div className="invalid-feedback">
                      {errors.mobile_number.message}
                    </div>
                  )}
                </div>

                <textarea
                  {...register("message")}
                  className={`form-control mb-2 ${errors.message ? "is-invalid" : ""}`}
                  placeholder="Message..."
                  rows={5}
                ></textarea>
                {errors.message && (
                  <div className="invalid-feedback">
                    {errors.message.message}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Enquiry"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <i className="bi bi-chat-left-dots-fill fs-2 mb-3"></i>
              <h6 className="fw-bold">Anything unclear about your trip or stay?</h6>
              <p className="text-muted">
                Got any questions about your trip plan, stay, or activities? Feel free to {`ask—we're`} here to help make your travel experience seamless!
              </p>
              <button className="btn btn-warning w-100">Ask Us Now</button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container py-5 footer-links">
        <h6 className="fw-bold">Fantastic Fare</h6>
        <p className="text-muted">About Us, Investor Relations, Careers, Sustainability, MMT Foundation, Legal Notices, CSR Policy, myPartner - Travel Agent Portal, List your hotel</p>

        <h6 className="fw-bold mt-4">About the Site</h6>
        <p className="text-muted">Customer Support, MMT Black Loyalty Program, Payment Security, Privacy Policy, Cookie Policy, User Agreement, Terms of Service, Franchise Offices</p>

        <h6 className="fw-bold mt-4">States of India</h6>
        <p className="text-muted">Hotels in Kerala, Hotels in Punjab, Hotels in Gujarat, Hotels in Andhra Pradesh, Hotels in Arunachal Pradesh, Hotels in Assam, Hotels in Bihar, Hotels in Chhattisgarh, Hotels in Haryana, Hotels in Himachal Pradesh, Hotels in Jharkhand, Hotels in Karnataka, Hotels in Ladakh, Hotels in Madhya Pradesh, Hotels in Maharashtra, Hotels in Manipur, Hotels in Meghalaya, Hotels in Mizoram, Hotels in Nagaland, Hotels in Odisha, Hotels in Telangana, Hotels in Tripura, Hotels in Rajasthan, Hotels in Tamil Nadu, Hotels in Uttar Pradesh, Hotels in Uttarakhand, Hotels in West Bengal</p>
        <h6 className="fw-bold mt-4">Top Properties</h6>
        <p className="text-muted">W Goa, The Leela Goa, The Tamara Coorg, Evolve Back Coorg, Grand Hyatt Goa, Taj Lake Palace Udaipur, The Leela Palace Udaipur, Grand Hyatt Mumbai, Jw Marriott Chandigarh, Alila Diwa Goa, Evolve Back Hampi, Evolve Back Kabini, Hyatt Regency Mumbai, Le Meridien Delhi, Itc Grand Chola Chennai, Rambagh Palace Jaipur, Le Meridien Goa, Taj Lands End Mumbai, Jai Mahal Palace Jaipur, Vythiri Resort Wayanad, Red Earth Kabini, Taj Mahal Tower Mumbai, The Serai Bandipur, Wildflower Hall Shimla, Azaya Beach Resort Goa, Four Seasons Hotel Mumbai, Taj Fort Aguada Resort & Spa Goa, Itc Maratha Mumbai, Park Hyatt Chennai, Sea Shell Havelock, Spice Tree Munnar, ITC Grand Bharat, St Regis In Mumbai, Chennai Leela Palace, Hyatt Regency Delhi, Hyatt Grand Mumbai, Goa Radisson Blu, Fariyas Hotel, ITC Gardenia Bengaluru, Kumarakom Lake Resort, Taj Delhi Hotel, Surajkund Vivanta, JW Marriott Banglore, Alila Diwa Goa, Westin Goa, Trident Hotel Udaipur, Ritz Carlton Bangalore, Taj Hotel Lucknow, Leela In Kovalam, Trident Hotel Jaipur</p>
        <h6 className="fw-bold mt-4">Corporate Travel</h6>
        <p className="text-muted">Business Travel, Corporate Travel, Corporate Travel Management, Corporate Travel Solution, Corporate Hotel Booking, Corporate Flight Booking, Expense Management, Corporate Expense Management, GST on Hotel Rooms, GST on Flight Tickets, Business Travel for SME, GST on International Flight Tickets​, GST on Bus Tickets, GST on Train Tickets, T&E (Travel & Expense), myBiz - Best Business Travel Platform, GST Invoice for Corporate Travel, myBiz for Small Business, Free cancellation on International Flights</p>
        <h6 className="fw-bold mt-4">Top Homestay Cities</h6>
        <p className="text-muted">HHomestays In Chikmagalur, Homestays In Coorg, Homestays In Sakleshpur, Homestays In Goa, Homestays In Ooty, Homestays In Darjeeling, Homestays In Manali, Homestays In Munnar, Homestays In Wayanad, Homestays In Bengaluru, Homestays In Kasauli, Homestays In Kodaikanal, Homestays In Shimla, Homestays In Mysore, Homestays In Dandeli, Homestays In Dehradun, Homestays In Gokarna, Homestays In Mussoorie, Homestays In Nainital, Homestays In Rishikesh, Homestays In Vagamon, Homestays In Alibaug, Homestays In Kalimpong, Homestays In Mangalore, Homestays In Pondicherry, Homestays In Yercaud, Homestays In Coonoor, Homestays In Kabini, Homestays In Kasol, Homestays In Kurseong, Homestays In Mukteshwar</p>
        <h6 className="fw-bold mt-4">Trending Resort Cities</h6>
        <p className="text-muted">RMahabaleshwar Resorts, Resorts In Agra, Resorts In Bhimtal, Resorts In Bordi, GraResorts In Br Hills, Resorts In Chikmagalur, Resorts In Cochin, Resorts In Darjeeling, Resorts In Dehradun, Resorts In Dharamshala, Resorts In Gorai, Resorts In Jaipur, Resorts In Jaisalmer, Resorts In Jodhpur, Resorts In Kanakapura, Resorts In Kollam, Resorts In Kotagiri, Resorts In Lucknow, Resorts In Madikeri, Resorts In Mahabaleshwar, Resorts In Masinagudi, Resorts In Matheran, Resorts In Mount Abu, Resorts In Mumbai, Resorts In Munnar, Resorts In Mussoorie, Resorts In Mysore, Resorts In Nainital, Resorts In Neemrana, Resorts In Kodaikanal</p>
      </div> */}
    </div>
  );
};

export default TravelOfferPage;