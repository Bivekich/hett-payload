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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format the main image URL if it's relative
  let formattedMainImageUrl = mainImageUrl;
  if (formattedMainImageUrl && formattedMainImageUrl.startsWith("/")) {
    formattedMainImageUrl = `${API_URL}${formattedMainImageUrl}`;
  }

  // Filter out thumbnails with no URL and only create valid ones
  // Also format thumbnail URLs if they're relative
  const validThumbnails = thumbnails
    .filter(
      (thumbnail) => thumbnail.url !== null && thumbnail.url !== undefined
    )
    .map((thumbnail, index) => {
      let url = thumbnail.url;
      if (url && url.startsWith("/")) {
        url = `${API_URL}${url}`;
      }
      return { ...thumbnail, url, index };
    });

  // Get the currently selected image URL
  const selectedImageUrl =
    validThumbnails[selectedThumbnail]?.url || formattedMainImageUrl;
  const hasSelectedImage =
    selectedImageUrl && !selectedImageUrl.includes("placehold.co");

  // Log the image URL to help debug
  console.log("Product image URL:", selectedImageUrl);

  return (
    <>
      <div className="flex flex-col justify-start min-w-[240px] w-[590px] max-md:max-w-full">
        {/* Main Product Image - Fixed height container */}
        <div
          className="flex items-center justify-center bg-white h-[400px] border border-gray-100 relative cursor-pointer"
          onClick={() => hasSelectedImage && setIsModalOpen(true)}
        >
          {hasSelectedImage ? (
            // Use Image component with unoptimized for external URLs
            <Image
              src={selectedImageUrl}
              alt="Product"
              className="max-h-full max-w-full object-contain"
              width={590}
              height={590}
              style={{ objectFit: "contain" }}
              unoptimized={!selectedImageUrl.startsWith("/")}
              key={selectedImageUrl} // Add key to force re-render on image change
            />
          ) : (
            <Image
              src={noItemImage}
              alt="No image available"
              width={590}
              height={590}
              className="object-contain border border-gray-100"
              priority
            />
          )}
        </div>

        {/* Thumbnail Images - Only show if there are more than one valid thumbnail */}
        {validThumbnails.length > 1 && (
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
                  <div className="relative w-[70px] h-[70px]">
                    <Image
                      src={thumbnail.url}
                      alt={`Thumbnail ${thumbnail.index + 1}`}
                      className="object-contain"
                      fill
                      unoptimized={!thumbnail.url.startsWith("/")}
                      key={thumbnail.id} // Add key for thumbnails as well
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-200"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal/Lightbox */}
      {isModalOpen && hasSelectedImage && (
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
              src={selectedImageUrl}
              alt="Product"
              className="h-full w-full object-contain"
              width={1200}
              height={1200}
              unoptimized={!selectedImageUrl.startsWith("/")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
