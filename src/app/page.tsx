import Banner from "@/components/Banner";
import ProductSearchSection from "@/components/ProductSearchSection";
import AboutSection from "@/components/AboutSection";
import NewsSection from "@/components/NewsSection";
import GeographySection from "@/components/GeographySection";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Banner />
      <ProductSearchSection />
      <AboutSection />
      <NewsSection />
      <GeographySection />
    </main>
  );
}
