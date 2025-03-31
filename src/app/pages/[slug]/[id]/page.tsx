"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import CustomPage from "@/components/custom-pages/CustomPage";
import { getCustomPages } from "@/services/api";
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
  const id = params.id as string;
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroSection, setHeroSection] = useState<HeroSection | undefined>(undefined);
  const [contentSections, setContentSections] = useState<ProcessedContentSection[]>([]);
  
  useEffect(() => {
    async function fetchAndProcessPageData() {
      if (!id) {
        console.log("No ID found in params, waiting...");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching all custom pages (full data) to find page with id: ${id}`);
        
        const allPagesData = await getCustomPages(0, 0);
        console.log('Fetched all custom pages data:', allPagesData);

        if (!allPagesData || allPagesData.length === 0) {
          console.error(`No custom pages found or empty response from API`);
          setError("Could not load page data.");
          return;
        }

        console.log(`Found ${allPagesData.length} custom pages in total.`);
        
        const data = allPagesData.find(page => String(page.id) === String(id));
        console.log('Found full page data by ID:', data);

        if (!data) {
          console.error(`Page not found with id: ${id} among fetched custom pages.`);
          notFound();
          return;
        }
        
        console.log("Processing full page data for:", data.title, data.slug);
        setPageData(data);
        
        if (data.heroSection) {
          setHeroSection({
            enabled: data.heroSection.enabled !== false,
            subtitle: data.heroSection.subtitle || undefined,
            image: data.heroSection.image ? {
              url: data.heroSection.image.url,
              alt: data.heroSection.image.alt || `${data.title} image`
            } : undefined
          });
        } else {
          setHeroSection(undefined);
        }
        
        const sections = (data.contentSections || []).map((section: ContentSection) => {
          let sectionHtmlContent = '';
          if (section.content) {
            try {
              sectionHtmlContent = lexicalToHtml(section.content);
            } catch (error) {
              console.error('Error converting section content to HTML:', error);
            }
          }
          
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
          } as ProcessedContentSection;
        });
        setContentSections(sections);
        
      } catch (err) {
        console.error(`Error fetching or processing custom page for id ${id}:`, err);
        setError(`Failed to load page: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAndProcessPageData();
  }, [id]);
  
  if (loading) {
    return <div className="p-10 text-center">Loading page...</div>;
  }
  
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!pageData) {
    console.log("Page data is null after load, rendering not found.");
    notFound();
    return null;
  }

  return (
    <CustomPage
      title={pageData.title}
      heroSection={heroSection}
      contentSections={contentSections}
    />
  );
} 