"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import CustomPage from "@/components/custom-pages/CustomPage";
import { getCustomPage } from "@/services/api";
import { lexicalToHtml } from "@/utils/lexicalToHtml";

// Define a type for the LexicalNode content
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
  sectionType?: string;
  title?: string;
  content?: LexicalContent;
  image?: {
    url: string;
    alt?: string;
  };
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  padding?: string;
}

interface HeroSection {
  enabled: boolean;
  subtitle?: string;
  image?: {
    url: string;
    alt?: string;
  };
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  heroSection?: HeroSection;
  contentSections?: ContentSection[];
}

interface ProcessedContentSection {
  sectionType: string;
  title?: string;
  content?: LexicalContent;
  htmlContent: string;
  image?: {
    url: string;
    alt?: string;
  };
  imagePosition: 'left' | 'right';
  backgroundColor: string;
  padding: string;
}

export default function CustomPageRoute() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroSection, setHeroSection] = useState<HeroSection | undefined>(undefined);
  const [contentSections, setContentSections] = useState<ProcessedContentSection[]>([]);
  
  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        console.log(`Rendering custom page for slug: ${slug}`);
        const data = await getCustomPage(slug);

        if (!data) {
          console.error(`Page not found for slug: ${slug}`);
          notFound();
          return;
        }
        
        setPageData(data);
        
        // Process hero section
        if (data.heroSection) {
          setHeroSection({
            enabled: data.heroSection.enabled !== false,
            subtitle: data.heroSection.subtitle || undefined,
            image: data.heroSection.image ? {
              url: data.heroSection.image.url,
              alt: data.heroSection.image.alt || `${data.title} image`
            } : undefined
          });
        }
        
        // Process content sections
        const sections = (data.contentSections || []).map((section: ContentSection) => {
          // Process section content to HTML
          let sectionHtmlContent = '';
          if (section.content) {
            try {
              sectionHtmlContent = lexicalToHtml(section.content);
            } catch (error) {
              console.error('Error converting section content to HTML:', error);
            }
          }
          
          // Process section image if present
          const sectionImage = section.image ? {
            url: section.image.url,
            alt: section.image.alt || 'Section image'
          } : undefined;
          
          return {
            sectionType: section.sectionType || 'content',
            title: section.title,
            content: section.content,
            htmlContent: sectionHtmlContent,
            image: sectionImage,
            imagePosition: section.imagePosition || 'right',
            backgroundColor: section.backgroundColor || 'transparent',
            padding: section.padding || 'medium'
          };
        });
        
        setContentSections(sections);
      } catch (error) {
        console.error(`Error rendering page for slug ${slug}:`, error);
        setError(`Error loading page: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPage();
  }, [slug]);
  
  if (loading) {
    return <div className="p-10 text-center">Loading page...</div>;
  }
  
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!pageData) {
    return notFound();
  }

  return (
    <CustomPage
      title={pageData.title}
      heroSection={heroSection}
      contentSections={contentSections}
    />
  );
} 