"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Container from "./Container";
import ProductCard from "../components/uiKit/ProductCard";
import Select from "../components/uiKit/Select";
import Button from "../components/uiKit/Button";
import Arrow from "../components/uiKit/SliderButton";


// Interfaces for the catalog data
interface SubcategoryAttributes {
  name: string;
  slug?: string;
}

interface Subcategory {
  id: number;
  attributes: SubcategoryAttributes;
}

// Boilerplate data instead of API calls
const boilerplateSubcategories: Subcategory[] = [
  { id: 1, attributes: { name: "Амортизаторы", slug: "amortizatory" } },
  { id: 2, attributes: { name: "Замки", slug: "zamki" } },
  { id: 3, attributes: { name: "Петли", slug: "petli" } },
  { id: 4, attributes: { name: "Подъемники", slug: "podemniki" } },
  { id: 5, attributes: { name: "Багажник", slug: "bagazhnik" } },
];

export const boilerplateProducts = [
  {
    id: 1,
    attributes: {
      name: "Дверь багажника HAVAL JOLION 2021-2024",
      slug: "dver-bagazhnika-haval-jolion",
      article: "HT-GW38-03",
      price: "24500",
      brand: "HAVAL",
      model: "JOLION",
      modification: "2021-2024",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Haval+Jolion",
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      name: "Дверь багажника HAVAL DARGO 2022-2024",
      slug: "dver-bagazhnika-haval-dargo",
      article: "HT-GW38-04",
      price: "26800",
      brand: "HAVAL",
      model: "DARGO",
      modification: "2022-2024",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Haval+Dargo",
          },
        },
      },
    },
  },
  {
    id: 3,
    attributes: {
      name: "Дверь багажника HAVAL F7 2019-2022",
      slug: "dver-bagazhnika-haval-f7",
      article: "HT-GW38-05",
      price: "25300",
      brand: "HAVAL",
      model: "F7",
      modification: "2019-2022",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Haval+F7",
          },
        },
      },
    },
  },
  {
    id: 4,
    attributes: {
      name: "Дверь багажника CHERY TIGGO 7 PRO 2020-2023",
      slug: "dver-bagazhnika-chery-tiggo-7-pro",
      article: "HT-GW38-06",
      price: "23800",
      brand: "CHERY",
      model: "TIGGO 7 PRO",
      modification: "2020-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Chery+Tiggo",
          },
        },
      },
    },
  },
  {
    id: 5,
    attributes: {
      name: "Дверь багажника GEELY COOLRAY 2020-2023",
      slug: "dver-bagazhnika-geely-coolray",
      article: "HT-GW38-07",
      price: "22500",
      brand: "GEELY",
      model: "COOLRAY",
      modification: "2020-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Geely+Coolray",
          },
        },
      },
    },
  },
  {
    id: 6,
    attributes: {
      name: "Дверь багажника GEELY ATLAS 2018-2023",
      slug: "dver-bagazhnika-geely-atlas",
      article: "HT-GW38-08",
      price: "24200",
      brand: "GEELY",
      model: "ATLAS",
      modification: "2018-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Geely+Atlas",
          },
        },
      },
    },
  },
  {
    id: 7,
    attributes: {
      name: "Дверь багажника CHANGAN CS55 PLUS 2021-2023",
      slug: "dver-bagazhnika-changan-cs55-plus",
      article: "HT-GW38-09",
      price: "25900",
      brand: "CHANGAN",
      model: "CS55 PLUS",
      modification: "2021-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Changan+CS55",
          },
        },
      },
    },
  },
  {
    id: 8,
    attributes: {
      name: "Дверь багажника GAC GS8 2021-2023",
      slug: "dver-bagazhnika-gac-gs8",
      article: "HT-GW38-10",
      price: "27500",
      brand: "GAC",
      model: "GS8",
      modification: "2021-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=GAC+GS8",
          },
        },
      },
    },
  },
  {
    id: 9,
    attributes: {
      name: "Дверь багажника EXEED TXL 2019-2023",
      slug: "dver-bagazhnika-exeed-txl",
      article: "HT-GW38-11",
      price: "26300",
      brand: "EXEED",
      model: "TXL",
      modification: "2019-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Exeed+TXL",
          },
        },
      },
    },
  },
  {
    id: 10,
    attributes: {
      name: "Дверь багажника JAC S7 2020-2023",
      slug: "dver-bagazhnika-jac-s7",
      article: "HT-GW38-12",
      price: "24900",
      brand: "JAC",
      model: "S7",
      modification: "2020-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=JAC+S7",
          },
        },
      },
    },
  },
  {
    id: 11,
    attributes: {
      name: "Дверь багажника CHERY TIGGO 8 PRO 2021-2023",
      slug: "dver-bagazhnika-chery-tiggo-8-pro",
      article: "HT-GW38-13",
      price: "25700",
      brand: "CHERY",
      model: "TIGGO 8 PRO",
      modification: "2021-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Chery+Tiggo+8",
          },
        },
      },
    },
  },
  {
    id: 12,
    attributes: {
      name: "Дверь багажника HAVAL H6 2021-2023",
      slug: "dver-bagazhnika-haval-h6",
      article: "HT-GW38-14",
      price: "26100",
      brand: "HAVAL",
      model: "H6",
      modification: "2021-2023",
      oem: "6301600XKN04A",
      image: {
        data: {
          attributes: {
            url: "https://placehold.co/250x250/f5f5f5/9a9a9a?text=Haval+H6",
          },
        },
      },
    },
  },
];

// Main Catalog component
interface CatalogProps {
  initialCategory?: string;
}

const Catalog: React.FC<CatalogProps> = ({ initialCategory }) => {
  const pathname = usePathname();
  const [subcategories] = useState<Subcategory[]>(
    boilerplateSubcategories
  );
  const [products] = useState(boilerplateProducts);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModification, setSelectedModification] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(2);
  const [isLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Parse subcategory slug from URL if present or use initialCategory
  useEffect(() => {
    let subcategorySlug = initialCategory;
    
    // Try to get from pathname if not provided as prop
    if (!subcategorySlug) {
      const pathParts = pathname.split("/");
      subcategorySlug = pathParts[2]; // Assuming the pattern is /catalog/:subcategorySlug
    }

    if (subcategorySlug && subcategories.length > 0) {
      const subcategory = subcategories.find(
        (sub) => sub.attributes.slug === subcategorySlug
      );
      if (subcategory) {
        setSelectedSubcategory(subcategory);
      }
    }
  }, [pathname, subcategories, initialCategory]);

  // Unique brands, models, and modifications from products
  const brands = [...new Set(products.map((p) => p.attributes.brand))];
  const models = [...new Set(products.map((p) => p.attributes.model))];
  const modifications = [
    ...new Set(products.map((p) => p.attributes.modification)),
  ];

  // Convert the arrays to select options format
  const subcategoryOptions = subcategories.map((sub) => ({
    value: sub.id.toString(),
    label: sub.attributes.name,
  }));

  const brandOptions = brands.map((brand) => ({
    value: brand,
    label: brand,
  }));

  const modelOptions = models.map((model) => ({
    value: model,
    label: model,
  }));

  const modificationOptions = modifications.map((mod) => ({
    value: mod,
    label: mod,
  }));

  // Handle subcategory change
  const handleSubcategoryChange = (value: string) => {
    if (value) {
      const sub = subcategories.find((s) => s.id.toString() === value);
      setSelectedSubcategory(sub || null);
    } else {
      setSelectedSubcategory(null);
    }
  };

  // Generate pagination items
  const paginationItems = [1, 2, 3, 4, 5];

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="bg-[#F5F5F5]">
      <Container>
        <div className="py-4 md:py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center mb-4 md:mb-6 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <Link href="/" className="text-[#9A9A9A] hover:text-[#38AE34]">
              Главная
            </Link>
            <span className="mx-2 text-[#9A9A9A]">/</span>
            <Link
              href="/catalog"
              className="text-[#9A9A9A] hover:text-[#38AE34]"
            >
              Каталог
            </Link>
            {selectedSubcategory && (
              <>
                <span className="mx-2 text-[#9A9A9A]">/</span>
                <span className="text-[#3B3B3B]">
                  {selectedSubcategory.attributes.name}
                </span>
              </>
            )}
          </div>

          {/* Page title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-[#3B3B3B] font-[Roboto_Condensed]">
            {selectedSubcategory
              ? selectedSubcategory.attributes.name
              : "Каталог продукции"}
          </h1>

          {/* Mobile filter toggle button */}
          <div className="flex md:hidden mb-4">
            <button
              onClick={toggleMobileFilters}
              className="flex items-center justify-center w-full p-3 bg-[#38AE34] text-white rounded-md font-medium"
            >
              {showMobileFilters ? "Скрыть фильтры" : "Показать фильтры"}
              <svg 
                className={`ml-2 w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filters section */}
          <div className={`mb-6 md:mb-8 ${showMobileFilters || 'hidden md:block'}`}>
            <div className="flex flex-col md:flex-row gap-3 md:gap-5">
              <Select
                options={subcategoryOptions}
                value={
                  selectedSubcategory ? selectedSubcategory.id.toString() : ""
                }
                onChange={handleSubcategoryChange}
                placeholder="Багажник"
                className="w-full md:flex-2"
              />
              <Select
                options={subcategoryOptions}
                value={
                  selectedSubcategory ? selectedSubcategory.id.toString() : ""
                }
                onChange={handleSubcategoryChange}
                placeholder="Подкатегория"
                className="w-full md:flex-2"
              />

              <Select
                options={brandOptions}
                value={selectedBrand}
                onChange={setSelectedBrand}
                placeholder="Марка"
                className="w-full md:flex-2"
              />

              <Select
                options={modelOptions}
                value={selectedModel}
                onChange={setSelectedModel}
                placeholder="Модель"
                className="w-full md:flex-2"
              />

              <Select
                options={modificationOptions}
                value={selectedModification}
                onChange={setSelectedModification}
                placeholder="Модификация"
                className="w-full md:flex-2"
              />

              <Button
                label="Найти"
                href="#"
                variant="noArrow2"
                className="h-[42px] w-full md:flex-1 hover:text-black"
              />
            </div>
          </div>

          {/* Products section */}
          <div className="mb-6 md:mb-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38AE34]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-[#F5F5F5] p-4 sm:p-8 rounded-lg text-center">
                <h3 className="text-lg md:text-xl font-medium text-[#3B3B3B] mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-[#9A9A9A]">
                  Попробуйте изменить параметры фильтрации
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[26px]">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && products.length > 0 && (
            <div className="flex justify-center my-6 md:my-10">
              <div className="flex items-center gap-3 md:gap-[30px]">
                <Arrow direction="left" onClick={() => {}} />
                <div className="flex space-x-2 md:space-x-4">
                  {paginationItems.map((item) => (
                    <button
                      key={item}
                      className={`font-extrabold text-[16px] font-[Roboto_Condensed] ${
                        item === currentPage ? "text-[#38AE34]" : "text-[#616161]"
                      }`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <Arrow direction="right" onClick={() => {}} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Catalog;