"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "./Container";
import ProductCard from "./uiKit/ProductCard";
import Select from "./uiKit/Select";
import Button from "./uiKit/Button";
import Arrow from "./uiKit/SliderButton";
import { getCategories, getSubcategories, getThirdSubcategories, getBrands, getModels, getModifications, getCatalogProducts } from '../services/catalogApi';
import { Product as CmsProduct, Category, Subcategory as CmsSubcategory, ThirdSubcategory as CmsThirdSubcategory, Brand as CmsBrand, Model as CmsModel, Modification, CatalogFilters } from '../types/catalog';
import { API_URL } from '@/services/api';

// Interfaces for the catalog data
interface SubcategoryAttributes {
  name: string;
  slug?: string;
}

interface Subcategory {
  id: number;
  attributes: SubcategoryAttributes;
  category?: Category | string;
}

// ThirdSubcategory interfaces and converter functions
interface ThirdSubcategoryAttributes {
  name: string;
  slug?: string;
}

interface ThirdSubcategory {
  id: number;
  attributes: ThirdSubcategoryAttributes;
  subcategory?: Subcategory | string;
}

// Keep empty array for backwards compatibility (used by other components)
export const boilerplateProducts = [];

// Helper function to convert CMS product to frontend product format
export const convertCmsProductToProduct = (cmsProduct: CmsProduct /* CmsProduct is type alias for Catalog from payload-types */) => {
  
  // Handle image: Use the first image from the 'images' array if available
  let displayImageUrl = '';
  if (cmsProduct.images && cmsProduct.images.length > 0) {
    const firstImageBlock = cmsProduct.images[0];
    // Check if the nested 'image' field is populated (requires depth >= 1 in fetch)
    if (typeof firstImageBlock.image === 'object' && firstImageBlock.image !== null && firstImageBlock.image.url) {
      displayImageUrl = firstImageBlock.image.url;
      // Make URL absolute if it's relative
      if (displayImageUrl.startsWith('/')) {
        displayImageUrl = `${API_URL}${displayImageUrl}`;
      }
    } else {
      console.warn(`Product ${cmsProduct.id} image object not fully populated. Check API fetch depth.`);
    }
  } 

  // Handle brand: could be array of objects (depth>=1) or numbers (depth=0)
  let brandValue: string | string[] = []; // Default to empty array
  const brandData = cmsProduct.brand;

  if (Array.isArray(brandData)) {
    brandValue = brandData.map(b => {
      if (typeof b === 'object' && b !== null && b.name) {
        return b.name; // Got Brand object with name
      } else if (typeof b === 'number') {
        console.warn(`Product ${cmsProduct.id} brand ${b} not fully populated. Check API fetch depth.`);
        return `Brand ID: ${b}`; // Placeholder
      } else {
        return ''; // Handle unexpected format
      }
    }).filter(name => name); 
  } else if (brandData && typeof brandData === 'object' && brandData.name) { // Handle case where CMS might return single object if array has one item?
     console.warn(`Product ${cmsProduct.id} has unexpected single brand object format instead of array.`);
     brandValue = brandData.name;
  } else if (brandData) {
     // Fallback for unexpected format
      console.warn(`Product ${cmsProduct.id} has unexpected brand format:`, brandData);
     brandValue = String(brandData);
  }
  
  // If brandValue ended up as an empty array, represent as empty string for ProductCard/Details
  if (Array.isArray(brandValue) && brandValue.length === 0) {
      brandValue = ''; // Change to empty string if no brands found/populated
  }
  
  return {
    id: parseInt(cmsProduct.id),
    attributes: {
      name: cmsProduct.name || '',
      article: cmsProduct.article || '',
      oem: cmsProduct.oem || '',
      brand: brandValue, // Assign the processed string or string array
      model: typeof cmsProduct.model === 'object' && cmsProduct.model !== null ? cmsProduct.model.name : '',
      slug: cmsProduct.slug || '',
      image: { // Pass the processed display image URL for ProductCard
        data: displayImageUrl ? {
          attributes: {
            url: displayImageUrl
          }
        } : undefined // ProductCard should handle undefined gracefully (e.g., show placeholder)
      },
      category: typeof cmsProduct.category === 'object' && cmsProduct.category !== null ? cmsProduct.category.name : '',
      subcategory: typeof cmsProduct.subcategory === 'object' && cmsProduct.subcategory !== null ? cmsProduct.subcategory.name : '',
      thirdsubcategory: typeof cmsProduct.thirdsubcategory === 'object' && cmsProduct.thirdsubcategory !== null ? cmsProduct.thirdsubcategory.name : '',
      shortDescription: cmsProduct.shortDescription || '',
      description: cmsProduct.description || [],
      specifications: cmsProduct.specifications?.map(spec => ({
        name: spec.name,
        value: spec.value
      })) || [],
      marketplaceLinks: {
        ozon: cmsProduct.marketplaceLinks?.ozon || '',
        wildberries: cmsProduct.marketplaceLinks?.wildberries || '',
        others: cmsProduct.marketplaceLinks?.others?.map(m => ({
          name: m.name,
          url: m.url,
          // @ts-expect-error // ОЧЕНЬ ВАЖНО НЕ УБИРАТЬ
          logo: m.logo && typeof m.logo === 'object' && 'url' in m.logo ? m.logo.url : undefined
        })) || []
      },
      distributors: cmsProduct.distributors?.map(d => ({
        name: d.name,
        url: d.url,
        location: d.location
      })) || []
    },
  };
};

// Helper function to convert CMS subcategory to frontend subcategory format
const convertCmsSubcategoryToSubcategory = (cmsSubcategory: CmsSubcategory): Subcategory => {
  return {
    id: parseInt(cmsSubcategory.id),
    attributes: {
      name: cmsSubcategory.name,
      slug: cmsSubcategory.slug,
    },
    category: cmsSubcategory.category,
  };
};

// Helper function to convert CMS third subcategory to frontend format
const convertCmsThirdSubcategoryToThirdSubcategory = (cmsThirdSubcategory: CmsThirdSubcategory): ThirdSubcategory => {
  // Determine the subcategory value to assign
  let subcategoryValue: string | Subcategory;
  
  if (typeof cmsThirdSubcategory.subcategory === 'string') {
    // If it's already a string, use it directly
    subcategoryValue = cmsThirdSubcategory.subcategory;
  } else if (cmsThirdSubcategory.subcategory) {
    // If it's an object, convert it to the expected Subcategory format
    subcategoryValue = convertCmsSubcategoryToSubcategory(cmsThirdSubcategory.subcategory);
  } else {
    // Default to empty string if no subcategory is available
    subcategoryValue = '';
  }
  
  return {
    id: parseInt(cmsThirdSubcategory.id),
    attributes: {
      name: cmsThirdSubcategory.name,
      slug: cmsThirdSubcategory.slug,
    },
    subcategory: subcategoryValue,
  };
};

interface CatalogProps {
  initialCategory?: string;
}

const Catalog: React.FC<CatalogProps> = ({ initialCategory }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search');
  
  // State for metadata
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [thirdSubcategories, setThirdSubcategories] = useState<ThirdSubcategory[]>([]);
  const [brands, setBrands] = useState<CmsBrand[]>([]);
  const [models, setModels] = useState<CmsModel[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);
  
  // State for filtered options that are relevant to current selection
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [filteredThirdSubcategories, setFilteredThirdSubcategories] = useState<ThirdSubcategory[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<CmsBrand[]>([]);
  const [filteredModels, setFilteredModels] = useState<CmsModel[]>([]);
  const [filteredModifications, setFilteredModifications] = useState<Modification[]>([]);
  
  // State for products
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [metadataLoaded, setMetadataLoaded] = useState<boolean>(false);
  
  // Filter states - single source of truth for what's displayed in the UI
  const [filterCategory, setFilterCategory] = useState<string | null>(initialCategory || null);
  const [filterSubcategory, setFilterSubcategory] = useState<Subcategory | null>(null);
  const [filterThirdSubcategory, setFilterThirdSubcategory] = useState<ThirdSubcategory | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [filterModification, setFilterModification] = useState<string | null>(null);
  const [hasActiveSearch, setHasActiveSearch] = useState<boolean>(false);
  
  // Form values - what's displayed in the form inputs
  const [formCategory, setFormCategory] = useState<string | null>(initialCategory || null);
  const [formSubcategory, setFormSubcategory] = useState<Subcategory | null>(null);
  const [formThirdSubcategory, setFormThirdSubcategory] = useState<ThirdSubcategory | null>(null);
  const [formBrand, setFormBrand] = useState<string | null>(null);
  const [formModel, setFormModel] = useState<string | null>(null);
  const [formModification, setFormModification] = useState<string | null>(null);

  // Load all the metadata (categories, subcategories, brands, models, modifications)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all metadata in parallel for better performance
        const [
          categoriesResponse, 
          subcategoriesResponse,
          thirdSubcategoriesResponse,
          brandsResponse, 
          modelsResponse,
          modificationsResponse
        ] = await Promise.all([
          getCategories(),
          getSubcategories(),
          getThirdSubcategories(),
          getBrands(),
          getModels(),
          getModifications()
        ]);
        
        // Process the results
        setCategories(categoriesResponse.docs);
        setSubcategories(subcategoriesResponse.docs.map(convertCmsSubcategoryToSubcategory));
        setThirdSubcategories(thirdSubcategoriesResponse.docs.map(convertCmsThirdSubcategoryToThirdSubcategory));
        setBrands(brandsResponse.docs);
        setFilteredBrands(brandsResponse.docs); // Initially all brands are available
        setModels(modelsResponse.docs);
        setFilteredModels(modelsResponse.docs); // Initially all models are available
        setModifications(modificationsResponse.docs);
        setFilteredModifications(modificationsResponse.docs); // Initially all modifications are available
        
        // Initialize filtered lists to master lists initially
        setFilteredCategories(categoriesResponse.docs);
        setFilteredSubcategories(subcategoriesResponse.docs.map(convertCmsSubcategoryToSubcategory));
        setFilteredThirdSubcategories(thirdSubcategoriesResponse.docs.map(convertCmsThirdSubcategoryToThirdSubcategory));
        setFilteredBrands(brandsResponse.docs);
        setFilteredModels(modelsResponse.docs);
        setFilteredModifications(modificationsResponse.docs);
        
        setMetadataLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError('Ошибка загрузки данных каталога');
        setIsLoading(false);
      }
    };
    
    fetchMetadata();
  }, []);

  // Centralized useEffect to update ALL filter options based on products and selections
  useEffect(() => {
    if (!metadataLoaded) return;

    // 1. Filter based on available products (if any)
    const categoryIdsFromProducts = new Set<string>();
    const subcategoryIdsFromProducts = new Set<string>();
    const thirdSubcategoryIdsFromProducts = new Set<string>();
    const brandIdsFromProducts = new Set<string>();
    const modelIdsFromProducts = new Set<string>();
    const modificationIdsFromProducts = new Set<string>();

    if (cmsProducts.length > 0) {
      cmsProducts.forEach(product => {
        const categoryId = typeof product.category === 'object' ? product.category?.id?.toString() : typeof product.category === 'string' ? product.category : undefined;
        const subcategoryId = typeof product.subcategory === 'object' ? product.subcategory?.id?.toString() : typeof product.subcategory === 'string' ? product.subcategory : undefined;
        const thirdSubcategoryId = typeof product.thirdsubcategory === 'object' ? product.thirdsubcategory?.id?.toString() : typeof product.thirdsubcategory === 'string' ? product.thirdsubcategory : undefined;

        // Correctly handle the brand array
        if (Array.isArray(product.brand)) {
          product.brand.forEach(brandRef => {
            const brandId = typeof brandRef === 'object' && brandRef !== null ? brandRef.id?.toString() : typeof brandRef === 'string' || typeof brandRef === 'number' ? String(brandRef) : undefined;
            if (brandId) brandIdsFromProducts.add(brandId);
          });
        } else if (product.brand) { // Handle potential single object/ID case if API/type allows
           const brandId = typeof product.brand === 'object' && product.brand !== null ? product.brand.id?.toString() : typeof product.brand === 'string' || typeof product.brand === 'number' ? String(product.brand) : undefined;
           if (brandId) brandIdsFromProducts.add(brandId);
        }
        
        const modelId = typeof product.model === 'object' ? product.model?.id?.toString() : typeof product.model === 'string' ? product.model : undefined;
        const modificationId = typeof product.modification === 'object' ? product.modification?.id?.toString() : typeof product.modification === 'string' ? product.modification : undefined;

        if (categoryId) categoryIdsFromProducts.add(categoryId);
        if (subcategoryId) subcategoryIdsFromProducts.add(subcategoryId);
        if (thirdSubcategoryId) thirdSubcategoryIdsFromProducts.add(thirdSubcategoryId);
        if (modelId) modelIdsFromProducts.add(modelId);
        if (modificationId) modificationIdsFromProducts.add(modificationId);
      });
    }

    // 2. Determine the final filtered lists

    // Categories: Filter by brand products OR show all if no brand selected
    let finalFilteredCategories = categories;
    if (filterBrand) {
      if (cmsProducts.length > 0) {
         finalFilteredCategories = categories.filter(cat => categoryIdsFromProducts.has(cat.id.toString()));
      } else {
         // If brand selected but no products, show no categories (strict filtering)
         finalFilteredCategories = [];
      }
    }
    setFilteredCategories(finalFilteredCategories);

    // Subcategories: Filter by category selection AND brand products (if applicable)
    let finalFilteredSubcategories = subcategories;
    if (filterCategory) {
       finalFilteredSubcategories = finalFilteredSubcategories.filter(sub => 
         typeof sub.category === 'object' && sub.category?.slug === filterCategory
       );
    }
    if (filterBrand) {
       if (cmsProducts.length > 0) {
          finalFilteredSubcategories = finalFilteredSubcategories.filter(sub => 
             subcategoryIdsFromProducts.has(sub.id.toString())
          );
       } else {
          finalFilteredSubcategories = []; // Strict filtering
       }
    }
    setFilteredSubcategories(finalFilteredSubcategories);

    // ThirdSubcategories: Filter by subcategory selection AND brand products (if applicable)
    let finalFilteredThirdSubcategories = thirdSubcategories;
    if (filterSubcategory) {
      finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(third => 
         typeof third.subcategory === 'object' && third.subcategory?.id === filterSubcategory.id
       );
    }
     if (filterBrand) { // Also filter by brand products
       if (cmsProducts.length > 0) {
          finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(third => 
             thirdSubcategoryIdsFromProducts.has(third.id.toString())
          );
       } else {
          finalFilteredThirdSubcategories = []; // Strict filtering
       }
     }
    setFilteredThirdSubcategories(finalFilteredThirdSubcategories);

    // Brands: Filter by taxonomy products OR show all if no taxonomy selected
    let finalFilteredBrands = brands;
    if (filterCategory || filterSubcategory || filterThirdSubcategory) {
       if (cmsProducts.length > 0) {
          finalFilteredBrands = brands.filter(brand => brandIdsFromProducts.has(brand.id.toString()));
       } else {
          // If taxonomy selected but no products, show no brands (strict filtering)
          finalFilteredBrands = [];
       }
    }
    setFilteredBrands(finalFilteredBrands);

    // Models: Filter first by brand selection, then by available products
    let finalFilteredModels = models;
    if (filterBrand) {
      finalFilteredModels = finalFilteredModels.filter(model => 
        typeof model.brand === 'object' && model.brand?.slug === filterBrand
      );
      // If products are available for the current filters, refine by product models
      if (cmsProducts.length > 0) {
         const modelsInProducts = finalFilteredModels.filter(model => 
            modelIdsFromProducts.has(model.id.toString())
         );
         // Only apply product filter if it results in a non-empty list, otherwise keep brand-filtered
         if (modelsInProducts.length > 0) {
            finalFilteredModels = modelsInProducts;
         } else {
            // If filtering by product results in nothing, it might mean the product fetch is slightly behind
            // or no products match the *full* filter set. Keep the brand-filtered list.
            console.log("No models found in current products for selected brand, showing all models for the brand.");
         }
      } else if (filterCategory || filterSubcategory || filterThirdSubcategory || filterModel || filterModification || searchQuery) {
         // If other filters are active but no products found, strictly filter models (show none)
         finalFilteredModels = [];
      }
    }
    setFilteredModels(finalFilteredModels);

    // Modifications: Filter first by model selection, then by available products
    let finalFilteredModifications = modifications;
    if (filterModel) {
       finalFilteredModifications = finalFilteredModifications.filter(mod => 
         typeof mod.model === 'object' && mod.model?.slug === filterModel
       );
       // If products are available for the current filters, refine by product modifications
       if (cmsProducts.length > 0) {
          const modificationsInProducts = finalFilteredModifications.filter(mod => 
             modificationIdsFromProducts.has(mod.id.toString())
          );
          // Only apply product filter if it results in a non-empty list
          if (modificationsInProducts.length > 0) {
             finalFilteredModifications = modificationsInProducts;
          } else {
             console.log("No modifications found in current products for selected model, showing all modifications for the model.");
          }
       } else if (filterCategory || filterSubcategory || filterThirdSubcategory || filterBrand || filterModification || searchQuery) {
          // If other filters are active but no products found, strictly filter modifications (show none)
          finalFilteredModifications = [];
       }
    }
    setFilteredModifications(finalFilteredModifications);

    console.log("Updated Filter Options:", {
       categories: finalFilteredCategories.length,
       subcategories: finalFilteredSubcategories.length,
       thirdSubcategories: finalFilteredThirdSubcategories.length,
       brands: finalFilteredBrands.length,
       models: finalFilteredModels.length,
       modifications: finalFilteredModifications.length
    });

  }, [cmsProducts, filterCategory, filterSubcategory, filterThirdSubcategory, filterBrand, filterModel, filterModification, searchQuery, metadataLoaded, categories, subcategories, thirdSubcategories, brands, models, modifications]);

  // Fetch products based on active filters
  const fetchProducts = useCallback(async () => {
      try {
        setIsLoading(true);
      console.log("Fetching products with filters:", {
        category: filterCategory,
        subcategory: filterSubcategory,
        thirdSubcategory: filterThirdSubcategory,
        brand: filterBrand,
        model: filterModel,
        modification: filterModification,
        page: currentPage,
      });
      
      const filters: CatalogFilters = {
          page: currentPage,
        limit: 12, // Show 12 products per page
        depth: 0, // Use flat response for better performance
      };
      
      if (filterCategory) {
        filters.category = filterCategory;
      }
      
      if (filterSubcategory) {
        // Use slug for filtering
        filters.subcategory = filterSubcategory.attributes.slug || '';
      }
      
      if (filterThirdSubcategory) {
        // Use slug for filtering
        filters.thirdsubcategory = filterThirdSubcategory.attributes.slug || '';
      }
      
      if (filterBrand) {
        filters.brand = filterBrand;
      }
      
      if (filterModel) {
        filters.model = filterModel;
      }
      
      if (filterModification) {
        filters.modification = filterModification;
      }
      
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      console.log("[Catalog.tsx] Filters passed to getCatalogProducts:", filters);
      
      const response = await getCatalogProducts(filters);
      const fetchedCmsProducts = response.docs;
      
      console.log(`Fetched ${fetchedCmsProducts.length} products from API`);
      
      setCmsProducts(fetchedCmsProducts);
        setTotalPages(response.totalPages);
        
      // Convert CMS products to frontend format
      setProducts(fetchedCmsProducts.map(convertCmsProductToProduct));
        setIsLoading(false);
      
      console.log("Product IDs returned:", fetchedCmsProducts.map(p => p.id));
      
    } catch (error) {
      console.error("Error fetching products:", error);
        setIsLoading(false);
      setProducts([]);
      setCmsProducts([]);
      setError("Ошибка загрузки товаров"); 
    }
  }, [
    filterCategory,
    filterSubcategory,
    filterThirdSubcategory,
    filterBrand,
    filterModel,
    filterModification,
    searchQuery,
    currentPage,
  ]);

  // Parse search parameters from URL and/or pathname
  useEffect(() => {
    if (!metadataLoaded) return;
    
    // Start with defaults
    let newCategory = initialCategory || null;
    let newSubcategory: Subcategory | null = null;
    let newThirdSubcategory: ThirdSubcategory | null = null;
    let newBrand: string | null = null;
    let newModel: string | null = null;
    let newModification: string | null = null;
    let searchActive = false;
    
    // Parse URL search parameters (query string)
    if (searchParams) {
      const urlCategory = searchParams.get('category');
      const urlSubcategory = searchParams.get('subcategory') || searchParams.get('subcat');
      const urlThirdSubcategory = searchParams.get('thirdsubcategory') || searchParams.get('thirdsubcat');
      const urlBrand = searchParams.get('brand');
      const urlModel = searchParams.get('model');
      const urlModification = searchParams.get('modification') || searchParams.get('mod');
      const searchQuery = searchParams.get('search');
      
      // If any search parameter is present, mark search as active
      if (urlCategory || urlSubcategory || urlThirdSubcategory || urlBrand || urlModel || urlModification || searchQuery) {
        searchActive = true;
        
        // Apply search parameters if present
        if (urlCategory) newCategory = urlCategory;
        if (urlBrand) newBrand = urlBrand;
        if (urlModel) newModel = urlModel;
        if (urlModification) newModification = urlModification;
        
        // Find subcategory by slug if specified
        if (urlSubcategory) {
          const matchedSubcategory = subcategories.find(sub => sub.attributes.slug === urlSubcategory);
          if (matchedSubcategory) newSubcategory = matchedSubcategory;
        }
        
        // Find third subcategory by slug if specified
        if (urlThirdSubcategory) {
          const matchedThirdSubcategory = thirdSubcategories.find(sub => sub.attributes.slug === urlThirdSubcategory);
          if (matchedThirdSubcategory) newThirdSubcategory = matchedThirdSubcategory;
        }
        
        console.log("Search params found:", { 
          category: urlCategory, 
          subcategory: urlSubcategory,
          thirdSubcategory: urlThirdSubcategory,
          brand: urlBrand,
          model: urlModel,
          modification: urlModification,
          search: searchQuery
        });
      }
    }
    
    // If no search parameters but we have a path category (e.g., /catalog/engines)
    if (!searchActive && !initialCategory) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 3 && pathParts[1] === 'catalog') {
        const categorySlug = pathParts[2];
        if (categorySlug) {
          const category = categories.find(cat => cat.slug === categorySlug);
          if (category) {
            newCategory = category.slug;
            console.log("Path category found:", category.slug);
          }
        }
      }
    }
    
    // Apply the determined filters (both to filters and form)
    setFilterCategory(newCategory);
    setFilterSubcategory(newSubcategory);
    setFilterThirdSubcategory(newThirdSubcategory);
    setFilterBrand(newBrand);
    setFilterModel(newModel);
    setFilterModification(newModification);
    setHasActiveSearch(searchActive);
    
    // Also update form state to match
    setFormCategory(newCategory);
    setFormSubcategory(newSubcategory);
    setFormThirdSubcategory(newThirdSubcategory);
    setFormBrand(newBrand);
    setFormModel(newModel);
    setFormModification(newModification);
    
    // Reset pagination when filters change
    setCurrentPage(1);
    
  }, [metadataLoaded, searchParams, pathname, initialCategory, categories, subcategories, thirdSubcategories]);

  // Use a separate useEffect to fetch products when filters change
  useEffect(() => {
    if (!metadataLoaded) return;
    
    // Fetch products based on current filters
    fetchProducts();
    
  }, [
    metadataLoaded, 
    filterCategory, 
    filterSubcategory, 
    filterThirdSubcategory, 
    filterBrand, 
    filterModel, 
    filterModification,
    searchQuery,
    currentPage,
    fetchProducts
  ]);

  // Generate select options for UI
  const categoryOptions = [
    { value: "", label: "Все категории" },
    ...filteredCategories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    }))
  ];
  
  const subcategoryOptions = [
    { value: "", label: "Все подкатегории" },
    ...filteredSubcategories
      .filter(sub => {
        if (!formCategory) return true;
        if (typeof sub.category === 'object' && sub.category) {
          return sub.category.slug === formCategory;
        }
        return false;
      })
      .map((sub) => ({
        value: sub.id.toString(),
        label: sub.attributes.name,
      }))
  ];

  const thirdSubcategoryOptions = [
    { value: "", label: "Все третьи подкатегории" },
    ...filteredThirdSubcategories
      .filter(third => {
        if (!formSubcategory) return true;
        if (typeof third.subcategory === 'object' && third.subcategory) {
          return third.subcategory.id === formSubcategory.id;
        }
        return false;
      })
      .map((third) => ({
        value: third.id.toString(),
        label: third.attributes.name,
      }))
  ];

  const brandOptions = [
    { value: "", label: "Все марки" },
    ...filteredBrands.map((brand) => ({
    value: brand.slug,
    label: brand.name,
    }))
  ];

  const modelOptions = [
    { value: "", label: "Все модели" },
    ...filteredModels.map((model) => ({
    value: model.slug,
    label: model.name,
    }))
  ];

  const modificationOptions = [
    { value: "", label: "Все модификации" },
    ...filteredModifications.map((mod) => ({
    value: mod.slug,
    label: mod.name,
    }))
  ];

  // Form handlers - UPDATED to apply filters immediately
  const handleCategoryChange = (value: string) => {
    const newCategorySlug = value || null;
    setFormCategory(newCategorySlug);
    setFilterCategory(newCategorySlug); // Apply filter immediately
    // Reset downstream form and filter states
    setFormSubcategory(null);
    setFilterSubcategory(null);
    setFormThirdSubcategory(null);
    setFilterThirdSubcategory(null);
    // Optionally reset brand/model/mod if category should clear them
    // setFormBrand(null);
    // setFilterBrand(null);
    // setFormModel(null);
    // setFilterModel(null);
    // setFormModification(null);
    // setFilterModification(null);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSubcategoryChange = (value: string) => {
    let newSubcategory: Subcategory | null = null;
    if (value) {
      newSubcategory = subcategories.find((s) => s.id.toString() === value) || null;
    }
    setFormSubcategory(newSubcategory);
    setFilterSubcategory(newSubcategory); // Apply filter immediately
    // Reset downstream form and filter states
    setFormThirdSubcategory(null);
    setFilterThirdSubcategory(null);
    setCurrentPage(1);
  };
  
  const handleThirdSubcategoryChange = (value: string) => {
    let newThirdSub: ThirdSubcategory | null = null;
    if (value) {
      newThirdSub = thirdSubcategories.find((t) => t.id.toString() === value) || null;
    }
    setFormThirdSubcategory(newThirdSub);
    setFilterThirdSubcategory(newThirdSub); // Apply filter immediately
    setCurrentPage(1);
  };
  
  const handleBrandChange = (value: string) => {
    const newBrandSlug = value || null;
    setFormBrand(newBrandSlug);
    setFilterBrand(newBrandSlug); // Apply filter immediately
    // Reset downstream form and filter states
    setFormModel(null);
    setFilterModel(null);
    setFormModification(null);
    setFilterModification(null);
    // Optionally reset category filters if brand should clear them
    // setFormCategory(null);
    // setFilterCategory(null);
    // setFormSubcategory(null);
    // setFilterSubcategory(null);
    // setFormThirdSubcategory(null);
    // setFilterThirdSubcategory(null);
    setCurrentPage(1);
  };
  
  const handleModelChange = (value: string) => {
    const newModelSlug = value || null;
    setFormModel(newModelSlug);
    setFilterModel(newModelSlug); // Apply filter immediately
    // Reset downstream form and filter states
    setFormModification(null);
    setFilterModification(null);
    setCurrentPage(1);
  };
  
  const handleModificationChange = (value: string) => {
     const newModificationSlug = value || null;
     setFormModification(newModificationSlug);
     setFilterModification(newModificationSlug); // Apply filter immediately
    setCurrentPage(1);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFormCategory(initialCategory || null);
    setFilterCategory(initialCategory || null);
    setFormSubcategory(null);
    setFilterSubcategory(null);
    setFormThirdSubcategory(null);
    setFilterThirdSubcategory(null);
    setFormBrand(null);
    setFilterBrand(null);
    setFormModel(null);
    setFilterModel(null);
    setFormModification(null);
    setFilterModification(null);
    
    // Reset pagination
    setCurrentPage(1);
    
    // Close mobile filters if open
    setShowMobileFilters(false);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Get selected category name for display
  const selectedCategoryName = filterCategory 
    ? categories.find(cat => cat.slug === filterCategory)?.name || "Каталог" 
    : "Каталог продукции";

  // Generate pagination items
  const paginationItems = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

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
            {filterCategory && (
              <>
                <span className="mx-2 text-[#9A9A9A]">/</span>
                <span className="text-[#3B3B3B]">
                  {selectedCategoryName}
                </span>
              </>
            )}
            {filterSubcategory && (
              <>
                <span className="mx-2 text-[#9A9A9A]">/</span>
                <span className="text-[#3B3B3B]">
                  {filterSubcategory.attributes.name}
                </span>
              </>
            )}
          </div>

          {/* Page title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-[#3B3B3B] font-[Roboto_Condensed]">
            {filterThirdSubcategory
              ? filterThirdSubcategory.attributes.name
              : filterSubcategory
                ? filterSubcategory.attributes.name
                : selectedCategoryName}
            {searchParams?.get('search') && 
              <span className="font-normal text-lg ml-2">
              
              </span>
            }
          </h1>

          {/* Mobile filter toggle button */}
          <div className="flex md:hidden mb-4">
            <button
              onClick={toggleMobileFilters}
              className="flex items-center justify-center w-full p-3 bg-[#38AE34] text-white font-medium"
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
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-5">
              <Select
                options={categoryOptions}
                value={formCategory || ""}
                onChange={handleCategoryChange}
                placeholder="Категория"
                className="w-full"
              />
              
              <Select
                options={subcategoryOptions}
                value={formSubcategory ? formSubcategory.id.toString() : ""}
                onChange={handleSubcategoryChange}
                placeholder="Подкатегория"
                className="w-full"
                disabled={!formCategory}
              />

              <Select
                options={thirdSubcategoryOptions}
                value={formThirdSubcategory ? formThirdSubcategory.id.toString() : ""}
                onChange={handleThirdSubcategoryChange}
                placeholder="Третья подкатегория"
                className="w-full"
                disabled={!formSubcategory}
              />

              <Select
                options={brandOptions}
                value={formBrand || ""}
                onChange={handleBrandChange}
                placeholder="Марка"
                className="w-full"
              />

              <Select
                options={modelOptions}
                value={formModel || ""}
                onChange={handleModelChange}
                placeholder="Модель"
                className="w-full"
                disabled={!formBrand}
              />

              <Select
                options={modificationOptions}
                value={formModification || ""}
                onChange={handleModificationChange}
                placeholder="Модификация"
                className="w-full"
                disabled={!formModel}
              />

              <Button
                label="Сбросить"
                variant="noArrow2"
                className="h-[42px] w-full hover:text-black"
                onClick={handleResetFilters}
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
            ) : products.length === 0 && (hasActiveSearch || searchParams?.get('search') || filterCategory || filterSubcategory || filterThirdSubcategory || filterBrand || filterModel || filterModification) ? (
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
                <Arrow direction="left" onClick={handlePrevPage} />
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
                <Arrow direction="right" onClick={handleNextPage} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Catalog;