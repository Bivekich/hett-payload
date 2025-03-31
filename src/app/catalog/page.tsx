"use client";

import React, { Suspense } from "react";
import Catalog from "../../components/Catalog";
import SmallBanner from "../../components/SmallBanner";
import PageDescription from "../../components/PageDescription";

// Loading fallback component
const CatalogLoading = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
  </div>
);

const CatalogPage = () => {
  return (
    <>
      <SmallBanner title="Каталог запчастей Hett Automotive" />
      <Suspense fallback={<CatalogLoading />}>
        <Catalog />
      </Suspense>
      <PageDescription pageType="catalog" />
    </>
  );
};

export default CatalogPage;
