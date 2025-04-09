"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "./uiKit/Button";
import { getGeographyData } from "@/services/api";
import { API_URL } from "@/services/api";

interface MapImage {
  url: string;
  alt?: string;
}

interface GeographySlide {
  title?: string;
  description?: string;
  map?: MapImage;
  buttonText?: string;
  buttonLink?: string;
}

interface GeographyDataType {
  slides?: GeographySlide[];
}

const GeographySection = () => {
  const [geographyData, setGeographyData] = useState<GeographyDataType | null>(null);

  useEffect(() => {
    const fetchGeographyData = async () => {
      try {
        const response = await getGeographyData();

        if (!response.docs || response.docs.length === 0) {
          throw new Error("No geography data available");
        }

        setGeographyData(response.docs[0]);
      } catch (err: unknown) {
        console.error("Error fetching geography data:", err);
      }
    };

    fetchGeographyData();
  }, []);

  // Get the first slide if available
  const firstSlide = geographyData?.slides?.[0];

  // Prepare image URL if available
  const imageUrl = firstSlide?.map?.url
    ? firstSlide.map.url.startsWith("/")
      ? `${API_URL}${firstSlide.map.url}`
      : firstSlide.map.url
    : null;

  return (
    <section className="py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative w-full h-[300px] sm:h-[400px]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={firstSlide?.map?.alt || "География Hett Automotive"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <Image
                  src="/images/geography_map.svg"
                  alt="География Hett Automotive"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-[24px] sm:text-[30px] font-bold roboto-condensed-bold text-black mb-4">
              {firstSlide?.title || "География Hett Automotive"}
            </h2>
            <p className="text-[14px] roboto-condensed-regular text-black mb-6 sm:mb-8">
              {firstSlide?.description ||
                "Одним из главных преимуществ Hett Automotive является её надёжность. Клиенты могут быть уверены в том, что они получат качественные автозапчасти, которые прослужат им долгое время."}
            </p>
            {firstSlide?.buttonText && firstSlide?.buttonLink && (
              <Button
                label={firstSlide.buttonText}
                href={firstSlide.buttonLink}
                variant="primary"
                className="inline-flex w-full sm:w-auto justify-center"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeographySection;
