import React from "react";
import ArticleHeader from "./ArticleHeader";
import ArticleContent from "./ArticleContent";
import Container from "../Container";
import SmallBanner from "../SmallBanner";
import { API_URL } from "@/services/api";
import Image from "next/image";

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

// Define interfaces for content sections
interface ContentSection {
  id?: string;
  content: LexicalContent;
  htmlContent?: string;
  image?: {
    url: string;
    alt?: string;
  };
  imagePosition?: 'left' | 'right';
}

interface FirstSection {
  content: LexicalContent;
  htmlContent?: string;
}

interface HettAutomotiveArticleProps {
  date: string;
  title: string;
  previewImage?: {
    url: string;
    alt?: string; 
  };
  firstSection?: FirstSection;
  contentSections?: ContentSection[];
}

const HettAutomotiveArticle: React.FC<HettAutomotiveArticleProps> = ({
  date,
  title,
  previewImage,
  firstSection,
  contentSections,
}) => {
  return (
    <div className="bg-[#F5F5F5]">
      <SmallBanner title={title} />
      <Container>
        <div className="py-8 pb-16">
          {/* Article header and date */}
          <div className="mb-8">
            <ArticleHeader date={date} />
          </div>
          
          {/* First section with fixed layout - image right, text left */}
          {(firstSection || previewImage) && (
            <div className="flex flex-col md:flex-row md:gap-8 mb-12">
              {/* Content */}
              <div className="rich-text-content md:w-1/2 lg:w-3/5">
                {firstSection?.htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: firstSection.htmlContent }} />
                ) : (
                  <div className="text-[16px] leading-[1.4] text-[#1E1E1E] font-[Roboto_Condensed]">
                    {title && <p>{title}</p>}
                  </div>
                )}
              </div>
              
              {/* Preview Image */}
              {previewImage && (
                <div className="mt-6 md:mt-0 md:w-1/2 lg:w-2/5">
                  <div className="overflow-hidden">
                    <Image 
                      src={previewImage.url.startsWith('/') ? `${API_URL}${previewImage.url}` : previewImage.url} 
                      alt={previewImage.alt || 'Article image'} 
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Additional content sections */}
          {contentSections && contentSections.length > 0 && (
            <ArticleContent contentSections={contentSections} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default HettAutomotiveArticle;
