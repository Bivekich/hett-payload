"use client";

import React, { useState, useEffect } from "react";
import ProductDetail from "../../../../components/ProductDetail";
import { boilerplateProducts } from "../../../../components/Catalog";
import { Product } from "../../../../types/product";
import { useParams } from "next/navigation";

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use the useParams hook from next/navigation
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  useEffect(() => {
    if (!slug) return;

    // Find the product with the matching slug
    const foundProduct = boilerplateProducts.find(
      (p) => p.attributes.slug === slug
    );

    if (foundProduct) {
      setProduct(foundProduct);
    }

    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-medium text-red-600 mb-2">
            Товар не найден
          </h2>
          <p className="text-gray-600">
            К сожалению, запрашиваемый вами товар не существует или был удален.
          </p>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
};

export default ProductPage;
