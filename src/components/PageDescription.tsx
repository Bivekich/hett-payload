import React, { useEffect, useState } from 'react';
import { getPageDescription } from '@/services/api';
import { lexicalToHtml } from '@/utils/lexicalToHtml';

// Import type definition from utils/lexicalToHtml.ts
type LexicalContent = {
  root: {
    children: unknown[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
};

interface PageDescriptionProps {
  pageType: 'catalog' | 'news';
}

interface ParagraphContent {
  paragraph: LexicalContent;
}

interface PageDescriptionData {
  id: string;
  pageType: 'catalog' | 'news';
  title: string;
  content: ParagraphContent[];
}

const PageDescription: React.FC<PageDescriptionProps> = ({ pageType }) => {
  const [description, setDescription] = useState<PageDescriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const data = await getPageDescription(pageType);
        setDescription(data);
      } catch (error) {
        console.error(`Error fetching ${pageType} description:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [pageType]);

  // CSS to correctly style rich text content
  const richTextStyles = `
    .rich-text-content p {
      margin-bottom: 1rem;
    }
    .rich-text-content p:last-child {
      margin-bottom: 0;
    }
    .rich-text-content h1, 
    .rich-text-content h2, 
    .rich-text-content h3, 
    .rich-text-content h4, 
    .rich-text-content h5, 
    .rich-text-content h6 {
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    .rich-text-content ul, 
    .rich-text-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .rich-text-content li {
      margin-bottom: 0.5rem;
    }
    .rich-text-content blockquote {
      border-left: 4px solid #38AE34;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
    }
    .rich-text-content a {
      color: #38AE34;
      text-decoration: none;
    }
    .rich-text-content a:hover {
      text-decoration: underline;
    }
  `;

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Fallback to static content if no description is found
  if (!description) {
    return (
      <section className="py-4 bg-white pb-6 relative z-[5] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
          <div className="flex gap-8 items-center relative">
            <div className="w-full lg:max-w-[800px] relative">
              <h2 className="text-[32px] font-bold roboto-condensed-bold text-black mb-6">
                О производителе Hett Automotive
              </h2>
              <div className="text-[16px] roboto-condensed-regular text-black space-y-4 mb-8">
                <p>
                  Hett Automotive стремится предоставлять своим клиентам
                  качественные автозапчасти по доступным ценам. Компания постоянно
                  работает над улучшением своей продукции и расширением
                  ассортимента, чтобы удовлетворить потребности автовладельцев.
                </p>
                <p>
                  Одним из главных преимуществ Hett Automotive является её
                  надёжность. Клиенты могут быть уверены в том, что они получат
                  качественные автозапчасти, которые прослужат им долгое время.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-white pb-6 relative z-[5] overflow-hidden">
      <style>{richTextStyles}</style>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
        <div className="flex gap-8 items-center relative">
          <div className="w-full lg:max-w-[800px] relative">
            <h2 className="text-[32px] font-bold roboto-condensed-bold text-black mb-6">
              {description.title}
            </h2>
            <div className="text-[16px] roboto-condensed-regular text-black mb-8 rich-text-content">
              {description.content.map((item, index) => {
                const htmlContent = lexicalToHtml(item.paragraph);
                return (
                  <div key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} className="mb-4" />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageDescription; 