import React from "react";
import { lexicalToHtml } from "@/utils/lexicalToHtml";
import Container from "../Container";

// Define a type for the lexical content
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

interface HeroSectionProps {
  title?: string;
  description?: LexicalContent; // Rich text content from CMS
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "О производителе Hett Automotive",
  description,
}) => {
  // Convert Lexical content to HTML if available
  const descriptionHtml = description ? lexicalToHtml(description) : null;
  
  // Default description as fallback if none provided from CMS
  const defaultDescription = `Hett Automotive стремится предоставлять своим клиентам качественные
  автозапчасти по доступным ценам. Компания постоянно работает над
  улучшением своей продукции и расширением ассортимента, чтобы
  удовлетворить потребности автовладельцев.
  <br />
  <br />
  Одним из главных преимуществ Hett Automotive является её надёжность.
  Клиенты могут быть уверены в том, что они получат качественные
  автозапчасти, которые прослужат им долгое время.`;

  return (
    <section className="w-full pt-[40px] pb-[60px]">
      <Container>
        <div className="max-w-[800px]">
          <h1 className="font-roboto-condensed text-[32px] font-extrabold leading-[1.1] text-black mb-[40px]">
            {title}
          </h1>
          {descriptionHtml ? (
            <div 
              className="font-roboto-condensed text-[16px] leading-[1.4] text-black"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p 
              className="font-roboto-condensed text-[16px] leading-[1.4] text-black"
              dangerouslySetInnerHTML={{ __html: defaultDescription }}
            />
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
