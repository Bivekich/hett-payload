"use client";

import React from "react";
import Container from "./Container";
import ProductDetails from "./product/ProductDetails";
import ProductCard from "./uiKit/ProductCard";
import { Product } from "../types/product";
import { boilerplateProducts } from "./Catalog";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  // Extract brand and model for filtering related products
  const { brand, model } = product.attributes;

  // Filter products that match the same brand, model, and modification but exclude current product
  const relatedProducts = boilerplateProducts.filter(
    (p) =>
      p.id !== product.id &&
      p.attributes.brand === brand &&
      p.attributes.model === model
  );

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
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
