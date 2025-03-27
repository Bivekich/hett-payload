import React from "react";
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

interface ArticleContentProps {
  contentSections: ContentSection[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ contentSections }) => {
  // CSS styles for rich text content - scoped to article content only
  const richTextStyles = `
    .rich-text-content h1, 
    .rich-text-content h2, 
    .rich-text-content h3, 
    .rich-text-content h4, 
    .rich-text-content h5, 
    .rich-text-content h6 {
      font-family: 'Roboto Condensed', sans-serif;
      font-weight: 700;
      color: #1E1E1E;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .rich-text-content h1:first-child,
    .rich-text-content h2:first-child,
    .rich-text-content h3:first-child,
    .rich-text-content h4:first-child,
    .rich-text-content h5:first-child,
    .rich-text-content h6:first-child {
      margin-top: 0;
    }
    
    .rich-text-content h1 {
      font-size: 2rem;
      line-height: 1.2;
    }
    
    .rich-text-content h2 {
      font-size: 1.75rem;
      line-height: 1.2;
    }
    
    .rich-text-content h3 {
      font-size: 1.5rem;
      line-height: 1.3;
    }
    
    .rich-text-content h4 {
      font-size: 1.25rem;
      line-height: 1.3;
    }
    
    .rich-text-content h5, 
    .rich-text-content h6 {
      font-size: 1.1rem;
      line-height: 1.4;
    }
    
    .rich-text-content p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 1rem;
      font-family: 'Roboto Condensed', sans-serif;
      color: #1E1E1E;
    }
    
    .rich-text-content p:last-child {
      margin-bottom: 0;
    }
    
    .rich-text-content ul, 
    .rich-text-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      padding-left: 0;
    }

    .rich-text-content ul:last-child, 
    .rich-text-content ol:last-child {
      margin-bottom: 0;
    }
    
    .rich-text-content li {
      margin-bottom: 0.5rem;
      font-size: 16px;
      line-height: 1.4;
      font-family: 'Roboto Condensed', sans-serif;
    }
    
    .rich-text-content li:last-child {
      margin-bottom: 0;
    }
    
    .rich-text-content blockquote {
      border-left: 4px solid #38AE34;
      padding-left: 1rem;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 1.5rem;
      font-style: italic;
    }
    
    .rich-text-content blockquote:last-child {
      margin-bottom: 0;
    }
    
    .rich-text-content blockquote p {
      color: #4A4A4A;
    }
    
    .rich-text-content a {
      color: #38AE34;
      text-decoration: none;
    }
    
    .rich-text-content a:hover {
      text-decoration: underline;
    }
    
    .rich-text-content strong {
      font-weight: 700;
    }
    
    .rich-text-content em {
      font-style: italic;
    }
    
    /* Fix spaces between elements */
    .rich-text-content > *:first-child {
      margin-top: 0;
    }
    
    .rich-text-content > *:last-child {
      margin-bottom: 0;
    }
  `;

  return (
    <>
      <style>{richTextStyles}</style>
      <div className="space-y-12">
        {contentSections.map((section, index) => (
          <div 
            key={section.id || index} 
            className={`flex flex-col ${
              section.image ? 'md:flex-row md:gap-8' : ''
            } ${
              section.image && section.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Content */}
            <div className={`rich-text-content ${
              section.image ? 'md:w-1/2 lg:w-3/5' : 'w-full'
            }`}>
              {section.htmlContent ? (
                <div dangerouslySetInnerHTML={{ __html: section.htmlContent }} />
              ) : (
                <div>Fallback content</div>
              )}
            </div>
            
            {/* Optional Image */}
            {section.image && (
              <div className="mt-6 md:mt-0 md:w-1/2 lg:w-2/5">
                <div className="overflow-hidden rounded-md shadow-sm">
                  <img 
                    src={section.image.url.startsWith('/') ? `${API_URL}${section.image.url}` : section.image.url} 
                    alt={section.image.alt || 'Article image'} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ArticleContent;
