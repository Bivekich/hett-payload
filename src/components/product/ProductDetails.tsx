"use client";

import React from 'react';
import { Characteristic, Product, Thumbnail } from '../../types/product';
import ImageGallery from './ImageGallery';
import ProductCharacteristics from './ProductCharacteristics';
import BuyButtons from './BuyButtons';
import Description from './Description';

interface ProductDetailsProps {
  product: Product;
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
    distributors 
  } = product.attributes;

  // Extract the image URL from the product data structure
  const imageUrl = product?.attributes?.image?.data?.attributes?.url;
  const hasRealImage = imageUrl && !imageUrl.includes("placehold.co");

  // Create thumbnails array
  const thumbnails: Thumbnail[] = [
    { id: 1, url: hasRealImage ? imageUrl : null },
    { id: 2, url: null },
    { id: 3, url: null },
    { id: 4, url: null },
    { id: 5, url: null },
  ];

  // Create characteristics array for the ProductCharacteristics component (excluding OEM which is handled separately)
  const characteristics: Characteristic[] = [
    { label: "Марка авто", value: brand || "Н/Д" },
    { label: "Модель", value: model || "Н/Д" },
    { label: "Модификация", value: modification || "Н/Д" },
  ];

  // Add any additional specifications from CMS
  if (specifications && specifications.length > 0) {
    specifications.forEach((spec: any) => {
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
  const otherMarketplaces = marketplaceLinks?.others?.map((marketplace: any) => ({
    name: marketplace.name,
    url: marketplace.url,
    logo: marketplace.logo
  })) || [];

  // Format distributors
  const formattedDistributors = distributors?.map((distributor: any) => ({
    name: distributor.name,
    url: distributor.url,
    location: distributor.location
  })) || [];

  return (
    <div className="flex flex-wrap gap-10 bg-white p-14 max-md:px-5">
      <ImageGallery mainImageUrl={imageUrl} thumbnails={thumbnails} />
      <div className="flex flex-col flex-1 bg-white min-w-[240px] max-md:max-w-full">
        <div className="text-2xl font-bold mb-4">{product.attributes.name}</div>
        <div className="mb-6">
          {product.attributes.article && (
            <p className="text-gray-600 mb-1">Артикул: {product.attributes.article}</p>
          )}
          <p className="text-gray-600 mb-1">Марка: {brand}</p>
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
        <Description text={productDescription} />
      </div>
    </div>
  );
};

export default ProductDetails;
