import React from "react";
import { API_URL } from "@/services/api";
import Image from "next/image";

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

interface CustomPageSectionProps {
  sectionType: string;
  title?: string;
  content?: LexicalContent;
  htmlContent: string;
  image?: SectionImage;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  padding?: string;
}

const CustomPageSection: React.FC<CustomPageSectionProps> = ({
  sectionType,
  title,
  htmlContent,
  image,
  imagePosition = 'right',
  backgroundColor = 'transparent',
  padding = 'medium'
}) => {
  // CSS styles for rich text content - scoped to section content only
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
      margin-bottom: 1rem;
      margin-top: 2rem;
      font-size: 1.5rem;
      line-height: 1.2;
    }
    
    .rich-text-content h1:first-child,
    .rich-text-content h2:first-child,
    .rich-text-content h3:first-child,
    .rich-text-content h4:first-child,
    .rich-text-content h5:first-child,
    .rich-text-content h6:first-child {
      margin-top: 0;
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
      margin: 0 0 1.5rem 0;
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
      transition: text-decoration 0.2s;
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

    /* Fix spacing between consecutive elements */
    .rich-text-content > *:first-child {
      margin-top: 0;
    }
    
    .rich-text-content > *:last-child {
      margin-bottom: 0;
    }
  `;

  // Background color classes
  const bgColorClass = 
    backgroundColor === 'white' ? 'bg-white' :
    backgroundColor === 'light-gray' ? 'bg-[#F5F5F5]' :
    backgroundColor === 'dark' ? 'bg-[#181818] text-white' :
    backgroundColor === 'primary' ? 'bg-[#38AE34] text-white' :
    '';
  
  // Padding classes
  const paddingClass = 
    padding === 'small' ? 'py-6' :
    padding === 'large' ? 'py-16' :
    'py-12'; // medium (default)

  return (
    <div className={`${bgColorClass} ${paddingClass}`}>
      <style>{richTextStyles}</style>
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Section Title */}
        {title && (
          <h2 className="text-[28px] font-extrabold font-[Roboto_Condensed] mb-6">
            {title}
          </h2>
        )}
        
        {/* Content based on section type */}
        {sectionType === 'content' ? (
          <div className="rich-text-content">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        ) : (
          <div 
            className={`flex flex-col ${
              image ? 'md:flex-row md:gap-8' : ''
            } ${
              image && imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Text Content */}
            <div className={`rich-text-content ${
              image ? 'md:w-1/2 lg:w-3/5' : 'w-full'
            }`}>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
            
            {/* Optional Image */}
            {image && (
              <div className="mt-6 md:mt-0 md:w-1/2 lg:w-2/5">
                <div className="overflow-hidden">
                  <Image 
                    src={image.url.startsWith('/') ? `${API_URL}${image.url}` : image.url} 
                    alt={image.alt || 'Section image'} 
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPageSection; 