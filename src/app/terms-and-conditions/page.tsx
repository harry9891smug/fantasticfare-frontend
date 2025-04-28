'use client';
import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="container my-5">
      <h2 className=" mb-4">Terms and Conditions</h2>
      <p>
        {`This web page represents a legal document that serves as the terms of
        use for our website ("Terms of Use"), www.fantasticfare.com, and any
        associated mobile application (collectively, "Website"), as owned and
        operated by FantasticFare ("Company").`}
      </p>
      <p>{`Capitalized terms, unless otherwise defined, have the meaning specified within the Definitions section below. These Terms of Use, along with our Privacy Policy and other posted guidelines (collectively "Legal Terms"), constitute the entire and only agreement between you and FantasticFare, superseding all other agreements, representations, warranties, and understandings related to our Website.`}</p>
      <p>We may amend these Legal Terms at any time without specific notice to you. The latest version will always be posted on our Website, and you should review them periodically to ensure compliance. By using our Website, you agree to fully comply with and be bound by these Legal Terms. If you do not accept these terms, please do not access or use our Website.</p>
      <h4>Definitions</h4>
      <ul>
        <li><strong>Company</strong>: Refers to FantasticFare, the owner of the Website.</li>
        <li><strong>User</strong>: Any individual who accesses or uses our Website.</li>
        <li><strong>Member</strong>: A User who registers an account on our Website.</li>
        <li><strong>Supplier</strong>: A business offering travel services through our Website.</li>
        <li><strong>Customer</strong>: A User who books services through our Website.</li>
        <li><strong>Content</strong>: All text, information, graphics, audio, video, and data on our Website.</li>
      </ul>

      <h4>Limited License</h4>
      <p>
        FantasticFare grants you a non-exclusive, non-transferable, revocable
        license to access and use our Website strictly in accordance with these
        Legal Terms.
      </p>

      <h4>Eligibility & Registration</h4>
      <ul>
        <li>Users must be at least 18 years old or have parental consent if aged 13-18.</li>
        <li>By registering, you certify that the information provided is accurate.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
      </ul>

      <h4>Supplier & Booking Policies</h4>
      <ul>
        <li>FantasticFare provides a platform for booking services but does not operate travel services directly.</li>
        <li>Suppliers are responsible for fulfilling and maintaining service quality.</li>
        <li>Customers must comply with supplier policies regarding cancellations, refunds, and rescheduling.</li>
        <li>FantasticFare is not liable for issues arising from third-party suppliers.</li>
      </ul>

      <h4>Payment & Refund Policy</h4>
      <ul>
        <li>Prices are subject to change.</li>
        <li>Payment must be made in full at the time of booking unless stated otherwise.</li>
        <li>{`Refunds, if applicable, are processed per the supplier’s refund policy.`}</li>
        <li>FantasticFare is not responsible for refund delays due to third-party suppliers.</li>
      </ul>

      <h4>User Conduct</h4>
      <ul>
        <li>Users agree not to post unlawful, abusive, or fraudulent content.</li>
        <li>Users must not attempt to gain unauthorized access to the Website.</li>
        <li>Fraudulent activities, including unauthorized chargebacks, are prohibited.</li>
        <li>Users must comply with all applicable laws and website policies.</li>
      </ul>

      <h4>Intellectual Property</h4>
      <p>
        All content on our Website is protected under copyright, trademark, and
        intellectual property laws. Users may not copy, reproduce, or modify
        any content without our written consent.
      </p>

      <h4>Limitation of Liability</h4>
      <ul>
      <li>{`FantasticFare provides the Website "as is" without any warranties.`}</li>
        <li>We are not liable for losses, damages, or disruptions caused by third-party providers.</li>
        <li>FantasticFare is not responsible for service failures, missed flights, or cancellations.</li>
      </ul>

      <h4>Links to Third-Party Websites</h4>
      <p>
        Our Website may contain links to external sites. FantasticFare does not
        endorse or assume responsibility for third-party website content.
      </p>

      <h4>Termination</h4>
      <p>
        FantasticFare reserves the right to terminate or suspend your access if
        you violate these Legal Terms.
      </p>

      <h4>Contact Information</h4>
      <p>
        For questions regarding these Terms & Conditions, contact us at:<br />
        <strong>FantasticFare</strong>
        [Your Address] 
        [Your Email] 
        [Your Phone Number]
      </p>
    </div>
  );
};

