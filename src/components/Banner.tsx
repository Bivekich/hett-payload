"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBanners } from "@/services/api";
import Image from "next/image";
import { PayloadResponse } from "@/types/banner";
import { API_URL } from "@/services/api";

interface Slide {
  id: number | string;
  number: string;
  subtitle: string;
  title: string;
  link: string;
  backgroundImage: string;
  imageName: string;
}

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSlideClick = useCallback(
    (index: number) => {
      if (!isAnimating && index !== activeSlide) {
        setIsAnimating(true);
        setActiveSlide(index);
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }
    },
    [isAnimating, activeSlide]
  );

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);
        const response = (await getBanners()) as PayloadResponse;

        if (!response.docs || response.docs.length === 0) {
          throw new Error("No banner data available");
        }

        // Get the first banner's slides
        const bannerData = response.docs[0];

        if (!bannerData.slides || bannerData.slides.length === 0) {
          throw new Error("No slides available in banner data");
        }

        // Transform API data to component format
        const formattedSlides = bannerData.slides.map((slide, index) => {
          // Extract image URL and ensure it's absolute
          let imageUrl = slide.image?.url || "";

          // Make URL absolute if it's relative
          if (imageUrl && imageUrl.startsWith("/")) {
            imageUrl = `${API_URL}${imageUrl}`;
          }

          return {
            id: slide.id || index,
            number: slide.number || `0${index + 1}`,
            subtitle: slide.subtitle || "",
            title: slide.title || "",
            link: slide.link || "#",
            backgroundImage: imageUrl,
            imageName: slide.image?.alt || `Slide ${index + 1}`,
          };
        });

        setSlides(formattedSlides);
      } catch (err: unknown) {
        console.error("Error fetching banner data:", err);
        setError(err instanceof Error ? err.message : String(err));

        // Fallback to mock data if API fails
        const mockSlides: Slide[] = [
          {
            id: 1,
            number: "01",
            subtitle: "Инновационные решения",
            title: "Высококачественные автозапчасти для вашего автомобиля",
            link: "/products",
            backgroundImage:
              "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1283&q=80",
            imageName: "Слайд 1",
          },
          {
            id: 2,
            number: "02",
            subtitle: "Надежность и качество",
            title: "Запчасти от проверенных производителей",
            link: "/about",
            backgroundImage:
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            imageName: "Слайд 2",
          },
          {
            id: 3,
            number: "03",
            subtitle: "Широкий ассортимент",
            title: "Более 10,000 наименований в каталоге",
            link: "/catalog",
            backgroundImage:
              "https://images.unsplash.com/photo-1537984822441-cff330075342?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            imageName: "Слайд 3",
          },
        ];
        setSlides(mockSlides);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  if (isLoading)
    return <div className="w-full h-[610px] bg-gray-200 animate-pulse"></div>;
  if (error && slides.length === 0)
    return (
      <div className="w-full h-[610px] bg-gray-100 flex items-center justify-center">
        Failed to load banner
      </div>
    );
  if (slides.length === 0) return null;

  return (
    <div className="w-full bg-[#F5F5F5]">
      <div className="w-full max-w-[2200px] mx-auto overflow-hidden ">
        <div className="flex md:flex-row flex-col items-stretch md:items-center h-auto md:h-[610px] w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => handleSlideClick(index)}
              className={`
              flex relative flex-col cursor-pointer transition-all duration-500 overflow-hidden
              ${
                activeSlide === index
                  ? "flex-1 shrink self-stretch py-16 basis-0 min-h-[500px] md:min-h-0 min-w-0 md:min-w-[240px]"
                  : "h-20 md:h-auto md:w-40 flex-col justify-between self-stretch px-5 md:px-16 pt-5 md:pt-16 text-zinc-300"
              }
            `}
            >
              <div className="absolute inset-0 w-full h-full">
                {slide.backgroundImage ? (
                  <Image
                    src={slide.backgroundImage}
                    alt={slide.imageName}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
              </div>

              {activeSlide !== index && (
                <div className="absolute inset-0 bg-black/50 hover:bg-black/30 transition-colors duration-300" />
              )}

              <div className="relative z-10 w-full">
                <div
                  className={`max-w-[1280px] mx-auto px-4 md:px-0 ${
                    activeSlide === index && index === 0
                      ? "md:pl-10 lg:pl-46"
                      : activeSlide === index && index === 1
                      ? "md:pl-8 lg:pl-6"
                      : activeSlide === index && index === 2
                      ? "md:pl-6 lg:pl-0"
                      : ""
                  }`}
                >
                  <div
                    className={`text-2xl md:text-4xl font-bold flex items-center justify-between ${
                      activeSlide === index
                        ? "text-neutral-100"
                        : "text-zinc-300"
                    } roboto-condensed-bold`}
                  >
                    {slide.number}
                    {activeSlide !== index && (
                      <span className="md:hidden ml-2 text-base md:text-lg">
                        {slide.subtitle}
                      </span>
                    )}
                  </div>

                  {activeSlide === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col mt-8 md:mt-44 w-full max-md:mt-10"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-bold leading-none text-neutral-100 roboto-condensed-bold"
                      >
                        {slide.subtitle}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 md:mt-10 text-3xl md:text-5xl font-bold leading-tight md:leading-[60px] text-neutral-100 roboto-condensed-bold"
                      >
                        {slide.title}
                      </motion.div>
                      <motion.div className="self-start mt-6 md:mt-10">
                        <Link
                          href={slide.link}
                          className="flex gap-2 items-center px-6 md:px-8 py-3 md:py-4 bg-[#38AE34] border border-transparent hover:bg-transparent hover:text-white hover:border hover:border-[#38AE34] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div className="self-stretch my-auto text-base md:text-lg font-semibold leading-tight text-white roboto-condensed-semibold">
                            Подробнее
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
