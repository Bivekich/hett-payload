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
            className="relative max-w-[90vw] max-h-[90vh] bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white hover:text-[#38AE34] transition-colors p-2"
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
              className="max-h-[85vh] w-auto object-contain"
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
