"use client";

import React from "react";
import ImageGallery from "./ImageGallery";
import ProductCharacteristics from "./ProductCharacteristics";
import BuyButtons from "./BuyButtons";
import Description from "./Description";
import { Product, Characteristic, Thumbnail } from "../../types/product";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { oem, brand, model, modification } = product.attributes;

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

  // Create characteristics array for the ProductCharacteristics component
  const characteristics: Characteristic[] = [
    { label: "OEM №", value: oem || "Н/Д" },
    { label: "Марка авто", value: brand || "Н/Д" },
    { label: "Модель", value: model || "Н/Д" },
    { label: "Модификация", value: modification || "Н/Д" },
  ];

  // Descriptive text for the product (this would come from the API in a real app)
  const description = `Hett Automotive стремится предоставлять своим клиентам качественные автозапчасти по доступным ценам. Компания постоянно работает над улучшением своей продукции и расширением ассортимента, чтобы удовлетворить потребности автовладельцев.

Одним из главных преимуществ Hett Automotive является её надёжность. Клиенты могут быть уверены в том, что они получат качественные автозапчасти, которые прослужат им долгое время.`;

  return (
    <div className="flex flex-wrap gap-10 bg-white p-14 max-md:px-5">
      <ImageGallery mainImageUrl={imageUrl} thumbnails={thumbnails} />
      <div className="flex flex-col flex-1 bg-white min-w-[240px] max-md:max-w-full">
        <div className="pb-8">
          <ProductCharacteristics characteristics={characteristics} />
        </div>
        <BuyButtons />
        <Description text={description} />
      </div>
    </div>
  );
};

export default ProductDetails;
