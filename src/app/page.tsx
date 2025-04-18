import React, { Suspense } from 'react';
import Banner from "@/components/Banner";
import ProductSearchSection from "@/components/ProductSearchSection";
import AboutSection from "@/components/AboutSection";
import NewsSection from "@/components/NewsSection";
import GeographySection from "@/components/GeographySection";

// Simple fallback for the search section
const SearchLoadingFallback = () => (
  <div className="py-8 bg-[#F5F5F5] pb-10">
    <div className="max-w-[1280px] mx-auto px-4 md:px-6">
      <h2 className="text-[28px] md:text-[36px] font-bold roboto-condensed-bold text-black mb-8">
        Загрузка каталога...
      </h2>
      {/* Add skeleton placeholders if desired */}
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Banner />
      <Suspense fallback={<SearchLoadingFallback />}>
        <ProductSearchSection />
      </Suspense>
      <AboutSection />
      <NewsSection />
      <GeographySection />
    </main>
  );
}
