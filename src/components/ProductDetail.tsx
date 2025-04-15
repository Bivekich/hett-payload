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
  
  // Convert brand to array if it's a string
  const brandArray = typeof brand === 'string' ? [brand] : brand;
  
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
          search: `${brandArray ? brandArray.join(' ') : ''} ${model || ''}`.trim()
        };
        
        // Use the optimized function to prevent n+1 queries
        const response = await getCatalogProducts(filters);
        
        // Filter out the current product and ensure we only get products matching both brand and model
        const filtered = response.docs
          .map(p => {
            const converted = convertCmsProductToProduct(p);
            // Get modification from the original CMS product
            const modification = typeof p.modification === 'string' 
              ? p.modification 
              : p.modification?.name || '';
            
            // Ensure all required fields are present according to ProductAttributes interface
            return {
              id: converted.id,
              attributes: {
                name: converted.attributes.name || '',
                slug: converted.attributes.slug || '',
                article: converted.attributes.article || '',
                brand: Array.isArray(converted.attributes.brand) 
                  ? converted.attributes.brand 
                  : [converted.attributes.brand || ''],
                model: converted.attributes.model || '',
                modification,
                oem: converted.attributes.oem || '',
                image: converted.attributes.image,
                description: converted.attributes.description,
                specifications: converted.attributes.specifications,
                marketplaceLinks: converted.attributes.marketplaceLinks,
                distributors: converted.attributes.distributors
              }
            } as Product;
          })
          .filter(p => {
            // Exclude the current product
            if (p.id === product.id) return false;
            
            // Convert product's brand to array if it's a string
            const pBrandArray = typeof p.attributes.brand === 'string' ? [p.attributes.brand] : p.attributes.brand;
            
            // Match on brand AND model if both are provided
            if (brandArray && brandArray.length > 0 && model) {
              // Check if any of the brands match (case insensitive)
              const brandMatch = pBrandArray.some(pb => 
                brandArray.some(b => 
                  pb.toLowerCase() === b.toLowerCase()
                )
              );
              
              return brandMatch && 
                typeof p.attributes.model === 'string' && 
                typeof model === 'string' && 
                p.attributes.model.toLowerCase() === model.toLowerCase();
            }
            // Match on just brand if only brand is provided
            else if (brandArray && brandArray.length > 0) {
              return pBrandArray.some(pb => 
                brandArray.some(b => 
                  pb.toLowerCase() === b.toLowerCase()
                )
              );
            }
            // Match on just model if only model is provided
            else if (model) {
              return typeof p.attributes.model === 'string' && 
                typeof model === 'string' && 
                p.attributes.model.toLowerCase() === model.toLowerCase();
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
  }, [product.id, brandArray, model]);

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
