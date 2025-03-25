import React from "react";
import SmallBanner from "@/components/SmallBanner";
import CustomPageSection from "./CustomPageSection";

interface SectionImage {
  url: string;
  alt?: string;
}

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

interface ContentSection {
  sectionType: string;
  title?: string;
  content?: LexicalContent;
  htmlContent: string;
  image?: SectionImage;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  padding?: string;
}

interface HeroSection {
  enabled?: boolean;
  image?: {
    url: string;
    alt?: string;
  };
  subtitle?: string;
}

interface CustomPageProps {
  title: string;
  heroSection?: HeroSection;
  contentSections: ContentSection[];
}

const CustomPage: React.FC<CustomPageProps> = ({
  title,
  heroSection,
  contentSections,
}) => {
  const showHero = heroSection?.enabled !== false;
  
  return (
    <div>
      {/* Page Title Banner */}
      <SmallBanner 
        title={title} 
        subtitle={showHero ? heroSection?.subtitle : undefined}
        imageSrc={showHero && heroSection?.image ? heroSection.image.url : undefined}
      />
      
      {/* Content Sections */}
      <main>
        {contentSections.map((section, index) => (
          <CustomPageSection
            key={index}
            sectionType={section.sectionType}
            title={section.title}
            content={section.content}
            htmlContent={section.htmlContent}
            image={section.image}
            imagePosition={section.imagePosition}
            backgroundColor={section.backgroundColor}
            padding={section.padding}
          />
        ))}
      </main>
    </div>
  );
};

export default CustomPage; 