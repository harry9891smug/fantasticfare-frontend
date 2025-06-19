// app/page or pages/page (Pages Router)
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import FlightComponent from "@/app/components/FlightSearch";

interface PageData {
  _id: string;
  page_name: string;
  page_url: string;
  page_content_1: string;
  page_content_2: string;
  page_content_3: string;
  page_meta_name: string;
  page_meta_description: string;
}

const PagesDetails: React.FC = () => {
    const { id } = useParams();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/view-page/${id}`);
        if (res.data.status) {
          setPageData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetails();
  }, []);

  return (
    <>
     <div className="container py-5">

      {/* Tabs */}
      <FlightComponent />
     </div>
     
    <hr  />

      <main className="container py-5">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : pageData ? (
          <>
            <h1 className="text-3xl font-semibold mb-4">{pageData.page_name}</h1>

            <section
              className="mb-5 content-block"
              dangerouslySetInnerHTML={{ __html: pageData.page_content_1 }}
            ></section>

            <section
              className="mb-5 content-block"
              dangerouslySetInnerHTML={{ __html: pageData.page_content_2 }}
            ></section>

            <section
              className="mb-5 content-block"
              dangerouslySetInnerHTML={{ __html: pageData.page_content_3 }}
            ></section>
          </>
        ) : (
          <div className="text-center text-red-500">Failed to load page content.</div>
        )}
      </main>
    </>
  );
};

export default PagesDetails;
