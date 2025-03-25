import React from "react";

interface ArticleImageProps {
  src: string;
  alt: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt }) => {
  return (
    <div className="hidden md:block md:min-w-[380px] lg:min-w-[480px] xl:min-w-[520px] md:max-w-[480px] h-auto sticky top-4">
      <div className="overflow-hidden rounded-md">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto object-contain mt-8" 
        />
      </div>
    </div>
  );
};

export default ArticleImage;
