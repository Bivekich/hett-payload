"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "./uiKit/Button";
import { getAboutData } from "@/services/api";
import { AboutData, AboutResponse } from "@/types/about";
import { API_URL } from "@/services/api";
import { lexicalToHtml } from "@/utils/lexicalToHtml";

// Fallback image in case API fails
import fallbackImage from "@/assets/aboutImage.png";

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const response = (await getAboutData()) as AboutResponse;

        if (!response.docs || response.docs.length === 0) {
          throw new Error("No about data available");
        }

        setAboutData(response.docs[0]);
      } catch (err: unknown) {
        console.error("Error fetching about data:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Prepare image URL if available
  const imageUrl = aboutData?.mainImage?.url
    ? aboutData.mainImage.url.startsWith("/")
      ? `${API_URL}${aboutData.mainImage.url}`
      : aboutData.mainImage.url
    : null;

  // Convert Lexical content to HTML if available
  const mainContentHtml = aboutData?.mainContent
    ? lexicalToHtml(aboutData.mainContent)
    : "";

  return (
    <section className="py-18 bg-white relative z-[100] pb-22 ">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
        {isLoading ? (
          <div className="w-full h-[300px] bg-gray-200 animate-pulse"></div>
        ) : error ? (
          <div className="w-full">
            <h2 className="text-[32px] font-bold roboto-condensed-bold text-black mb-6">
              О производителе Hett Automotive
            </h2>
            <div className="text-[16px] roboto-condensed-regular text-black space-y-4 mb-8">
              <p>
                Hett Automotive стремится предоставлять своим клиентам
                качественные автозапчасти по доступным ценам. Компания постоянно
                работает над улучшением своей продукции и расширением
                ассортимента, чтобы удовлетворить потребности автовладельцев.
              </p>
              <p>
                Одним из главных преимуществ Hett Automotive является её
                надёжность. Клиенты могут быть уверены в том, что они получат
                качественные автозапчасти, которые прослужат им долгое время.
              </p>
            </div>
            <Button label="Подробнее" href="/about" className="inline-block" />
          </div>
        ) : (
          <div className="flex gap-8 items-center relative md:flex-row flex-col-reverse">
            <div className="w-full lg:max-w-[800px] relative">
              <h2 className="text-[32px] font-bold roboto-condensed-bold text-black mb-6">
                {aboutData?.title || "О производителе Hett Automotive"}
              </h2>
              <div className="text-[16px] roboto-condensed-regular text-black space-y-4 mb-8">
                {mainContentHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: mainContentHtml }} />
                ) : (
                  <>
                    <p>
                      Hett Automotive стремится предоставлять своим клиентам
                      качественные автозапчасти по доступным ценам. Компания
                      постоянно работает над улучшением своей продукции и
                      расширением ассортимента, чтобы удовлетворить потребности
                      автовладельцев.
                    </p>
                    <p>
                      Одним из главных преимуществ Hett Automotive является её
                      надёжность. Клиенты могут быть уверены в том, что они
                      получат качественные автозапчасти, которые прослужат им
                      долгое время.
                    </p>
                  </>
                )}
              </div>
              <Button
                label="Подробнее"
                href="/about"
                className="inline-block"
              />
            </div>

            <div
              className="absolute right-[-444px] top-[-112px] w-[832px] h-[576px] hidden xl:block z-[999]"
              style={{ transform: "translateZ(0)" }}
            >
              <Image
                src={imageUrl || fallbackImage}
                alt={
                  aboutData?.mainImage?.alt || "О производителе Hett Automotive"
                }
                className="object-cover"
                priority
                fill
              />
            </div>

            {/* Mobile/Tablet Image */}
            <div className="lg:hidden w-full mt-8">
              <div className="relative w-full aspect-[832/576]">
                <Image
                  src={imageUrl || fallbackImage}
                  alt={
                    aboutData?.mainImage?.alt ||
                    "О производителе Hett Automotive"
                  }
                  className="object-cover"
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
