import React from "react";
import Image from "next/image";

interface ArticleImageProps {
  src: string;
  alt: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt }) => {
  return (
    <div className="hidden md:block md:min-w-[380px] lg:min-w-[480px] xl:min-w-[520px] md:max-w-[480px] h-auto sticky top-4">
      <div className="overflow-hidden rounded-md relative mt-8 aspect-video">
        <Image 
          src={src} 
          alt={alt} 
          className="object-contain" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
        />
      </div>
    </div>
  );
};

export default ArticleImage;
