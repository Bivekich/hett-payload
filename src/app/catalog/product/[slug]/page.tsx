"use client";

import React, { useState, useEffect } from "react";
import ProductDetail from "../../../../components/ProductDetail";
import { boilerplateProducts } from "../../../../components/Catalog";
import { Product } from "../../../../types/product";
import { useParams } from "next/navigation";
import { getProduct } from "../../../../services/catalogApi";
import { Product as CmsProduct } from "../../../../types/catalog";
import { API_URL } from "@/services/api";

// Helper function to convert CMS product to frontend product format
const convertCmsProductToProduct = (cmsProduct: CmsProduct): Product => {
  // Process image URL to ensure it's absolute
  let imageUrl = '';
  if (cmsProduct.images && cmsProduct.images.length > 0) {
    if (typeof cmsProduct.images[0].image === 'string') {
      imageUrl = cmsProduct.images[0].image;
    } else {
      imageUrl = cmsProduct.images[0].image?.url || '';
    }
    
    // Make URL absolute if it's relative
    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${API_URL}${imageUrl}`;
    }
  }
  
  return {
    id: parseInt(cmsProduct.id),
    attributes: {
      name: cmsProduct.name,
      slug: cmsProduct.slug,
      article: cmsProduct.sku || '',
      price: cmsProduct.price ? cmsProduct.price.toString() : '',
      brand: typeof cmsProduct.brand === 'string' ? cmsProduct.brand : cmsProduct.brand?.name || '',
      model: typeof cmsProduct.model === 'string' ? cmsProduct.model : cmsProduct.model?.name || '',
      modification: typeof cmsProduct.modification === 'string' ? cmsProduct.modification : cmsProduct.modification?.name || '',
      oem: cmsProduct.oem || '',
      image: {
        data: {
          attributes: {
            url: imageUrl,
          },
        },
      },
      // Pass the rich text description directly
      description: cmsProduct.description || undefined,
      
      // Map specifications from CMS
      specifications: cmsProduct.specifications?.map(spec => ({
        name: spec.name,
        value: spec.value
      })) || [],
      
      // Map marketplace links
      marketplaceLinks: {
        ozon: cmsProduct.marketplaceLinks?.ozon || '',
        wildberries: cmsProduct.marketplaceLinks?.wildberries || '',
        others: cmsProduct.marketplaceLinks?.others?.map(m => ({
          name: m.name,
          url: m.url,
          logo: m.logo
        })) || []
      },
      
      // Map distributors
      distributors: cmsProduct.distributors?.map(d => ({
        name: d.name,
        url: d.url,
        location: d.location
      })) || []
    },
  };
};

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use the useParams hook from next/navigation
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        // Try fetching from CMS
        try {
          // For a single product, we need more details, so we'll use depth=2
          // but we'll modify the getProduct function to be more efficient
          const cmsProduct = await getProduct(slug as string);
          if (cmsProduct) {
            const convertedProduct = convertCmsProductToProduct(cmsProduct);
            setProduct(convertedProduct);
            setIsLoading(false);
            return;
          } else {
            setError("Товар не найден");
          }
        } catch (error) {
          console.error("Error fetching product from CMS:", error);
          setError("Ошибка загрузки товара");
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Ошибка загрузки товара");
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
      </div>
    );
  }

  if (error || !product) {
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
