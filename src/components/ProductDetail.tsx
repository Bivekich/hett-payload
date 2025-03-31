"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import ProductCard from "./uiKit/ProductCard";
import ProductDetails from "./product/ProductDetails";
import { Product } from "../types/product";
import { getCatalogProducts } from '../services/catalogApi';
import { convertCmsProductToProduct } from "./Catalog";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Extract brand and model for filtering related products
  const { brand, model } = product.attributes;
  
  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // We need to find the brand and model IDs if we have their names
        // This might require additional API calls if we don't have the mapping available

        // Fetch products with the same brand and model by using brand name and model name
        // Since we don't have direct access to IDs, we'll use the search approach
        const filters = {
          limit: 8,  // Fetch more in case we need to filter
          search: `${brand || ''} ${model || ''}`.trim()
        };
        
        // Use the optimized function to prevent n+1 queries
        const response = await getCatalogProducts(filters);
        
        // Filter out the current product and ensure we only get products matching both brand and model
        const filtered = response.docs
          .map(convertCmsProductToProduct)
          .filter(p => {
            // Exclude the current product
            if (p.id === product.id) return false;
            
            // Match on brand AND model if both are provided
            if (brand && model) {
              return (
                p.attributes.brand.toLowerCase() === brand.toLowerCase() && 
                p.attributes.model.toLowerCase() === model.toLowerCase()
              );
            }
            // Match on just brand if only brand is provided
            else if (brand) {
              return p.attributes.brand.toLowerCase() === brand.toLowerCase();
            }
            // Match on just model if only model is provided
            else if (model) {
              return p.attributes.model.toLowerCase() === model.toLowerCase();
            }
            
            return true;
          });
        
        // Limit to 4 products
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      }
    };
    
    fetchRelatedProducts();
  }, [product.id, brand, model]);

  return (
    <div className="bg-[#F5F5F5]">
      <Container>
        <div className=" py-12">
          {/* Product Detail Container */}
          <div className="mb-12">
            <ProductDetails product={product} />
          </div>

          {/* Related Products Section */}
          <div className="mb-12">
            {relatedProducts.length > 0 ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#3B3B3B] font-[Roboto_Condensed]">
                  Похожие товары
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className=""></div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
