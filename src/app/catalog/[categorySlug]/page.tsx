"use client";

import React from "react";
import { useParams } from "next/navigation";
import Catalog from "../../../components/Catalog";
import PageDescription from "../../../components/PageDescription";
import SmallBanner from "../../../components/SmallBanner";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  return (
    <>
      <SmallBanner title={categorySlug} />
      <Catalog initialCategory={categorySlug} />
      <PageDescription pageType="catalog" />
    </>
  );
}
