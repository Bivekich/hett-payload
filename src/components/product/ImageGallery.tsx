"use client";

import React, { useState } from "react";
import Image from "next/image";
import noItemImage from "@/assets/noItem.png";
import { Thumbnail } from "../../types/product";

interface ImageGalleryProps {
  mainImageUrl?: string;
  thumbnails?: Thumbnail[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImageUrl,
  thumbnails = [],
}) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const hasRealImage = mainImageUrl && !mainImageUrl.includes("placehold.co");

  // Filter out thumbnails with no URL and only create valid ones
  const validThumbnails = thumbnails
    .filter((thumbnail) => thumbnail.url !== null)
    .map((thumbnail, index) => ({ ...thumbnail, index }));

  return (
    <div className="flex flex-col justify-start min-w-[240px] w-[590px] max-md:max-w-full">
      {/* Main Product Image */}
      <div className="flex items-center justify-center max-w-full w-full">
        {hasRealImage ? (
          <img
            src={mainImageUrl}
            alt="Product"
            className="object-contain max-h-full max-w-full"
          />
        ) : (
          <Image
            src={noItemImage}
            alt="No image available"
            width={590}
            height={300}
            className="object-contain"
          />
        )}
      </div>

      {/* Thumbnail Images - Only show if there are valid thumbnails */}
      {validThumbnails.length > 0 && (
        <div className="flex flex-wrap gap-5 mt-10 max-md:max-w-full">
          {validThumbnails.map((thumbnail) => (
            <button
              key={thumbnail.id}
              className={`w-[90px] flex items-center justify-center border ${
                selectedThumbnail === thumbnail.index
                  ? "border-[#38AE34]"
                  : "border-[#B2B2B2]"
              }`}
              onClick={() => setSelectedThumbnail(thumbnail.index)}
            >
              <img
                src={thumbnail.url || ""}
                alt={`Thumbnail ${thumbnail.index + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
