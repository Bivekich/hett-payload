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
      className={`flex flex-col grow text-base leading-snug ${bgColorClass} transition-all duration-300 h-full cursor-pointer p-8 hover:shadow-md`}
    >
      {imageUrl && (
        <div className="relative w-full h-[200px]">
          <Image
            loading="lazy"
            src={imageUrl}
            height={380}
            width={380}
            alt="News article thumbnail"
            className="object-cover rounded-none w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="py-4 flex flex-col justify-between h-full">
        <div>
          <div className={`text-[16px] ${dateColorClass}`}>{date}</div>
          <div
            className={`mt-4 font-semibold leading-6 text-[16px] ${titleColorClass}`}
          >
            {title}
          </div>
        </div>
        <div
          className={`${readMoreColorClass} hover:text-[#2d8c2a] transition-colors text-[16px] mt-6`}
        >
          Читать подробнее
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
