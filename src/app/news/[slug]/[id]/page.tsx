"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import HettAutomotiveArticle from "../../../../components/news/HettAutomotiveArticle";
import { getArticles } from "@/services/api";
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
  id?: string;
  content: LexicalContent;
  htmlContent?: string;
  image?: {
    url: string;
    alt?: string;
  };
  imagePosition?: 'left' | 'right';
}

interface SectionData {
  id?: string;
  content: LexicalContent;
  image?: {
    url: string;
    alt?: string;
  };
  imagePosition?: 'left' | 'right';
}

interface ArticleData {
  id: string;
  title: string;
  date: string;
  slug: string;
  shortDescription?: string;
  previewImage?: {
    url: string;
    alt?: string;
  };
  firstSection?: {
    content: LexicalContent;
  };
  contentSections?: SectionData[];
}

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [newsItem, setNewsItem] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{url: string; alt?: string} | undefined>(undefined);
  const [firstSectionHtml, setFirstSectionHtml] = useState('');
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [date, setDate] = useState('');
  
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        console.log(`Rendering article page for id: ${id}`);
        
        // Fetch all articles without pagination
        const articlesData = await getArticles(0, 0);
        console.log('Fetched articles data:', articlesData);

        if (!articlesData || !articlesData.docs) {
          console.error(`No articles found`);
          notFound();
          return;
        }

        console.log(`Found ${articlesData.docs.length} articles`);
        console.log('Looking for article with id:', id);
        
        // Find the article with the matching id
        const articleData = articlesData.docs.find(article => String(article.id) === String(id));
        console.log('Found article:', articleData);

        if (!articleData) {
          console.error(`Article not found with id: ${id}`);
          notFound();
          return;
        }
        
        setNewsItem(articleData);
        
        // Process preview image
        if (articleData.previewImage) {
          setPreviewImage({
            url: articleData.previewImage.url,
            alt: articleData.previewImage.alt || `${articleData.title} image`
          });
        }
        
        // Process first section if available
        let firstSectionContent = '';
        if (articleData.firstSection && articleData.firstSection.content) {
          try {
            firstSectionContent = lexicalToHtml(articleData.firstSection.content);
            setFirstSectionHtml(firstSectionContent);
          } catch (error) {
            console.error("Error converting first section to HTML:", error);
          }
        }
        
        // Process additional content sections if available
        let sections: ContentSection[] = [];
        
        if (articleData.contentSections && Array.isArray(articleData.contentSections) && articleData.contentSections.length > 0) {
          console.log(`Found ${articleData.contentSections.length} content sections`);
          
          sections = articleData.contentSections.map((section: SectionData) => {
            // Process section content to HTML
            let sectionHtmlContent = '';
            if (section.content) {
              try {
                sectionHtmlContent = lexicalToHtml(section.content);
              } catch (error) {
                console.error('Error converting section content to HTML:', error);
              }
            }
            
            // Process section image
            const sectionImage = section.image ? {
              url: section.image.url,
              alt: section.image.alt || 'Article image'
            } : undefined;
            
            return {
              id: section.id,
              content: section.content,
              htmlContent: sectionHtmlContent,
              image: sectionImage,
              imagePosition: section.imagePosition || 'right'
            };
          });
          
          setContentSections(sections);
        }

        // Format date for display
        if (articleData.date) {
          const formattedDate = new Date(articleData.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          setDate(formattedDate);
        }
        
      } catch (error) {
        console.error(`Error rendering article page for id ${id}:`, error);
        setError(`Error loading article: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticles();
  }, [id]);
  
  if (loading) {
    return <div className="p-10 text-center">Loading article...</div>;
  }
  
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!newsItem) {
    return notFound();
  }

  return (
    <HettAutomotiveArticle
      date={date}
      title={newsItem.title}
      previewImage={previewImage}
      firstSection={firstSectionHtml ? { content: newsItem.firstSection?.content, htmlContent: firstSectionHtml } : undefined}
      contentSections={contentSections}
    />
  );
} 