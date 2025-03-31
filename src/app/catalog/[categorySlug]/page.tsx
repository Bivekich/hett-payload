"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import Catalog from "../../../components/Catalog";
import PageDescription from "../../../components/PageDescription";
import SmallBanner from "../../../components/SmallBanner";

// Loading fallback component
const CatalogLoading = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
  </div>
);

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  return (
    <>
      <SmallBanner title={categorySlug} />
      <Suspense fallback={<CatalogLoading />}>
        <Catalog initialCategory={categorySlug} />
      </Suspense>
      <PageDescription pageType="catalog" />
    </>
  );
}
