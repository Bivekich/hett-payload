"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import CategoryCard from "./CategoryCard";
import Button from "./uiKit/Button";
import Select from "./uiKit/Select";
import VinRequestModal from "./uiKit/VinRequestModal";
import { getCategories, getBrands, getModels, getModifications, getSubcategories, getThirdSubcategories, getCatalogProducts } from '../services/catalogApi';
import { Category, Brand, Model, Modification, Subcategory, ThirdSubcategory } from '../types/catalog';
import { API_URL } from '@/services/api';

// Interface for category cards display
interface CategoryCardData {
  id: string;
  title: string;
  iconSrc: string;
  slug: string;
}

// Add interface for filters at the top of the file after other interfaces
interface CatalogFilters {
  brand?: string;
  category?: string;
  subcategory?: string;
  thirdsubcategory?: string;
  model?: string;
  modification?: string;
  depth?: number;
  page?: number;
  limit?: number;
  search?: string;
}

const ProductSearchSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModification, setSelectedModification] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedThirdSubcategory, setSelectedThirdSubcategory] = useState<string>("");
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  
  // State variables for filter options
  const [categoryOptions, setCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [thirdSubcategoryOptions, setThirdSubcategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [brandOptions, setBrandOptions] = useState<{value: string, label: string}[]>([]);
  const [modelOptions, setModelOptions] = useState<{value: string, label: string}[]>([]);
  const [modificationOptions, setModificationOptions] = useState<{value: string, label: string}[]>([]);
  
  // State for category cards
  const [categoryCards, setCategoryCards] = useState<CategoryCardData[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch filter options when component mounts
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesResponse = await getCategories();
        
        // Format categories for dropdown options
        const formattedCategories = [
          { value: "", label: "Все товары" },
          ...categoriesResponse.docs.map((category: Category) => ({
            value: category.slug,
            label: category.name
          }))
        ];
        setCategoryOptions(formattedCategories);
        
        // Format categories for category cards
        const formattedCategoryCards = categoriesResponse.docs
          // Remove the filter for featured categories to show all categories
          // .filter((category: Category) => category.featured)
          .slice(0, 5) // Limit to 5 categories for the grid
          .map((category: Category) => {
            // Handle icon/image using similar approach as Banner component
            let iconSrc = '/images/default_category_icon.svg';
            
            // First try to use the icon if available
            if (category.icon && category.icon.url) {
              iconSrc = category.icon.url;
              
              // Make URL absolute if it's relative
              if (iconSrc.startsWith('/')) {
                iconSrc = `${API_URL}${iconSrc}`;
              }
            } 
            // Fallback to the category image if icon is not available
            else if (category.image && category.image.url) {
              iconSrc = category.image.url;
              
              // Make URL absolute if it's relative
              if (iconSrc.startsWith('/')) {
                iconSrc = `${API_URL}${iconSrc}`;
              }
            }

            return {
              id: category.id,
              title: category.name,
              iconSrc,
              slug: category.slug
            };
          });
        
        setCategoryCards(formattedCategoryCards);
        
        // Fetch brands
        const brandsResponse = await getBrands();
        const formattedBrands = [
          { value: "", label: "Все марки" },
          ...brandsResponse.docs.map((brand: Brand) => ({
            value: brand.slug,
            label: brand.name
          }))
        ];
        setBrandOptions(formattedBrands);
        
        // Fetch models
        const modelsResponse = await getModels();
        const formattedModels = [
          { value: "", label: "Все модели" },
          ...modelsResponse.docs.map((model: Model) => ({
            value: model.slug,
            label: model.name
          }))
        ];
        setModelOptions(formattedModels);
        
        // Fetch modifications
        const modificationsResponse = await getModifications();
        const formattedModifications = [
          { value: "", label: "Все модификации" },
          ...modificationsResponse.docs.map((modification: Modification) => ({
            value: modification.slug,
            label: modification.name
          }))
        ];
        setModificationOptions(formattedModifications);
        
        // Fetch subcategories
        const subcategoriesResponse = await getSubcategories();
        const formattedSubcategories = [
          { value: "", label: "Все подкатегории" },
          ...subcategoriesResponse.docs.map((subcategory: Subcategory) => ({
            value: subcategory.slug,
            label: subcategory.name
          }))
        ];
        setSubcategoryOptions(formattedSubcategories);
        
        // Fetch third subcategories
        const thirdSubcategoriesResponse = await getThirdSubcategories();
        const formattedThirdSubcategories = [
          { value: "", label: "Все третьи подкатегории" },
          ...thirdSubcategoriesResponse.docs.map((thirdSubcategory: ThirdSubcategory) => ({
            value: thirdSubcategory.slug,
            label: thirdSubcategory.name
          }))
        ];
        setThirdSubcategoryOptions(formattedThirdSubcategories);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setIsLoading(false);
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Fetch models filtered by selected brand and current filters
  useEffect(() => {
    const fetchModelsByBrand = async () => {
      if (!selectedBrand) {
        setModelOptions([{ value: "", label: "Все модели" }]);
        setSelectedModel('');
        return;
      }
      
      try {
        // Build filters for product query
        const filters: CatalogFilters = {
          brand: selectedBrand
        };
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedSubcategory) filters.subcategory = selectedSubcategory;
        if (selectedThirdSubcategory) filters.thirdsubcategory = selectedThirdSubcategory;

        // Fetch products with current filters to get available models
        const productsResponse = await getCatalogProducts({
          ...filters,
          depth: 1
        });

        // Create a Set of model slugs that have products
        const modelsWithProducts = new Set(
          productsResponse.docs
            .map(product => typeof product.model === 'object' ? product.model?.slug : null)
            .filter(Boolean)
        );

        // Fetch models for the selected brand
        const modelsResponse = await getModels({
          brand: selectedBrand
        });
        
        // Filter models to only include those with products
        const formattedModels = [
          { value: "", label: "Все модели" },
          ...modelsResponse.docs
            .filter(model => modelsWithProducts.has(model.slug))
            .map((model: Model) => ({
              value: model.slug,
              label: model.name
            }))
        ];
        
        setModelOptions(formattedModels);
        
        // Reset selected model if it's not in the filtered options
        if (selectedModel && !formattedModels.some(option => option.value === selectedModel)) {
          setSelectedModel('');
          setSelectedModification(''); // Reset modification since model is reset
        }
      } catch (err) {
        console.error('Error fetching models by brand:', err);
        setModelOptions([{ value: "", label: "Все модели" }]);
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchModelsByBrand();
    }
  }, [selectedBrand, selectedCategory, selectedSubcategory, selectedThirdSubcategory, isLoading, selectedModel]);

  // Fetch modifications filtered by selected model and brand
  useEffect(() => {
    const fetchModificationsByModel = async () => {
      if (!selectedModel || !selectedBrand) {
        setModificationOptions([{ value: "", label: "Все модификации" }]);
        setSelectedModification('');
        return;
      }
      
      try {
        // Build filters for product query
        const filters: CatalogFilters = {
          brand: selectedBrand,
          model: selectedModel
        };
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedSubcategory) filters.subcategory = selectedSubcategory;
        if (selectedThirdSubcategory) filters.thirdsubcategory = selectedThirdSubcategory;

        // Fetch products with current filters to get available modifications
        const productsResponse = await getCatalogProducts({
          ...filters,
          depth: 1
        });

        // Create a Set of modification slugs that have products
        const modificationsWithProducts = new Set(
          productsResponse.docs
            .map(product => typeof product.modification === 'object' ? product.modification?.slug : null)
            .filter(Boolean)
        );

        // Fetch modifications for the selected model
        const modificationsResponse = await getModifications({
          model: selectedModel
        });
        
        // Filter modifications to only include those with products
        const formattedModifications = [
          { value: "", label: "Все модификации" },
          ...modificationsResponse.docs
            .filter(modification => modificationsWithProducts.has(modification.slug))
            .map((modification: Modification) => ({
              value: modification.slug,
              label: modification.name
            }))
        ];
        
        setModificationOptions(formattedModifications);
        
        // Reset selected modification if it's not in the filtered options
        if (selectedModification && !formattedModifications.some(option => option.value === selectedModification)) {
          setSelectedModification('');
        }
      } catch (err) {
        console.error('Error fetching modifications by model:', err);
        setModificationOptions([{ value: "", label: "Все модификации" }]);
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchModificationsByModel();
    }
  }, [selectedModel, selectedBrand, selectedCategory, selectedSubcategory, selectedThirdSubcategory, isLoading, selectedModification]);

  // Fetch subcategories filtered by selected category
  useEffect(() => {
    const fetchSubcategoriesByCategory = async () => {
      if (!selectedCategory) {
        setSubcategoryOptions([{ value: "", label: "Все подкатегории" }]);
        setSelectedSubcategory('');
        return;
      }
      
      try {
        // Fetch subcategories for the selected category
        const subcategoriesResponse = await getSubcategories({
          category: selectedCategory
        });
        
        // Fetch products to check which subcategories have products
        const productsResponse = await getCatalogProducts({
          category: selectedCategory,
          depth: 1
        });
        
        // Create a Set of subcategory slugs that have products
        const subcategoriesWithProducts = new Set(
          productsResponse.docs
            .map(product => typeof product.subcategory === 'object' ? product.subcategory?.slug : null)
            .filter(Boolean)
        );
        
        // Filter subcategories to only include those with products
        const formattedSubcategories = [
          { value: "", label: "Все подкатегории" },
          ...subcategoriesResponse.docs
            .filter(subcategory => subcategoriesWithProducts.has(subcategory.slug))
            .map((subcategory: Subcategory) => ({
              value: subcategory.slug,
              label: subcategory.name
            }))
        ];
        
        setSubcategoryOptions(formattedSubcategories);
        
        // Reset selected subcategory if it's not in the filtered options
        if (selectedSubcategory && !formattedSubcategories.some(option => option.value === selectedSubcategory)) {
          setSelectedSubcategory('');
        }
      } catch (err) {
        console.error('Error fetching subcategories by category:', err);
        setSubcategoryOptions([{ value: "", label: "Все подкатегории" }]);
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchSubcategoriesByCategory();
    }
  }, [selectedCategory, isLoading, selectedSubcategory]);
  
  // Fetch third subcategories filtered by selected subcategory
  useEffect(() => {
    const fetchThirdSubcategoriesBySubcategory = async () => {
      if (!selectedSubcategory) {
        setThirdSubcategoryOptions([{ value: "", label: "Все третьи подкатегории" }]);
        setSelectedThirdSubcategory('');
        return;
      }
      
      try {
        // Fetch third subcategories for the selected subcategory
        const thirdSubcategoriesResponse = await getThirdSubcategories({
          subcategory: selectedSubcategory
        });
        
        // Fetch products to check which third subcategories have products
        const productsResponse = await getCatalogProducts({
          subcategory: selectedSubcategory,
          depth: 1
        });
        
        // Create a Set of third subcategory slugs that have products
        const thirdSubcategoriesWithProducts = new Set(
          productsResponse.docs
            .map(product => typeof product.thirdsubcategory === 'object' ? product.thirdsubcategory?.slug : null)
            .filter(Boolean)
        );
        
        // Filter third subcategories to only include those with products
        const formattedThirdSubcategories = [
          { value: "", label: "Все третьи подкатегории" },
          ...thirdSubcategoriesResponse.docs
            .filter(thirdSubcategory => thirdSubcategoriesWithProducts.has(thirdSubcategory.slug))
            .map((thirdSubcategory: ThirdSubcategory) => ({
              value: thirdSubcategory.slug,
              label: thirdSubcategory.name
            }))
        ];
        
        setThirdSubcategoryOptions(formattedThirdSubcategories);
        
        // Reset selected third subcategory if it's not in the filtered options
        if (selectedThirdSubcategory && !formattedThirdSubcategories.some(option => option.value === selectedThirdSubcategory)) {
          setSelectedThirdSubcategory('');
        }
      } catch (err) {
        console.error('Error fetching third subcategories by subcategory:', err);
        setThirdSubcategoryOptions([{ value: "", label: "Все третьи подкатегории" }]);
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchThirdSubcategoriesBySubcategory();
    }
  }, [selectedSubcategory, isLoading, selectedThirdSubcategory]);

  // Add new useEffect for brand filtering based on category/subcategory/third subcategory
  useEffect(() => {
    const fetchBrandsByFilters = async () => {
      try {
        // If no filters are selected, show all brands
        if (!selectedCategory && !selectedSubcategory && !selectedThirdSubcategory) {
          const brandsResponse = await getBrands();
          const formattedBrands = [
            { value: "", label: "Все марки" },
            ...brandsResponse.docs.map((brand: Brand) => ({
              value: brand.slug,
              label: brand.name
            }))
          ];
          setBrandOptions(formattedBrands);
          return;
        }

        // Build filters for product query
        const filters: CatalogFilters = {};
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedSubcategory) filters.subcategory = selectedSubcategory;
        if (selectedThirdSubcategory) filters.thirdsubcategory = selectedThirdSubcategory;

        // Fetch products with current filters to get available brands
        const productsResponse = await getCatalogProducts({
          ...filters,
          depth: 1
        });

        // Create a Set of brand slugs that have products
        const brandsWithProducts = new Set(
          productsResponse.docs
            .map(product => typeof product.brand === 'object' ? product.brand?.slug : null)
            .filter(Boolean)
        );

        // Fetch all brands to filter them
        const brandsResponse = await getBrands();
        
        // Filter brands to only include those with products
        const formattedBrands = [
          { value: "", label: "Все марки" },
          ...brandsResponse.docs
            .filter(brand => brandsWithProducts.has(brand.slug))
            .map((brand: Brand) => ({
              value: brand.slug,
              label: brand.name
            }))
        ];

        setBrandOptions(formattedBrands);

        // Reset selected brand if it's not in the filtered options
        if (selectedBrand && !formattedBrands.some(option => option.value === selectedBrand)) {
          setSelectedBrand('');
          setSelectedModel(''); // Reset model since brand is reset
          setSelectedModification(''); // Reset modification since brand is reset
        }
      } catch (err) {
        console.error('Error fetching brands by filters:', err);
        setBrandOptions([{ value: "", label: "Все марки" }]);
      }
    };

    // Only run if initial loading is done
    if (!isLoading) {
      fetchBrandsByFilters();
    }
  }, [selectedCategory, selectedSubcategory, selectedThirdSubcategory, isLoading, selectedBrand]);

  // Handlers for filter changes
  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel(""); // Reset model when brand changes
    setSelectedModification(""); // Reset modification when brand changes
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedModification(""); // Reset modification when model changes
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory(''); // Reset subcategory when category changes
    setSelectedThirdSubcategory(''); // Reset third subcategory when category changes
  };
  
  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
    setSelectedThirdSubcategory(''); // Reset third subcategory when subcategory changes
  };
  
  const handleThirdSubcategoryChange = (value: string) => {
    setSelectedThirdSubcategory(value);
  };

  // Function to handle search and redirect to catalog page with filters
  const handleSearch = () => {
    // Build search params
    const searchParams = new URLSearchParams();
    
    // Always include search query if present, as it can search across name, OEM, and article
    if (searchQuery) {
      searchParams.set('search', searchQuery.trim());
    }
    
    if (selectedBrand) {
      searchParams.set('brand', selectedBrand);
    }
    
    if (selectedModel) {
      searchParams.set('model', selectedModel);
    }
    
    if (selectedModification) {
      searchParams.set('modification', selectedModification);
    }
    
    // Use category and subcategory for navigation path or query parameter
    if (selectedCategory && !selectedSubcategory && !selectedThirdSubcategory) {
      // If only category is selected, navigate to the category page
      const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
      router.push(`/catalog/${selectedCategory}${queryString}`);
    } else {
      // Otherwise use as query parameters
      if (selectedCategory) {
        searchParams.set('category', selectedCategory);
      }
      
      if (selectedSubcategory) {
        searchParams.set('subcategory', selectedSubcategory);
      }
      
      if (selectedThirdSubcategory) {
        searchParams.set('thirdsubcategory', selectedThirdSubcategory);
      }
      
      const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
      router.push(`/catalog${queryString}`);
    }
  };

  // Handle keyboard events in the search input (for Enter key)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Handle category card click
  const handleCategoryClick = (categorySlug: string) => {
    // Navigate directly to the category page using the path structure
    router.push(`/catalog/${categorySlug}`);
  };

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
            <div className="flex-1 flex flex-col gap-y-4">
              {/* Search bar and VIN request row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex">
                    <div className="flex-1 border border-[#8898A4] hover:border-[#38AE34] focus-within:border-[#38AE34] transition-colors group h-[42px]">
                      <div className="flex gap-2.5 items-center px-5 h-full">
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
                          className="text-[#555555] group-focus-within:text-[#38AE34]  transition-colors w-6 aspect-square"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          placeholder="Поиск по названию, артикулу или OEM"
                          className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
                        />
                      </div>
                    </div>
                    <Button
                      label="Найти"
                      variant="noArrow2"
                      onClick={handleSearch}
                      className="px-6 hover:text-black"
                    />
                  </div>
                </div>
                <div className="w-[200px] max-lg:hidden">
                  <Button
                    label="Запросить по VIN"
                    variant="noArrow"
                    className="flex justify-center items-center w-full border-none"
                    hideArrow
                    onClick={() => setIsVinModalOpen(true)}
                  />
                </div>
              </div>

              {/* Search section */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-5">
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  placeholder="Категория"
                  className="w-full"
                />
                
                <Select
                  options={subcategoryOptions}
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  placeholder="Подкатегория"
                  className="w-full"
                  disabled={!selectedCategory}
                />

                <Select
                  options={thirdSubcategoryOptions}
                  value={selectedThirdSubcategory}
                  onChange={handleThirdSubcategoryChange}
                  placeholder="Третья подкатегория"
                  className="w-full"
                  disabled={!selectedSubcategory}
                />

                <Select
                  options={brandOptions}
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  placeholder="Марка"
                  className="w-full"
                />

                <Select
                  options={modelOptions}
                  value={selectedModel}
                  onChange={handleModelChange}
                  placeholder="Модель"
                  className="w-full"
                  disabled={!selectedBrand}
                />

                <Select
                  options={modificationOptions}
                  value={selectedModification}
                  onChange={(value) => setSelectedModification(value)}
                  placeholder="Модификация"
                  className="w-full"
                  disabled={!selectedModel}
                />
              </div>
            </div>

            {/* Mobile VIN request button */}
            <div className="lg:hidden">
              <Button
                label="Запросить по VIN"
                variant="noArrow"
                className="flex justify-center items-center w-full border-none"
                hideArrow
                onClick={() => setIsVinModalOpen(true)}
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
          {isLoading ? (
            // Loading state for category cards
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-4 shadow-sm h-[140px] animate-pulse">
                <div className="h-16 w-16 mx-auto bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 w-3/4 mx-auto"></div>
              </div>
            ))
          ) : categoryCards.length > 0 ? (
            categoryCards.map((category) => (
              <div 
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="cursor-pointer"
              >
                <CategoryCard
                  title={category.title}
                  iconSrc={category.iconSrc}
                  href="#" // Empty href since we handle click at the parent level
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              Нет доступных категорий
            </div>
          )}
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
