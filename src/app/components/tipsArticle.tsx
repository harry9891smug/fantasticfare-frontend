// components/TipsSection.jsx or .tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import he from "he";
interface Article {
    id: number;
    image: string;
    title: string;
    description: string;
  }
// const travelTips: TravelTip[] = [
//   { id: 1, image: "/assets/images/img101.png", title: "How to Save Money on Flights", description: "Learn the best ways to book affordable flights without compromising on comfort." },
//   { id: 2, image: "/assets/images/img102.png", title: "Best Packing Tips for Travelers", description: "Discover how to pack efficiently and avoid unnecessary baggage fees." },
//   { id: 3, image: "/assets/images/img103.png", title: "Top Travel Safety Tips", description: "Ensure a safe trip by following these essential travel safety guidelines." },
//   { id: 4, image: "/assets/images/img104.png", title: "How to Find the Best Hotels", description: "Get expert tips on booking hotels with the best value and amenities." },
//   { id: 5, image: "/assets/images/img105.png", title: "Solo Travel Tips for Beginners", description: "Explore the world confidently with these solo travel insights." },
// ];
const TipsSection: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/frontend/articles`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
  
        const data = await response.json();
        setArticles(data.data);
        setSelectedArticle(data.data[0]); // Set first as selected
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
  
        // Optional: fallback mock
        const fallback = [
          {
            _id: "1",
            article_heading: "Travel Safety Tips",
            article_description: "Keep a copy of your passport and know emergency contacts.",
            article_image: ["/placeholder-image.jpg"]
          }
        ];
        setArticles(fallback);
        setSelectedArticle(fallback[0]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchArticles();
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading tips: {error}</p>;
  
    return (
      <div className="tips-section">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end p-4 rounded">
          <div>
            <h2 className="mb-2">Tips & Articles</h2>
            <p className="mb-0">Discover essential travel insights, money-saving strategies, and expert tips to enhance your journey.</p>
          </div>
        </div>
  
        <div className="row">
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="scrollable-tips">
              {articles.map(article => (
                <div
                  key={article._id}
                  className={`article-box p-3 mb-3 ${article?._id === article._id ? "active" : ""}`}
                  onClick={() => setSelectedArticle(article)}
                  role="button"
                >
                  <span className="tip-label">Perfect | Tips</span>
                  <h5 className="article-title">{article.article_heading}</h5>
                  <p className="article-description">{ he.decode(
                        (article?.article_description || "").replace(/<[^>]*>/g, "")
                      )
                        .split(" ")
                        .slice(0, 25)
                        .join(" ")}...</p>
                <Link className="title-links" href={`/tips-and-article/${article._id}`}> <button className="btn-color btn btn-primary btn-sm custom-btn">Read More</button></Link> 
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-md-8">
            {selectedArticle && (
              <div className="article-image-box">
                <Image
                  src={selectedArticle.article_image[0]}
                  alt={selectedArticle.article_heading}
                  width={800}
                  height={400}
                  className="img-fluid w-100"
                  priority
                />
                <div className="p-3">
                  <span className="tip-label">Perfect | Tips</span>
                  <h4 className="article-title">{selectedArticle.article_heading}</h4>
                  <p className="article-description">
                              {he.decode(
                        (selectedArticle?.article_description || "").replace(/<[^>]*>/g, "")
                      )
                        .split(" ")
                        .slice(0, 25)
                        .join(" ")}...
                    </p>
                    <Link className="title-links" href={`/tips-and-article/${selectedArticle._id}`}> <button className="btn-color btn btn-primary custom-btn">Read More</button></Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default TipsSection;
