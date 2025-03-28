'use client';

import React, { Suspense } from 'react';
import Catalog from '../../components/Catalog';
import SmallBanner from '../../components/SmallBanner';
import PageDescription from '../../components/PageDescription';

const CatalogPage = () => {
  return (
    <>
      <SmallBanner title="Каталог запчастей Hett Automotive" />
      <Suspense fallback={<div>Загрузка каталога...</div>}>
        <Catalog />
      </Suspense>
      <PageDescription pageType="catalog" />
    </>
  );
};

export default CatalogPage;
