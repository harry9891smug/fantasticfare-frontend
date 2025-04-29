"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import "../assets/css/tips.css";
import Link from "next/link";
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

const TipsArticlesSection = () => {
  const [visible, setVisible] = useState(3);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/frontend/articles`);

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await response.json();
        setArticles(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        // For now, we'll use mock data if API fails (remove this in production)
        setArticles([
          {
            _id: "1",
            article_heading: "Travel Safety Tips",
            article_description: "Always keep a copy of your passport, carry essential medicine, and know the local emergency numbers before you go.",
            article_image: ["/placeholder-image.jpg"],
            faqs: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Add more mock data as needed
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="tips-articles-section">Loading articles...</div>;
  }

  if (error) {
    return <div className="tips-articles-section">Error: {error}</div>;
  }

  return (
    <div className="tips-articles-section">
      <h2>Tips & Articles</h2>
      <div className="tips-grid">
        {articles.slice(0, visible).map((article) => (
          <div key={article._id} className="tip-card">
            {article.article_image?.length > 0 && (
              <Image 
                src={article.article_image[0]} 
                alt={article.article_heading} 
                width={300} 
                height={200} 
                style={{ objectFit: "cover" }}
              />
            )}
            <h3><Link href={`/tips-and-article/${article._id}`}>{article.article_heading}</Link></h3>
        
            <p>
              {article.article_description
                .replace(/<[^>]*>/g, "") // Remove HTML tags
                .split(" ")
                .slice(0, 25)
                .join(" ")}...
            </p>
          </div>
        ))}
      </div>

      {visible < articles.length && (
        <div className="text-center">
          <button 
            onClick={() => setVisible(articles.length)} 
            className="read-more-btn"
          >
            Read More
          </button>
        </div>
      )}

      {/* Featured Sections */}
      {articles.length > 0 && (
        <>
          <h2 className="in-depth-title">Monthly Selections</h2>
          <div className="in-depth-layout">
            <div className="in-depth-left">
              <h3>{articles[0].article_heading}</h3>
              {articles[0].article_image?.length > 0 && (
                <Image 
                  src={articles[0].article_image[0]} 
                  alt={articles[0].article_heading} 
                  width={500} 
                  height={300} 
                  style={{ objectFit: "cover" }}
                />
              )}
              <p>
                {articles[0].article_description
                  .replace(/<[^>]*>/g, "")
                  .split(" ")
                  .slice(0, 50)
                  .join(" ")}...
              </p>
            </div>

            <div className="in-depth-boxes">
              <div className="in-depth-row">
                {articles.slice(1, 4).map((article) => (
                  <div key={article._id} className="in-depth-box">
                    <h4>{article.article_heading}</h4>
                    {article.article_image?.length > 0 && (
                      <Image 
                        src={article.article_image[0]} 
                        alt={article.article_heading} 
                        width={200} 
                        height={120} 
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    <p>
                      {article.article_description
                        .replace(/<[^>]*>/g, "")
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}...
                    </p>
                  </div>
                ))}
              </div>

              <div className="in-depth-row">
                {articles.slice(4, 7).map((article) => (
                  <div key={article._id} className="in-depth-box">
                    <h4>{article.article_heading}</h4>
                    {article.article_image?.length > 0 && (
                      <Image 
                        src={article.article_image[0]} 
                        alt={article.article_heading} 
                        width={200} 
                        height={120} 
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    <p>
                      {article.article_description
                        .replace(/<[^>]*>/g, "")
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Popular Articles Section - Similar structure */}
      {articles.length > 0 && (
        <>
          <h2 className="in-depth-title">Our Most Popular Articles</h2>
          <div className="in-depth-layout">
            {/* Similar structure as Monthly Selections */}
            {/* You can customize which articles appear here */}
          </div>
        </>
      )}
    </div>
  );
};

export default TipsArticlesSection;