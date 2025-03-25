"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import NewsCard from "./NewsCard";
import Arrow from "./uiKit/SliderButton";
import Link from "next/link";
import { getArticles } from "@/services/api";
import { API_URL } from "@/services/api";

interface NewsItem {
  id: number | string;
  slug: string;
  title: string;
  date: string;
  previewImage?: {
    url: string;
    alt?: string;
  };
}

const NewsCatalog: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        // The API should already sort by date, but we'll ensure it here
        const response = await getArticles(currentPage, 6);
        
        if (!response.docs) {
          console.warn("API response missing docs property");
          setNews([]);
          setTotalDocs(0);
        } else {
          // Ensure we sort by date if API doesn't do it automatically
          const sortedNews = [...response.docs].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          console.log(`Fetched ${sortedNews.length} news items`);
          setNews(sortedNews);
          setTotalDocs(response.totalDocs || 0);
        }
      } catch (err: unknown) {
        console.error("Error fetching news:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [currentPage]);

  // Setup pagination
  const newsPerPage = 6;
  const totalPages = Math.ceil(totalDocs / newsPerPage);

  // Generate pagination items
  const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-[#F5F5F5]">
      <Container>
        <div className="py-8">
          {/* News section */}
          <div className="mb-12">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                {error}
              </div>
            ) : news.length === 0 ? (
              <div className="bg-[#1E1E1E] p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium text-[#FFFFFF] mb-2">
                  Новостей пока нет
                </h3>
                <p className="text-[#9A9A9A]">Следите за обновлениями</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((newsItem) => {
                  console.log(`News item slug: ${newsItem.slug}`);
                  return (
                    <Link
                      href={`/news/${newsItem.slug}`}
                      key={newsItem.id}
                    >
                      <NewsCard
                        imageUrl={newsItem.previewImage?.url ? 
                          (newsItem.previewImage.url.startsWith('/') ? 
                            `${API_URL}${newsItem.previewImage.url}` : 
                            newsItem.previewImage.url) : 
                          undefined}
                        date={new Date(newsItem.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric'
                        })}
                        title={newsItem.title}
                        variant="white"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && news.length > 0 && totalPages > 1 && (
            <div className="flex justify-center my-10">
              <div className="flex items-center gap-[30px]">
                <Arrow direction="left" onClick={goToPrevPage} disabled={currentPage === 1} />
                {paginationItems.map((item) => (
                  <button
                    key={item}
                    className={`font-extrabold text-[16px] font-[Roboto_Condensed] ${
                      item === currentPage ? "text-[#38AE34]" : "text-[#616161]"
                    }`}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                ))}
                <Arrow direction="right" onClick={goToNextPage} disabled={currentPage === totalPages} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NewsCatalog;
