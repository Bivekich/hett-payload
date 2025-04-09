"use client";

import React, { useEffect, useState } from "react";
import { getAboutData } from "@/services/api";
import { AboutData, AboutResponse, AboutFeature } from "@/types/about";
import HeroSection from "@/components/about/HeroSection";
import FeaturesSection from "@/components/about/FeaturesSection";
import ProductionSection from "@/components/about/ProductionSection";
import BuySection from "@/components/about/BuySection";
import SmallBanner from "../../components/SmallBanner";
import Map from "../contact/components/Map";
import { API_URL } from "@/services/api";

export default function AboutPage() {
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

        // Set page metadata if available
        if (response.docs[0].metaTitle) {
          document.title = response.docs[0].metaTitle;
        }

        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription && response.docs[0].metaDescription) {
          metaDescription.setAttribute(
            "content",
            response.docs[0].metaDescription
          );
        }
      } catch (err: unknown) {
        console.error("Error fetching about data:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Process image URLs to make them absolute if they're relative
  const processImageUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("/") ? `${API_URL}${url}` : url;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">No data available</p>
      </div>
    );
  }

  // Map features to format expected by FeaturesSection
  const mappedFeatures = aboutData.features?.map((feature: AboutFeature) => ({
    title: feature.title,
    description: feature.description,
    icon: feature.icon ? processImageUrl(feature.icon.url) : undefined,
  }));

  return (
    <div className="bg-[#F7F7F7] flex flex-col min-h-screen">
      {/* Top Banner */}
      <SmallBanner 
        title="О компании Hett Automotive"
      />
      
      {/* Hero Section */}
      <HeroSection
        title={aboutData.title}
        description={aboutData.mainContent}
      />

      {/* Features Section */}
      <FeaturesSection
        features={mappedFeatures}
      />
      
      {/* Production Section */}
      {aboutData.productionSection && (
        <ProductionSection
          title={aboutData.productionSection.title}
          description={aboutData.productionSection.description}
          images={aboutData.productionSection.images?.map(item => ({
            url: item.image?.url ? processImageUrl(item.image.url) : '',
            alt: item.alt || item.image?.alt || 'Production image'
          })) || []}
        />
      )}

      {/* Buy Section */}
      {aboutData.buySection && (
        <BuySection 
          buySection={{
            ...aboutData.buySection,
            distributor: aboutData.buySection.distributor ? {
              ...aboutData.buySection.distributor,
              image: aboutData.buySection.distributor.image ? {
                ...aboutData.buySection.distributor.image,
                url: processImageUrl(aboutData.buySection.distributor.image.url)
              } : undefined,
              logo: aboutData.buySection.distributor.logo ? {
                ...aboutData.buySection.distributor.logo,
                url: processImageUrl(aboutData.buySection.distributor.logo.url)
              } : undefined,
              features: aboutData.buySection.distributor.features && aboutData.buySection.distributor.features.length > 0 
                ? aboutData.buySection.distributor.features.map(feature => ({
                    ...feature,
                    customIcon: feature.customIcon ? {
                      ...feature.customIcon,
                      url: processImageUrl(feature.customIcon.url)
                    } : undefined
                  })) 
                : [
                    { text: "Лучшие цены", iconType: "wallet" },
                    { text: "Широкий ассортимент", iconType: "widgets" },
                    { text: "Бесплатный подбор 24/7", iconType: "time" },
                    { text: "Удобная доставка", iconType: "truck" }
                  ]
            } : {
              title: "Официальный дистрибьютор HettAutomotive в России",
              website: "protekauto.ru",
              websiteUrl: "https://protekauto.ru",
              buttonText: "Перейти на сайт",
              buttonUrl: "https://protekauto.ru",
              features: [
                { text: "Лучшие цены", iconType: "wallet" },
                { text: "Широкий ассортимент", iconType: "widgets" },
                { text: "Бесплатный подбор 24/7", iconType: "time" },
                { text: "Удобная доставка", iconType: "truck" }
              ]
            },
            partners: aboutData.buySection.partners?.map(partner => ({
              ...partner,
              logo: partner.logo ? {
                ...partner.logo,
                url: processImageUrl(partner.logo.url)
              } : undefined
            })) || []
          }}
        />
      )}

      {/* Map */}
      <Map />
    </div>
  );
}
