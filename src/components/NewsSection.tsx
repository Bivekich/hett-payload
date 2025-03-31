"use client";

import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import Button from "./uiKit/Button";
import SliderButton from "./uiKit/SliderButton";
import { getArticles } from "@/services/api";
import { API_URL } from "@/services/api";
import Link from "next/link";

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

const NewsSection = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await getArticles(1, 6);
        
        if (!response.docs) {
          console.warn("API response missing docs property");
          setNewsList([]);
        } else {
          const sortedNews = [...response.docs].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setNewsList(sortedNews);
          console.log(`Fetched ${sortedNews.length} news items`);
        }
      } catch (err: unknown) {
        console.error("Error fetching news:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  const totalSlides = Math.ceil(newsList.length / 3);
  const hasMultiplePages = totalSlides > 1;

  const goToNextSlide = () => {
    if (!hasMultiplePages) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    if (!hasMultiplePages) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const formatSlideNumber = (num: number) => {
    return (num + 1).toString().padStart(2, "0");
  };

  // Get current page of news
  const newsPerPage = 3;
  const currentNews = newsList.slice(
    currentSlide * newsPerPage,
    (currentSlide + 1) * newsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center px-4 md:px-6 py-16 w-full bg-[#181818] relative z-[1]">
        <div className="flex flex-col w-full max-w-[1280px]">
          <h2 className="text-4xl font-extrabold leading-none text-white roboto-condensed-bold">
            Новости
          </h2>
          <div className="mt-10 w-full h-[300px] flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || newsList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center px-4 md:px-6 py-16 w-full bg-[#181818] relative z-[1]">
        <div className="flex flex-col w-full max-w-[1280px]">
          <h2 className="text-4xl font-extrabold leading-none text-white roboto-condensed-bold">
            Новости
          </h2>
          <div className="mt-10 w-full">
            <div className="text-white text-center py-10">
              {error || "Новостей пока нет"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center px-4 md:px-6 py-16 w-full bg-[#181818] relative z-[1]">
      <div className="flex flex-col w-full max-w-[1280px]">
        <h2 className="text-4xl font-extrabold leading-none text-white roboto-condensed-bold">
          Новости
        </h2>

        <div className="mt-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentNews.map((news) => (
              <div key={news.id} className="flex flex-col">
                <Link href={`/news/${news.slug}/${news.id}`} className="h-full">
                  <NewsCard
                    imageUrl={news.previewImage?.url ? 
                      (news.previewImage.url.startsWith('/') ? 
                        `${API_URL}${news.previewImage.url}` : 
                        news.previewImage.url) : 
                      undefined}
                    date={new Date(news.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                    title={news.title}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-10">
          <div className="flex items-center gap-8">
            <div className="flex gap-4 items-center">
              <SliderButton
                direction="left"
                onClick={goToPrevSlide}
                ariaLabel="Previous slide"
                disabled={!hasMultiplePages}
              />
              <span className="text-xl font-bold text-center leading-none text-white roboto-condensed-bold">
                {formatSlideNumber(currentSlide)} /{" "}
                {formatSlideNumber(totalSlides - 1)}
              </span>
              <SliderButton
                direction="right"
                onClick={goToNextSlide}
                ariaLabel="Next slide"
                disabled={!hasMultiplePages}
              />
            </div>
          </div>
          <Button
            label="Все новости"
            href="/news"
            variant="secondary"
            className="inline-flex"
          />
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
