"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import CategoryCard from "./CategoryCard";
import Button from "./uiKit/Button";
import Select from "./uiKit/Select";
import VinRequestModal from "./uiKit/VinRequestModal";
import { getCategories, getBrands, getModels, getModifications, getSubcategories, getThirdSubcategories } from '../services/catalogApi';
import { Category, Brand, Model, Modification, Subcategory, ThirdSubcategory } from '../types/catalog';
import { API_URL } from '@/services/api';

// Interface for category cards display
interface CategoryCardData {
  id: string;
  title: string;
  iconSrc: string;
  slug: string;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subcategoryOptions, setSubcategoryOptions] = useState<{value: string, label: string}[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Fetch models filtered by selected brand
  useEffect(() => {
    const fetchModelsByBrand = async () => {
      if (!selectedBrand) {
        try {
          // If no brand selected, load all models
          const modelsResponse = await getModels();
          const formattedModels = [
            { value: "", label: "Все модели" },
            ...modelsResponse.docs.map((model: Model) => ({
              value: model.slug,
              label: model.name
            }))
          ];
          setModelOptions(formattedModels);
          
          // Reset selected model when brand changes
          setSelectedModel('');
        } catch (err) {
          console.error('Error fetching all models:', err);
        }
        return;
      }
      
      try {
        // Fetch models for the selected brand
        const modelsResponse = await getModels({
          brand: selectedBrand
        });
        
        const formattedModels = [
          { value: "", label: "Все модели" },
          ...modelsResponse.docs.map((model: Model) => ({
            value: model.slug,
            label: model.name
          }))
        ];
        
        setModelOptions(formattedModels);
        
        // Reset selected model if it's not in the filtered options
        if (selectedModel && !formattedModels.some(option => option.value === selectedModel)) {
          setSelectedModel('');
        }
      } catch (err) {
        console.error('Error fetching models by brand:', err);
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchModelsByBrand();
    }
  }, [selectedBrand, isLoading, selectedModel]);

  // Fetch modifications filtered by selected model
  useEffect(() => {
    const fetchModificationsByModel = async () => {
      if (!selectedModel) {
        try {
          // If no model selected, load all modifications
          const modificationsResponse = await getModifications();
          const formattedModifications = [
            { value: "", label: "Все модификации" },
            ...modificationsResponse.docs.map((modification: Modification) => ({
              value: modification.slug,
              label: modification.name
            }))
          ];
          setModificationOptions(formattedModifications);
          
          // Reset selected modification when model changes
          setSelectedModification('');
        } catch (err) {
          console.error('Error fetching all modifications:', err);
        }
        return;
      }
      
      try {
        // Fetch modifications for the selected model
        const modificationsResponse = await getModifications({
          model: selectedModel
        });
        
        const formattedModifications = [
          { value: "", label: "Все модификации" },
          ...modificationsResponse.docs.map((modification: Modification) => ({
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
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchModificationsByModel();
    }
  }, [selectedModel, isLoading, selectedModification]);

  // Fetch subcategories filtered by selected category
  useEffect(() => {
    const fetchSubcategoriesByCategory = async () => {
      if (!selectedCategory) {
        try {
          // If no category selected, load all subcategories
          const subcategoriesResponse = await getSubcategories();
          const formattedSubcategories = [
            { value: "", label: "Все подкатегории" },
            ...subcategoriesResponse.docs.map((subcategory: Subcategory) => ({
              value: subcategory.slug,
              label: subcategory.name
            }))
          ];
          setSubcategoryOptions(formattedSubcategories);
          
          // Reset selected subcategory when category changes
          setSelectedSubcategory('');
        } catch (err) {
          console.error('Error fetching all subcategories:', err);
        }
        return;
      }
      
      try {
        // Fetch subcategories for the selected category
        const subcategoriesResponse = await getSubcategories({
          category: selectedCategory
        });
        
        const formattedSubcategories = [
          { value: "", label: "Все подкатегории" },
          ...subcategoriesResponse.docs.map((subcategory: Subcategory) => ({
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
        try {
          // If no subcategory selected, load all third subcategories
          const thirdSubcategoriesResponse = await getThirdSubcategories();
          const formattedThirdSubcategories = [
            { value: "", label: "Все третьи подкатегории" },
            ...thirdSubcategoriesResponse.docs.map((thirdSubcategory: ThirdSubcategory) => ({
              value: thirdSubcategory.slug,
              label: thirdSubcategory.name
            }))
          ];
          setThirdSubcategoryOptions(formattedThirdSubcategories);
          
          // Reset selected third subcategory when subcategory changes
          setSelectedThirdSubcategory('');
        } catch (err) {
          console.error('Error fetching all third subcategories:', err);
        }
        return;
      }
      
      try {
        // Fetch third subcategories for the selected subcategory
        const thirdSubcategoriesResponse = await getThirdSubcategories({
          subcategory: selectedSubcategory
        });
        
        const formattedThirdSubcategories = [
          { value: "", label: "Все третьи подкатегории" },
          ...thirdSubcategoriesResponse.docs.map((thirdSubcategory: ThirdSubcategory) => ({
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
      }
    };
    
    // Only run if initial loading is done
    if (!isLoading) {
      fetchThirdSubcategoriesBySubcategory();
    }
  }, [selectedSubcategory, isLoading, selectedThirdSubcategory]);

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
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
    setSelectedThirdSubcategory(''); // Reset third subcategory when subcategory changes
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleThirdSubcategoryChange = (value: string) => {
    setSelectedThirdSubcategory(value);
  };

  // Function to handle search and redirect to catalog page with filters
  const handleSearch = () => {
    // Build search params
    const searchParams = new URLSearchParams();
    
    if (searchQuery) {
      searchParams.set('search', searchQuery);
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
      router.push(`/catalog/${selectedCategory}`);
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

  // Handle category card click
  const handleCategoryClick = (categorySlug: string) => {
    // Set the category in the URL params and redirect to catalog
    const params = new URLSearchParams();
    params.append('category', categorySlug);
    
    // Log action for debugging
    console.log('Redirecting to catalog with category:', categorySlug);
    
    // Navigate to catalog page with category parameter
    router.push(`/catalog?${params.toString()}`);
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  // Loading state for filters
                  <div className="col-span-full flex justify-center items-center py-4">
                    <div className="animate-spin h-6 w-6 border-t-2 rounded-full border-b-2 border-[#38AE34]"></div>
                    <span className="ml-2 text-sm text-gray-600">Загрузка фильтров...</span>
                  </div>
                ) : (
                  <>
                    <Select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      placeholder="Категория"
                      options={categoryOptions}
                    />

                    {/* 
                    <Select
                      value={selectedSubcategory}
                      onChange={handleSubcategoryChange}
                      placeholder="Подкатегория"
                      options={subcategoryOptions}
                      disabled={!selectedCategory}
                    />
                    */}

                    {/* 
                    <Select
                      value={selectedThirdSubcategory}
                      onChange={handleThirdSubcategoryChange}
                      placeholder="Третья подкатегория"
                      options={thirdSubcategoryOptions}
                      disabled={!selectedSubcategory}
                    />
                    */}

                    <Select
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      placeholder="Марка"
                      options={brandOptions}
                    />

                    <Select
                      value={selectedModel}
                      onChange={handleModelChange}
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
                  </>
                )}
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
                variant="primary"
                className="flex justify-center items-center"
                hideArrow
                onClick={handleSearch}
                disabled={isLoading}
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
