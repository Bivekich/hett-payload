"use client";

import React, { useState } from "react";
import CategoryCard from "./CategoryCard";
import Button from "./uiKit/Button";
import Select from "./uiKit/Select";
import VinRequestModal from "./uiKit/VinRequestModal";

// Category data
const categories = [
  {
    id: 1,
    title: "Аккумуляторы",
    iconSrc: "/images/battery_icon.svg",
    href: "/catalog/batteries",
  },
  {
    id: 2,
    title: "Кузовные элементы",
    iconSrc: "/images/body_parts_icon.svg",
    href: "/catalog/body-parts",
  },
  {
    id: 3,
    title: "Автомобильные диски и шины",
    iconSrc: "/images/wheels_tires_icon.svg",
    href: "/catalog/wheels-tires",
  },
  {
    id: 4,
    title: "Запасные части для ходовой части",
    iconSrc: "/images/chassis_parts_icon.svg",
    href: "/catalog/chassis-parts",
  },
  {
    id: 5,
    title: "Автомобильные аксессуары",
    iconSrc: "/images/accessories_icon.svg",
    href: "/catalog/accessories",
  },
];

// Options for select dropdowns
const brandOptions = [
  { value: "audi", label: "Audi" },
  { value: "bmw", label: "BMW" },
  { value: "mercedes", label: "Mercedes" },
];

const modelOptions = [
  { value: "model1", label: "Модель 1" },
  { value: "model2", label: "Модель 2" },
  { value: "model3", label: "Модель 3" },
];

const modificationOptions = [
  { value: "mod1", label: "Модификация 1" },
  { value: "mod2", label: "Модификация 2" },
  { value: "mod3", label: "Модификация 3" },
];

const categoryOptions = [
  { value: "cat1", label: "Двигатель" },
  { value: "cat2", label: "Трансмиссия" },
  { value: "cat3", label: "Кузов" },
];

const ProductSearchSection = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModification, setSelectedModification] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);

  return (
    <section className="py-8 bg-[#F5F5F5] pb-10">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-[28px] md:text-[36px] font-bold roboto-condensed-bold text-black mb-8">
          Каталог Hett Automotive
        </h2>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left column: Search bar and filters */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Search bar */}
              <div className="flex gap-2.5 items-center h-[42px] px-5 border border-[#8898A4] hover:border-[#38AE34] focus-within:border-[#38AE34] transition-colors group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#555555] group-focus-within:text-[#38AE34] transition-colors w-6 aspect-square"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Поиск по названию или артикулу"
                  className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  value={selectedBrand}
                  onChange={(value) => setSelectedBrand(value)}
                  placeholder="Марка"
                  options={brandOptions}
                />

                <Select
                  value={selectedModel}
                  onChange={(value) => setSelectedModel(value)}
                  placeholder="Модель"
                  options={modelOptions}
                  disabled={!selectedBrand}
                />

                <Select
                  value={selectedModification}
                  onChange={(value) => setSelectedModification(value)}
                  placeholder="Модификация"
                  options={modificationOptions}
                  disabled={!selectedModel}
                />

                <Select
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  placeholder="Категория"
                  options={categoryOptions}
                />
              </div>
            </div>

            {/* Right column: VIN and Find buttons */}
            <div className="flex flex-col gap-4 lg:w-[200px]">
              <Button
                label="Запрос по VIN"
                variant="noArrow"
                className="flex justify-center items-center"
                hideArrow
                onClick={() => setIsVinModalOpen(true)}
              />
              <Button
                label="Найти"
                href="/catalog"
                variant="primary"
                className="flex justify-center items-center"
                hideArrow
              />
            </div>
          </div>
        </div>

        {/* VIN Request Modal */}
        <VinRequestModal
          isOpen={isVinModalOpen}
          onClose={() => setIsVinModalOpen(false)}
        />

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              iconSrc={category.iconSrc}
              href={category.href}
            />
          ))}
        </div>

        {/* Catalog button */}
        <div className="flex mb-4">
          <Button
            label="Весь каталог Hett Automotive"
            href="/catalog"
            className="inline-block"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductSearchSection;
