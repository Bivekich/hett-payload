"use client";

import React from "react";
import Catalog from "../../components/Catalog";
import SmallBanner from "../../components/SmallBanner";
import PageDescription from "../../components/PageDescription";

const CatalogPage = () => {
  return (
    <>
      <SmallBanner title="Каталог запчастей Hett Automotive" />
      <Catalog />
      <PageDescription pageType="catalog" />
    </>
  );
};

export default CatalogPage;
