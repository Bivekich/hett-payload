import React from "react";
import Image from "next/image";
import { lexicalToHtml } from "@/utils/lexicalToHtml";
import { API_URL } from "@/services/api";

// Define a type for lexical content
interface LexicalContent {
  root: {
    children: unknown[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

interface ProductionImage {
  url: string;
  alt?: string;
}

interface ProductionSectionProps {
  title?: string;
  description?: LexicalContent; // Rich text content
  images?: ProductionImage[];
}

const ProductionSection: React.FC<ProductionSectionProps> = ({
  title = "Современные технологии и новое производство",
  description,
  images = [],
}) => {
  // Convert Lexical content to HTML
  const descriptionHtml = description ? lexicalToHtml(description) : "";

  return (
    <section className="w-full bg-[#181818] py-[60px]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="mb-[40px]">
          <h2 className="font-roboto-condensed text-[32px] font-extrabold leading-[1.1] text-white mb-[20px]">
            {title}
          </h2>
          {descriptionHtml && (
            <div
              className="font-roboto-condensed text-[16px] leading-[1.4] text-white"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="aspect-[4/3] relative">
              <Image
                src={image.url.startsWith('/') ? `${API_URL}${image.url}` : image.url}
                alt={image.alt || 'Production image'}
                fill
                className="object-cover rounded-sm"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductionSection;
