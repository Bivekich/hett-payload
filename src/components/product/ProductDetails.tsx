"use client";

import React from 'react';
import { Characteristic, Product, Thumbnail } from '../../types/product';
import ImageGallery from './ImageGallery';
import ProductCharacteristics from './ProductCharacteristics';
import BuyButtons from './BuyButtons';
import Description from './Description';
import { API_URL } from '@/services/api';
import { LexicalContent } from '@/utils/lexicalToHtml';

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
    images = []
  } = product.attributes;

  // Join the brand names array into a comma-separated string
  const brandDisplayString = Array.isArray(brand) ? brand.join(', ') : (brand || 'Н/Д');

  // Extract the main image URL and make it absolute if needed
  let mainImageUrl = product?.attributes?.image?.data?.attributes?.url;
  if (mainImageUrl && mainImageUrl.startsWith('/')) {
    mainImageUrl = `${API_URL}${mainImageUrl}`;
  }

  // Create thumbnails array from actual product images
  const thumbnails: Thumbnail[] = [
    // Add the main image first
    { id: 1, url: mainImageUrl || null },
    // Add additional images from the images array
    ...images.map((img, index) => {
      let imgUrl = img.image?.url;
      if (imgUrl && imgUrl.startsWith('/')) {
        imgUrl = `${API_URL}${imgUrl}`;
      }
      return {
        id: index + 2, // Start from 2 since main image is 1
        url: imgUrl || null
      };
    }),
    // Fill remaining slots with null thumbnails if needed
    ...Array(Math.max(0, 4 - images.length)).fill(null).map((_, index) => ({
      id: images.length + 2 + index,
      url: null
    }))
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
      if (spec.name && spec.name.toLowerCase() !== 'oem') { // Skip OEM as it's displayed separately
        characteristics.push({
          label: spec.name,
          value: spec.value || "Н/Д"
        });
      }
    });
  }

  // Extract marketplace links
  const ozonUrl = marketplaceLinks?.ozon || '';
  const wildberriesUrl = marketplaceLinks?.wildberries || '';
  
  // Format other marketplaces
  const otherMarketplaces = marketplaceLinks?.others?.map((marketplace: MarketplaceLink) => ({
    name: marketplace.name,
    url: marketplace.url,
    logo: marketplace.logo
  })) || [];

  // Format distributors
  const formattedDistributors = distributors?.map((distributor: Distributor) => ({
    name: distributor.name,
    url: distributor.url,
    location: distributor.location
  })) || [];

  return (
    <div className="flex flex-wrap gap-10 bg-white p-14 max-md:px-5">
      <ImageGallery mainImageUrl={mainImageUrl} thumbnails={thumbnails} />
      <div className="flex flex-col flex-1 bg-white min-w-[240px] max-md:max-w-full">
        <div className="text-2xl font-bold mb-4">{product.attributes.name}</div>
        <div className="mb-6">
          {product.attributes.article && (
            <p className="text-gray-600 mb-1">Артикул: {product.attributes.article}</p>
          )}
          <p className="text-gray-600 mb-1">Марка: {brandDisplayString}</p>
          <p className="text-gray-600 mb-1">Модель: {model}</p>
          <p className="text-gray-600 mb-1">Модификация: {modification}</p>
          {product.attributes.price && (
            <p className="text-2xl font-bold mt-4">{product.attributes.price} ₽</p>
          )}
        </div>
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
        <Description text={productDescription as (string | LexicalContent)} />
      </div>
    </div>
  );
};

export default ProductDetails;
