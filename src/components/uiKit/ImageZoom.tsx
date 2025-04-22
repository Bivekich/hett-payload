"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  style?: React.CSSProperties;
}

const ImageZoom: React.FC<ImageZoomProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  sizes,
  priority,
  unoptimized,
  style,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className={`${className || ""} cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          style={style}
        />
      </div>

      {/* Image Modal/Lightbox */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-[90vw] h-[90vw] md:w-[70vw] md:h-[70vw] lg:w-[50vw] lg:h-[50vw] bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 z-10 text-[#38AE34] bg-white/60 rounded-full hover:bg-white/90 hover:text-black transition-colors p-1"
              onClick={() => setIsModalOpen(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              className="h-full w-full object-contain"
              width={1200}
              height={1200}
              unoptimized={unoptimized}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageZoom;
