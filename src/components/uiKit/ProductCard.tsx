"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Image from "next/image";
import noItemImage from "@/assets/noItem.png";
import { API_URL } from "@/services/api";
import { useRouter } from "next/navigation";

// Product attribute interfaces
interface ProductAttributes {
  name: string;
  article: string;
  oem: string;
  brand: string | string[];
  model: string;
  slug: string;
  image?: {
    data?: {
      attributes?: {
        url?: string;
      };
    };
  };
}

interface Product {
  id: number;
  attributes: ProductAttributes;
}

interface ProductCardProps {
  product: Product;
}

interface ProductDetailsProps {
  oemNumber: string;
  brand: string | string[];
  model: string;
}

// ProductDetails component for displaying OEM, brand, and model information
const ProductDetails: React.FC<ProductDetailsProps> = ({
  oemNumber,
  brand,
  model,
}) => {
  // Format brand for display (join if array)
  const displayBrand = Array.isArray(brand) ? brand.join(", ") : brand;

  return (
    <div className="grid grid-cols-2 gap-2 w-full text-sm font-[Roboto_Condensed]">
      <div className="text-[#181818]">
        <div>OEM №</div>
        <div>Марка авто</div>
        <div>Модель</div>
      </div>
      <div className="text-[#181818]">
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">{oemNumber}</div>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">{displayBrand}</div>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">{model}</div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { name, article, oem, brand, model, slug } = product.attributes;

  // Extract the image URL from the product data structure
  let imageUrl = product?.attributes?.image?.data?.attributes?.url;

  // Make URL absolute if it's relative
  if (imageUrl && imageUrl.startsWith("/")) {
    imageUrl = `${API_URL}${imageUrl}`;
  }

  // Check if the image URL is from a placeholder service, in which case we'll use noItem.png
  const isPlaceholderImage = imageUrl?.includes("placehold.co");

  // Only use the actual image URL if it exists and is not a placeholder
  const hasRealImage = imageUrl && !isPlaceholderImage;

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on the button
    if (!(e.target as HTMLElement).closest(".card-button")) {
      router.push(`/catalog/product/${slug}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-none overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Fixed height container for consistent image size */}
      <div className="flex items-center justify-center h-[210px] p-4relative">
        {hasRealImage ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-contain pt-7"
            width={250}
            height={200}
            style={{ objectFit: "contain" }}
            unoptimized={!imageUrl.startsWith("/")}
          />
        ) : (
          <Image
            src={noItemImage}
            alt="No image available"
            width={250}
            height={200}
            className="object-contain pt-11 pb-4"
            priority
          />
        )}
      </div>
      <div className="p-6 flex flex-col gap-6 flex-grow">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-extrabold font-[Roboto_Condensed] text-[#181818] line-clamp-2 min-h-[48px]">
            {name}
          </h3>
          <div className="text-xs text-[#8898A4] my-2 font-[Roboto_Condensed]">
            {article && `Артикул: ${article}`}
          </div>
          <ProductDetails oemNumber={oem} brand={brand} model={model} />
        </div>
        <div className="mt-auto card-button">
          <Button
            label="Подробнее о товаре"
            href={`/catalog/product/${slug}`}
            variant="primary"
            className="w-full font-[Roboto_Condensed]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
