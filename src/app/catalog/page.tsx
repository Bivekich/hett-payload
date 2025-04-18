"use client";

import React, { Suspense } from "react";
import Catalog from "../../components/Catalog";
// import Breadcrumbs from "../../components/uiKit/Breadcrumbs";
import SmallBanner from "../../components/SmallBanner";
import PageDescription from "../../components/PageDescription";

// Loading fallback component
const CatalogLoading = () => <div>Загрузка каталога...</div>;

const CatalogPage: React.FC = () => {
  // const breadcrumbs = [
  //   { label: 'Главная', href: '/' },
  //   { label: 'Каталог' },
  // ];

  return (
    <>
      <SmallBanner title="Каталог запчастей Hett Automotive" />
      {/* <Breadcrumbs items={breadcrumbs} /> */}
      <Suspense fallback={<CatalogLoading />}>
        <Catalog initialCategory={undefined} />
      </Suspense>
      <PageDescription pageType="catalog" />
    </>
  );
};

export default CatalogPage;
