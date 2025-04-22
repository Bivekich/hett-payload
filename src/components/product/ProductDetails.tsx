"use client";

import React from "react";
import { Characteristic, Product, Thumbnail } from "../../types/product";
import ImageGallery from "./ImageGallery";
import ProductCharacteristics from "./ProductCharacteristics";
import BuyButtons from "./BuyButtons";
import Description from "./Description";
import { API_URL } from "@/services/api";
import { LexicalContent } from "@/utils/lexicalToHtml";

interface ProductDetailsProps {
  product: Product;
}

// Define interfaces for specifications and marketplace data
interface Specification {
  name: string;
  value: string;
}

interface MarketplaceLink {
  name: string;
  url: string;
  logo?: string;
}

interface Distributor {
  name: string;
  url: string;
  location?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const {
    oem,
    brand,
    model,
    modification,
    description: productDescription,
    specifications,
    marketplaceLinks,
    distributors,
    images = [],
  } = product.attributes;

  // Join the brand names array into a comma-separated string
  const brandDisplayString = Array.isArray(brand)
    ? brand.join(", ")
    : brand || "Н/Д";

  // Extract the main image URL and make it absolute if needed
  let mainImageUrl = product?.attributes?.image?.data?.attributes?.url;
  if (mainImageUrl && mainImageUrl.startsWith("/")) {
    mainImageUrl = `${API_URL}${mainImageUrl}`;
  }

  // Create thumbnails array from actual product images
  // First, create a set of URLs from the main image to easily check for duplicates
  const mainImageUrls = new Set<string>();
  if (mainImageUrl) {
    mainImageUrls.add(mainImageUrl);
  }

  const thumbnails: Thumbnail[] = [
    // Add the main image first if it exists
    ...(mainImageUrl ? [{ id: 1, url: mainImageUrl }] : []),
    // Add additional images from the images array, filtering out duplicates
    ...images
      .map((img, index) => {
        let imgUrl = "";
        // Handle different image formats
        if (typeof img === "string") {
          imgUrl = img;
        } else if (img.image?.url) {
          imgUrl = img.image.url;
        } else if (typeof img.image === "string") {
          imgUrl = img.image;
        }

        // Make URL absolute if it's relative
        if (imgUrl && imgUrl.startsWith("/")) {
          imgUrl = `${API_URL}${imgUrl}`;
        }

        return {
          id: mainImageUrl ? index + 2 : index + 1, // Start from 2 if main image exists, otherwise from 1
          url: imgUrl || null,
        };
      })
      // Filter out thumbnails with no URL AND those that duplicate the main image
      .filter((thumb) => thumb.url && !mainImageUrls.has(thumb.url)),
  ];

  // Create characteristics array for the ProductCharacteristics component
  const characteristics: Characteristic[] = [
    { label: "Марка авто", value: brandDisplayString },
    { label: "Модель", value: model || "Н/Д" },
    { label: "Модификация", value: modification || "Н/Д" },
  ];

  // Add any additional specifications from CMS
  if (specifications && specifications.length > 0) {
    specifications.forEach((spec: Specification) => {
      if (spec.name && spec.name.toLowerCase() !== "oem") {
        // Skip OEM as it's displayed separately
        characteristics.push({
          label: spec.name,
          value: spec.value || "Н/Д",
        });
      }
    });
  }

  // Extract marketplace links
  const ozonUrl = marketplaceLinks?.ozon || "";
  const wildberriesUrl = marketplaceLinks?.wildberries || "";

  // Format other marketplaces
  const otherMarketplaces =
    marketplaceLinks?.others?.map((marketplace: MarketplaceLink) => ({
      name: marketplace.name,
      url: marketplace.url,
      logo: marketplace.logo,
    })) || [];

  // Format distributors
  const formattedDistributors =
    distributors?.map((distributor: Distributor) => ({
      name: distributor.name,
      url: distributor.url,
      location: distributor.location,
    })) || [];

  return (
    <div className="flex flex-wrap gap-10 bg-white p-14 max-md:px-5">
      <ImageGallery mainImageUrl={mainImageUrl} thumbnails={thumbnails} />
      <div className="flex flex-col flex-1 bg-white min-w-[240px] max-md:max-w-full">
        <div className="pb-8">
          <ProductCharacteristics
            characteristics={characteristics}
            oemNumber={oem}
          />
        </div>
        <BuyButtons
          ozonUrl={ozonUrl}
          wildberriesUrl={wildberriesUrl}
          marketplaces={otherMarketplaces}
          distributors={formattedDistributors}
        />
        <Description text={productDescription as string | LexicalContent} />
      </div>
    </div>
  );
};

export default ProductDetails;
