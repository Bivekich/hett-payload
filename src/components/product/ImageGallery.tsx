"use client";

import React, { useState } from "react";
import Image from "next/image";
import noItemImage from "@/assets/noItem.png";
import { Thumbnail } from "../../types/product";
import { API_URL } from "@/services/api";

interface ImageGalleryProps {
  mainImageUrl?: string;
  thumbnails?: Thumbnail[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImageUrl,
  thumbnails = [],
}) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  
  // Format the main image URL if it's relative
  let formattedMainImageUrl = mainImageUrl;
  if (formattedMainImageUrl && formattedMainImageUrl.startsWith('/')) {
    formattedMainImageUrl = `${API_URL}${formattedMainImageUrl}`;
  }
  
  const hasRealImage = formattedMainImageUrl && !formattedMainImageUrl.includes("placehold.co");

  // Filter out thumbnails with no URL and only create valid ones
  // Also format thumbnail URLs if they're relative
  const validThumbnails = thumbnails
    .filter((thumbnail) => thumbnail.url !== null && thumbnail.url !== undefined)
    .map((thumbnail, index) => {
      let url = thumbnail.url;
      if (url && url.startsWith('/')) {
        url = `${API_URL}${url}`;
      }
      return { ...thumbnail, url, index };
    });

  // Log the image URL to help debug
  console.log("Product image URL:", formattedMainImageUrl);

  return (
    <div className="flex flex-col justify-start min-w-[240px] w-[590px] max-md:max-w-full">
      {/* Main Product Image - Fixed height container */}
      <div className="flex items-center justify-center bg-white h-[400px] border border-gray-100">
        {hasRealImage ? (
          // Use a regular img tag for remote URLs to avoid Next.js Image restrictions
          <img
            src={formattedMainImageUrl}
            alt="Product"
            className="max-h-full max-w-full object-contain p-4"
          />
        ) : (
          <Image
            src={noItemImage}
            alt="No image available"
            width={300}
            height={300}
            className="object-contain"
            priority
          />
        )}
      </div>

      {/* Thumbnail Images - Only show if there are valid thumbnails */}
      {validThumbnails.length > 0 && (
        <div className="flex flex-wrap gap-5 mt-6 max-md:max-w-full">
          {validThumbnails.map((thumbnail) => (
            <button
              key={thumbnail.id}
              className={`w-[90px] h-[90px] flex items-center justify-center border ${
                selectedThumbnail === thumbnail.index
                  ? "border-[#38AE34]"
                  : "border-[#B2B2B2]"
              }`}
              onClick={() => setSelectedThumbnail(thumbnail.index)}
            >
              {thumbnail.url ? (
                <img
                  src={thumbnail.url}
                  alt={`Thumbnail ${thumbnail.index + 1}`}
                  className="max-h-[70px] max-w-[70px] object-contain"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
