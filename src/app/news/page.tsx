"use client";

import React from "react";
import NewsCatalog from "@/components/NewsCatalog";
import SmallBanner from "@/components/SmallBanner";
import PageDescription from "@/components/PageDescription";

const NewsPage = () => {
  return (
    <>
      <SmallBanner title="Новости компании Hett Automotive" />
      <NewsCatalog />
      <PageDescription pageType="news" />
    </>
  );
};

export default NewsPage;
