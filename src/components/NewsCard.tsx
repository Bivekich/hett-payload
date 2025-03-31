import React from "react";
import Image from "next/image";

interface NewsCardProps {
  imageUrl?: string;
  date: string;
  title: string;
  variant?: "dark" | "white";
}

const NewsCard: React.FC<NewsCardProps> = ({
  imageUrl,
  date,
  title,
  variant = "dark",
}) => {
  const bgColorClass = variant === "white" ? "bg-white" : "bg-transparent";
  const titleColorClass = variant === "white" ? "text-[#1E1E1E]" : "text-white";
  const dateColorClass =
    variant === "white" ? "text-[#38AE34]" : "text-[#38AE34]";
  const readMoreColorClass =
    variant === "white" ? "text-[#38AE34]" : "text-[#38AE34]";

  return (
    <div
      className={`flex flex-col grow p-4 text-base leading-snug ${bgColorClass} hover:shadow-lg transition-all duration-300 h-full cursor-pointer`}
    >
      {imageUrl && (
        <div className="relative w-full aspect-[2.11]">
          <Image
            loading="lazy"
            src={imageUrl}
            alt="News article thumbnail"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className={`self-start mt-5 text-[16px] ${dateColorClass}`}>
        {date}
      </div>
      <div
        className={`mt-5 font-semibold leading-6 text-[16px] ${titleColorClass}`}
      >
        {title}
      </div>
      <div
        className={`self-start mt-8 ${readMoreColorClass} hover:text-[#2d8c2a] transition-colors flex h-full items-end text-[16px]`}
      >
        Читать подробнее
      </div>
    </div>
  );
};

export default NewsCard;
