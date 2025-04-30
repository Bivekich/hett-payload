"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
  let finalBrandValue: string[];
  if (Array.isArray(brandValue)) {
      finalBrandValue = brandValue; // It's already string[]
  } else if (typeof brandValue === 'string' && brandValue !== '') {
      finalBrandValue = [brandValue]; // Wrap single string in array
  } else {
      finalBrandValue = []; // Default to empty array for empty string or other cases
  }
  
  return {
    id: parseInt(cmsProduct.id),
    attributes: {
      name: cmsProduct.name || '',
      article: cmsProduct.article || '',
      oem: cmsProduct.oem || '',
      brand: finalBrandValue, // Assign the guaranteed string[]
      model: typeof cmsProduct.model === 'object' && cmsProduct.model !== null ? cmsProduct.model.name : '',
      modification: typeof cmsProduct.modification === 'object' && cmsProduct.modification !== null ? cmsProduct.modification.name : '',
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
  const router = useRouter();
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
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState<boolean>(false);
  
  // Filter states - Unified state for logic and display
  const [filterCategory, setFilterCategory] = useState<string | null>(initialCategory || null);
  const [filterSubcategory, setFilterSubcategory] = useState<Subcategory | null>(null);
  const [filterThirdSubcategory, setFilterThirdSubcategory] = useState<ThirdSubcategory | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [filterModification, setFilterModification] = useState<string | null>(null);
  const [hasActiveSearch, setHasActiveSearch] = useState<boolean>(false);
  
  // Ref to track the previous search query from URL
  const prevSearchQueryRef = useRef<string | null>(null);
  
  // Load all the metadata (categories, subcategories, brands, models, modifications)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Define common filters for fetching ALL metadata
        const allMetadataFilters: CatalogFilters = { limit: 1000 }; // Set high limit

        // Fetch all metadata in parallel for better performance, passing the filters
        const [
          categoriesResponse, 
          subcategoriesResponse,
          thirdSubcategoriesResponse,
          brandsResponse, 
          modelsResponse,
          modificationsResponse
        ] = await Promise.all([
          getCategories(allMetadataFilters),
          getSubcategories(allMetadataFilters),
          getThirdSubcategories(allMetadataFilters),
          getBrands(allMetadataFilters),
          getModels(allMetadataFilters),
          getModifications(allMetadataFilters)
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

    // Get current search query directly from params for this effect's logic
    const currentSearchQuery = searchParams?.get('search') || '';
    const isSearchActive = !!currentSearchQuery;
    const hasSearchResults = cmsProducts.length > 0;

    // 1. Extract IDs/Slugs from available products (always useful)
    const categoryIdsFromProducts = new Set<string>();
    const subcategoryIdsFromProducts = new Set<string>();
    const thirdSubcategoryIdsFromProducts = new Set<string>();
    const brandIdsFromProducts = new Set<string>(); // Store Brand IDs
    const modelIdsFromProducts = new Set<string>();
    const modificationIdsFromProducts = new Set<string>();

    cmsProducts.forEach(product => {
      const categoryId = typeof product.category === 'object' ? product.category?.id?.toString() : typeof product.category === 'string' ? product.category : undefined;
      const subcategoryId = typeof product.subcategory === 'object' ? product.subcategory?.id?.toString() : typeof product.subcategory === 'string' ? product.subcategory : undefined;
      const thirdSubcategoryId = typeof product.thirdsubcategory === 'object' ? product.thirdsubcategory?.id?.toString() : typeof product.thirdsubcategory === 'string' ? product.thirdsubcategory : undefined;

      // Correctly handle the brand array to extract IDs
      const brandRefs = Array.isArray(product.brand) ? product.brand : (product.brand ? [product.brand] : []);
      brandRefs.forEach(brandRef => {
        const brandId = typeof brandRef === 'object' && brandRef !== null ? brandRef.id?.toString() : typeof brandRef === 'string' || typeof brandRef === 'number' ? String(brandRef) : undefined;
        if (brandId) brandIdsFromProducts.add(brandId);
      });
      
      const modelId = typeof product.model === 'object' ? product.model?.id?.toString() : typeof product.model === 'string' ? product.model : undefined;
      const modificationId = typeof product.modification === 'object' ? product.modification?.id?.toString() : typeof product.modification === 'string' ? product.modification : undefined;

      if (categoryId) categoryIdsFromProducts.add(categoryId);
      if (subcategoryId) subcategoryIdsFromProducts.add(subcategoryId);
      if (thirdSubcategoryId) thirdSubcategoryIdsFromProducts.add(thirdSubcategoryId);
      if (modelId) modelIdsFromProducts.add(modelId);
      if (modificationId) modificationIdsFromProducts.add(modificationId);
    });

    // Initialize final filtered lists
    let finalFilteredCategories: Category[] = [];
    let finalFilteredSubcategories: Subcategory[] = [];
    let finalFilteredThirdSubcategories: ThirdSubcategory[] = [];
    let finalFilteredBrands: CmsBrand[] = [];
    let finalFilteredModels: CmsModel[] = [];
    let finalFilteredModifications: Modification[] = [];

    // 2. Determine the final filtered lists based on search state
    if (isSearchActive && hasSearchResults) {
      // --- Search is Active and has Results: Filter options ONLY based on products --- 
      console.log("[Filter Options Effect] Using SEARCH ACTIVE WITH RESULTS path.");
      finalFilteredCategories = categories.filter(cat => categoryIdsFromProducts.has(cat.id.toString()));
      finalFilteredSubcategories = subcategories.filter(sub => subcategoryIdsFromProducts.has(sub.id.toString()));
      finalFilteredThirdSubcategories = thirdSubcategories.filter(third => thirdSubcategoryIdsFromProducts.has(third.id.toString()));
      finalFilteredBrands = brands.filter(brand => brandIdsFromProducts.has(brand.id.toString()));
      finalFilteredModels = models.filter(model => modelIdsFromProducts.has(model.id.toString()));
      finalFilteredModifications = modifications.filter(mod => modificationIdsFromProducts.has(mod.id.toString()));
      
      // Additionally, apply *selected* filters on top of search results
      if (filterBrand) {
          finalFilteredModels = finalFilteredModels.filter(model => 
            typeof model.brand === 'object' && model.brand?.slug === filterBrand
          );
          finalFilteredModifications = finalFilteredModifications.filter(mod => modificationIdsFromProducts.has(mod.id.toString())); // Ensure mods are from products
      }
      if (filterModel) {
          finalFilteredModifications = finalFilteredModifications.filter(mod => 
            typeof mod.model === 'object' && mod.model?.slug === filterModel
          );
      }
       if (filterCategory) {
          finalFilteredSubcategories = finalFilteredSubcategories.filter(sub => 
             typeof sub.category === 'object' && sub.category?.slug === filterCategory
           );
           finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(third => thirdSubcategoryIdsFromProducts.has(third.id.toString())); // Ensure thirds are from products
       }
       if (filterSubcategory) {
           finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(third => 
             typeof third.subcategory === 'object' && third.subcategory?.id === filterSubcategory.id
           );
       }
       // Brands/Categories might also need filtering based on selected Category/Brand respectively
       if (filterCategory) {
           finalFilteredBrands = finalFilteredBrands.filter(brand => brandIdsFromProducts.has(brand.id.toString())); // Re-filter brands from products matching category
       }
       if (filterBrand) {
           finalFilteredCategories = finalFilteredCategories.filter(cat => categoryIdsFromProducts.has(cat.id.toString())); // Re-filter categories from products matching brand
       }

    } else if (isSearchActive && !hasSearchResults) {
      // --- Search is Active but found NO Results: Show NO options ---
      console.log("[Filter Options Effect] Using SEARCH ACTIVE WITH NO RESULTS path.");
      finalFilteredCategories = [];
      finalFilteredSubcategories = [];
      finalFilteredThirdSubcategories = [];
      finalFilteredBrands = [];
      finalFilteredModels = [];
      finalFilteredModifications = [];

    } else { // Implicitly handles !isSearchActive
      // --- No Active Search: Use existing cross-filtering logic --- 
      console.log("[Filter Options Effect] Using CROSS-FILTERING path (no search active).");
      // Categories: Filter by brand products OR show all if no brand selected
      finalFilteredCategories = categories;
      if (filterBrand) {
        if (hasSearchResults) { // Use hasSearchResults here too
           finalFilteredCategories = categories.filter(cat => categoryIdsFromProducts.has(cat.id.toString()));
        } else {
           // If brand selected but no products (maybe search failed or filters too strict), show no categories
           finalFilteredCategories = [];
        }
      }

      // Subcategories: Filter by category selection AND brand products (if applicable)
      finalFilteredSubcategories = subcategories;
      if (filterCategory) {
         finalFilteredSubcategories = finalFilteredSubcategories.filter(sub => 
           typeof sub.category === 'object' && sub.category?.slug === filterCategory
         );
      }
      if (filterBrand) {
         if (hasSearchResults) {
            finalFilteredSubcategories = finalFilteredSubcategories.filter(sub => 
               subcategoryIdsFromProducts.has(sub.id.toString())
            );
         } else {
            finalFilteredSubcategories = []; // Strict filtering
         }
      }

      // ThirdSubcategories: Filter by subcategory selection AND brand products (if applicable)
      finalFilteredThirdSubcategories = thirdSubcategories;
      if (filterSubcategory) {
        finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(third => 
           typeof third.subcategory === 'object' && third.subcategory?.id === filterSubcategory.id
         );
      }
       if (filterBrand) { // Also filter by brand products
         if (hasSearchResults) {
            finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(third => 
               thirdSubcategoryIdsFromProducts.has(third.id.toString())
            );
         } else {
            finalFilteredThirdSubcategories = []; // Strict filtering
         }
       }

      // Brands: Filter by taxonomy products OR show all if no taxonomy selected
      finalFilteredBrands = brands;
      if (filterCategory || filterSubcategory || filterThirdSubcategory) {
         if (hasSearchResults) {
            finalFilteredBrands = brands.filter(brand => brandIdsFromProducts.has(brand.id.toString()));
         } else {
            // If taxonomy selected but no products, show no brands (strict filtering)
            finalFilteredBrands = [];
         }
      }

      // Models: Filter first by brand selection, then by available products
      finalFilteredModels = models;
      if (filterBrand) {
        finalFilteredModels = finalFilteredModels.filter(model => 
          typeof model.brand === 'object' && model.brand?.slug === filterBrand
        );
        // If products are available for the current filters, refine by product models
        if (hasSearchResults) {
           const modelsInProducts = finalFilteredModels.filter(model => 
              modelIdsFromProducts.has(model.id.toString())
           );
           // Only apply product filter if it results in a non-empty list, otherwise keep brand-filtered
           // This logic might be too complex, maybe stick to brand filter?
           // Let's simplify: if brand selected, just show models for that brand initially
           // Product filtering happens implicitly via other filters
           // NO - Keep the product filtering, but ensure it doesn't break things
            if (modelsInProducts.length > 0 || !isSearchActive) { // Apply if results or not searching
               finalFilteredModels = modelsInProducts;
           } else if (isSearchActive && modelsInProducts.length === 0) {
              finalFilteredModels = []; // No models from search results match brand
           } else {
             console.log("No models found in current products for selected brand, showing all models for the brand (cross-filter mode).");
           }
        } else if (filterCategory || filterSubcategory || filterThirdSubcategory || filterModel || filterModification || isSearchActive) {
           // If other filters active but no products, strictly filter models (show none)
           // Let's refine: Only show none if *not* just a brand filter is selected
           if(filterCategory || filterSubcategory || filterThirdSubcategory || filterModel || filterModification || isSearchActive) {
              finalFilteredModels = [];
           }
        }
      } else { // No brand selected
         // If taxonomy selected, filter models by products found for that taxonomy
         if ((filterCategory || filterSubcategory || filterThirdSubcategory) && hasSearchResults) {
             finalFilteredModels = models.filter(model => modelIdsFromProducts.has(model.id.toString()));
         } else if (filterCategory || filterSubcategory || filterThirdSubcategory) {
             finalFilteredModels = []; // Taxonomy selected, no products
         }
         // Otherwise (no filters at all), show all models (already initialized)
      }

      // Modifications: Filter first by model selection, then by available products
      finalFilteredModifications = modifications;
      if (filterModel) {
         finalFilteredModifications = finalFilteredModifications.filter(mod => 
           typeof mod.model === 'object' && mod.model?.slug === filterModel
         );
         // If products are available for the current filters, refine by product modifications
         if (hasSearchResults) {
            const modificationsInProducts = finalFilteredModifications.filter(mod => 
               modificationIdsFromProducts.has(mod.id.toString())
            );
           if (modificationsInProducts.length > 0 || !isSearchActive) {
               finalFilteredModifications = modificationsInProducts;
           } else if (isSearchActive && modificationsInProducts.length === 0) {
              finalFilteredModifications = []; // No mods from search results match model
           } else {
              console.log("No modifications found in current products for selected model, showing all modifications for the model (cross-filter mode).");
           }
         } else if (filterCategory || filterSubcategory || filterThirdSubcategory || filterBrand || filterModification || isSearchActive) {
           if(filterCategory || filterSubcategory || filterThirdSubcategory || filterBrand || filterModification || isSearchActive) {
            // If other filters active but no products, strictly filter modifications (show none)
             finalFilteredModifications = [];
           }
         }
      } else { // No model selected
          // If brand selected, filter modifications by products for that brand
          if (filterBrand && hasSearchResults) {
              finalFilteredModifications = modifications.filter(mod => modificationIdsFromProducts.has(mod.id.toString()));
          } else if (filterBrand) {
              finalFilteredModifications = []; // Brand selected, no products
          }
          // Further filter by taxonomy if selected
          if ((filterCategory || filterSubcategory || filterThirdSubcategory) && hasSearchResults) {
              finalFilteredModifications = finalFilteredModifications.filter(mod => modificationIdsFromProducts.has(mod.id.toString()));
          } else if (filterCategory || filterSubcategory || filterThirdSubcategory) {
              finalFilteredModifications = []; // Taxonomy selected, no products
          }
      }
    }

    // 3. Update the state for filtered options
    console.log(`[Filter Options Effect] Final counts: Cat=${finalFilteredCategories.length}, Sub=${finalFilteredSubcategories.length}, Third=${finalFilteredThirdSubcategories.length}, Brand=${finalFilteredBrands.length}, Model=${finalFilteredModels.length}, Mod=${finalFilteredModifications.length}`);
    setFilteredCategories(finalFilteredCategories);
    setFilteredSubcategories(finalFilteredSubcategories);
    setFilteredThirdSubcategories(finalFilteredThirdSubcategories);
    setFilteredBrands(finalFilteredBrands);
    setFilteredModels(finalFilteredModels);
    setFilteredModifications(finalFilteredModifications);

  }, [cmsProducts, filterCategory, filterSubcategory, filterThirdSubcategory, filterBrand, filterModel, filterModification, searchParams, metadataLoaded, categories, subcategories, thirdSubcategories, brands, models, modifications]);

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

  // Parse search parameters from URL and sync state (Effect 1)
  useEffect(() => {
    if (!metadataLoaded) return;
    
    console.log("Effect 1: Parsing URL params", searchParams.toString());
    
    const currentSearchQuery = searchParams.get('search') || ''; // Get current search, default to empty string
    const previousSearchQuery = prevSearchQueryRef.current;
    
    // Check if search query itself has changed
    const hasSearchQueryChanged = currentSearchQuery !== previousSearchQuery;
    
    if (hasSearchQueryChanged) {
        console.log(`Effect 1: Search query changed from '${previousSearchQuery}' to '${currentSearchQuery}'. Clearing other filters.`);
        // Update the ref for the next render AFTER the comparison
        prevSearchQueryRef.current = currentSearchQuery;
    }

    // Start with defaults
    let newCategory = initialCategory || null;
    let newSubcategory: Subcategory | null = null;
    let newThirdSubcategory: ThirdSubcategory | null = null;
    let newBrand: string | null = null;
    let newModel: string | null = null;
    let newModification: string | null = null;
    let searchActive = !!currentSearchQuery; // Active if there's a search query

    // If search query changed, ignore other URL params for this cycle
    if (!hasSearchQueryChanged && searchParams) {
        const urlCategory = searchParams.get('category');
        const urlSubcategory = searchParams.get('subcategory') || searchParams.get('subcat');
        const urlThirdSubcategory = searchParams.get('thirdsubcategory') || searchParams.get('thirdsubcat');
        const urlBrand = searchParams.get('brand');
        const urlModel = searchParams.get('model');
        const urlModification = searchParams.get('modification') || searchParams.get('mod');
        // currentSearchQuery already handles the search part
        
        // Only consider filters active if search didn't just change
        if (urlCategory || urlSubcategory || urlThirdSubcategory || urlBrand || urlModel || urlModification) {
          searchActive = true; // Keep active if any filter is present
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
          
          console.log("Effect 1: Applying non-search params from URL", { newCategory, newSubcategory, newThirdSubcategory, newBrand, newModel, newModification });
        }
    } else if (!hasSearchQueryChanged) { 
      // Handle path category only if search didn't change
      // If no search parameters but we have a path category (e.g., /catalog/engines)
      if (!searchActive && !initialCategory) {
        const pathParts = pathname.split("/");
        if (pathParts.length >= 3 && pathParts[1] === 'catalog') {
          const categorySlug = pathParts[2];
          if (categorySlug) {
            const category = categories.find(cat => cat.slug === categorySlug);
            if (category) {
              newCategory = category.slug;
              searchActive = true; // Path category implies active filter state
              console.log("Path category found:", category.slug);
            }
          }
        }
      }
    }
    
    // Apply the determined filters (will be defaults/cleared if search changed)
    setFilterCategory(newCategory);
    setFilterSubcategory(newSubcategory);
    setFilterThirdSubcategory(newThirdSubcategory);
    setFilterBrand(newBrand);
    setFilterModel(newModel);
    setFilterModification(newModification);
    setHasActiveSearch(searchActive); // Based on whether ANY filter or search is active
    
    // Always reset to page 1 when URL parameters change significantly (including search)
    setCurrentPage(1); 

    // Only set initial sync complete after the first run potentially triggered by metadata load
    if (!isInitialSyncComplete) {
       setIsInitialSyncComplete(true); 
       console.log("Effect 1: Initial sync complete flag set.");
       // Update the ref with initial search param on first run if needed
       if (previousSearchQuery === null) { // Only if it hasn't been set yet
           prevSearchQueryRef.current = currentSearchQuery;
       }
    } else if (hasSearchQueryChanged) {
        // If search changed AFTER initial sync, log it.
        console.log("Effect 1: State updated due to search query change.");
    } else {
        console.log("Effect 1: State sync from URL complete (no search change).");
    }
    
  }, [metadataLoaded, searchParams, pathname, initialCategory, categories, subcategories, thirdSubcategories]); // REMOVE isInitialSyncComplete from dependencies

  // Use a separate useEffect to fetch products when filters change (Effect 3)
  useEffect(() => {
    // Only fetch if the initial sync is done to avoid fetching with potentially incomplete state
    if (!metadataLoaded || !isInitialSyncComplete) return;
    
    console.log("Effect 3: Fetching products triggered by state/page change");
    fetchProducts();
    
  }, [
    metadataLoaded, 
    isInitialSyncComplete, // Add flag dependency
    filterCategory, 
    filterSubcategory, 
    filterThirdSubcategory, 
    filterBrand, 
    filterModel, 
    filterModification,
    searchQuery, // This uses the searchQuery derived from searchParams in the component scope
    currentPage,
    fetchProducts
  ]);

  // Update URL when filters change (Effect 2)
  useEffect(() => {
    // Wait for metadata AND initial sync from URL to complete
    if (!metadataLoaded || !isInitialSyncComplete) {
      // console.log("Effect 2: Skipping URL update (pre-sync)");
      return; 
    }

    // console.log("Effect 2: Checking if URL needs update based on state");
    const newQueryParams = new URLSearchParams();
    // const currentSearchFromUrl = searchParams.get('search'); // REMOVED: Don't read directly

    // Build query params from the current FILTER state
    if (filterCategory) newQueryParams.set('category', filterCategory);
    if (filterSubcategory) { 
      const subcatSlug = filterSubcategory.attributes.slug;
      if (subcatSlug) {
        newQueryParams.set('subcategory', subcatSlug);
      } else {
        console.warn(`Subcategory ${filterSubcategory.id} missing slug for URL`);
      }
    }
    if (filterThirdSubcategory) {
      const thirdSubcatSlug = filterThirdSubcategory.attributes.slug;
      if (thirdSubcatSlug) {
        newQueryParams.set('thirdsubcategory', thirdSubcatSlug);
      } else {
        console.warn(`Third Subcategory ${filterThirdSubcategory.id} missing slug for URL`);
      }
    }
    if (filterBrand) newQueryParams.set('brand', filterBrand);
    if (filterModel) newQueryParams.set('model', filterModel);
    if (filterModification) newQueryParams.set('modification', filterModification);
    
    // ALSO include the search parameter FROM COMPONENT STATE if it exists
    if (searchQuery) { // Use component-level searchQuery state
      newQueryParams.set('search', searchQuery);
    }

    const newQueryString = newQueryParams.toString();
    const freshSearchParams = new URLSearchParams(window.location.search);
    const currentQueryString = freshSearchParams.toString();

    if (newQueryString !== currentQueryString) {
      // console.log(`Effect 2: Updating URL. Current='${currentQueryString}', New='${newQueryString}'`);
      router.push(`${pathname}${newQueryString ? '?' + newQueryString : ''}`, { scroll: false });
    } else {
      // console.log("Effect 2: No URL update needed (state matches URL)");
    }

  }, [
    // Depend ONLY on filter states AND the sync flag
    filterCategory, 
    filterSubcategory, 
    filterThirdSubcategory, 
    filterBrand, 
    filterModel, 
    filterModification, 
    // REMOVE searchQuery state dependency
    isInitialSyncComplete, 
    // Keep others needed for the effect execution
    metadataLoaded, 
    router,         
    pathname,
  ]);

  // Generate select options for UI
  const categoryOptions = [
    { value: "", label: "Все категории" },
    ...filteredCategories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    }))
  ];
  
  // MODIFIED SUBCATEGORY OPTIONS GENERATION
  const generateSubcategoryOptions = () => {
    const options = [{ value: "", label: "Все подкатегории" }];

    // Explicitly add the currently selected subcategory if it exists
    if (filterSubcategory) {
      options.push({
        value: filterSubcategory.id.toString(),
        label: filterSubcategory.attributes.name,
      });
    }

    // Add other relevant subcategories from the filtered list
    filteredSubcategories
      .filter(sub => {
        // Filter based on category and ensure not duplicating the selected one
        if (filterSubcategory && sub.id === filterSubcategory.id) return false; // Already added
        if (!filterCategory) return true; 
        return typeof sub.category === 'object' && sub.category?.slug === filterCategory;
      })
      .forEach((sub) => {
        options.push({
          value: sub.id.toString(),
          label: sub.attributes.name,
        });
      });

    return options;
  };
  const subcategoryOptions = generateSubcategoryOptions();

  const thirdSubcategoryOptions = [
    { value: "", label: "Все третьи подкатегории" },
    ...filteredThirdSubcategories
      .filter(third => {
        // Filter based on the ACTUAL filterSubcategory state
        if (!filterSubcategory) return true; 
        if (typeof third.subcategory === 'object' && third.subcategory) {
          return third.subcategory.id === filterSubcategory.id;
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

  // Form handlers - UPDATED to only set filter... state
  const handleCategoryChange = (value: string) => {
    const newCategorySlug = value || null;
    // setFormCategory(newCategorySlug); // Removed
    setFilterCategory(newCategorySlug); 
    // Reset downstream filter states
    setFilterSubcategory(null);
    setFilterThirdSubcategory(null);
    setCurrentPage(1); 
  };

  const handleSubcategoryChange = (value: string) => {
    let newSubcategory: Subcategory | null = null;
    if (value) {
      newSubcategory = subcategories.find((s) => s.id.toString() === value) || null;
    }
    // setFormSubcategory(newSubcategory); // Removed
    setFilterSubcategory(newSubcategory); 
    // Reset downstream filter states
    setFilterThirdSubcategory(null);
    setCurrentPage(1);
  };
  
  const handleThirdSubcategoryChange = (value: string) => {
    let newThirdSub: ThirdSubcategory | null = null;
    if (value) {
      newThirdSub = thirdSubcategories.find((t) => t.id.toString() === value) || null;
    }
    // setFormThirdSubcategory(newThirdSub); // Removed
    setFilterThirdSubcategory(newThirdSub); 
    setCurrentPage(1);
  };
  
  const handleBrandChange = (value: string) => {
    const newBrandSlug = value || null;
    // setFormBrand(newBrandSlug); // Removed
    setFilterBrand(newBrandSlug); 
    // Reset downstream filter states
    setFilterModel(null);
    setFilterModification(null);
    setCurrentPage(1);
  };
  
  const handleModelChange = (value: string) => {
    const newModelSlug = value || null;
    // setFormModel(newModelSlug); // Removed
    setFilterModel(newModelSlug); 
    // Reset downstream filter states
    setFilterModification(null);
    setCurrentPage(1);
  };
  
  const handleModificationChange = (value: string) => {
     const newModificationSlug = value || null;
     // setFormModification(newModificationSlug); // Removed
     setFilterModification(newModificationSlug); 
    setCurrentPage(1);
  };

  // Reset filters handler - UPDATED
  const handleResetFilters = () => {
    // ONLY update URL: Create new params object, remove all relevant keys
    const params = new URLSearchParams(); // Start with an empty params object

    // We don't need to read the old params, just navigate to the base path
    // Keep any other unrelated params if necessary (though usually not for filters)
    // const currentParams = new URLSearchParams(searchParams?.toString());
    // currentParams.forEach((value, key) => {
    //   if (!['category', 'subcategory', 'thirdsubcategory', 'brand', 'model', 'modification', 'page', 'search'].includes(key)) {
    //     params.set(key, value);
    //   }
    // });

    const queryString = params.toString(); // Will be empty in this simple case
    console.log("handleResetFilters pushing clean URL:", `${pathname}${queryString ? `?${queryString}` : ''}`);
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`); // Navigate to path without any filter/search params

    // Close mobile filters if open
    if (showMobileFilters) {
      setShowMobileFilters(false);
    }
    // Let Effect 1 handle syncing the state from the new, clean URL
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

  // Generate pagination items
  const paginationItems = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="bg-[#F5F5F5]">
      <Container>
        <div className="py-4 md:py-8">
          {/* Breadcrumbs - REMOVED */}
          {/* 
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
          */}

          

          {/* Mobile filter toggle button - REMOVED */}

          {/* Filters section */}
          <div className="mb-6 md:mb-8">
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 md:gap-5">
              {/* First column on mobile: Taxonomy filters */}
              <div className="grid grid-cols-1 gap-3 md:contents">
                <Select
                  options={categoryOptions}
                  value={filterCategory || ""}
                  onChange={handleCategoryChange}
                  placeholder="Категория"
                  className="w-full"
                />
                
                <Select
                  options={subcategoryOptions}
                  value={filterSubcategory ? filterSubcategory.id.toString() : ""}
                  onChange={handleSubcategoryChange}
                  placeholder="Подкатегория"
                  className="w-full"
                  disabled={!filterCategory}
                />

                <Select
                  options={thirdSubcategoryOptions}
                  value={filterThirdSubcategory ? filterThirdSubcategory.id.toString() : ""}
                  onChange={handleThirdSubcategoryChange}
                  placeholder="Третья подкатегория"
                  className="w-full"
                  disabled={!filterSubcategory}
                />
              </div>

              {/* Second column on mobile: Vehicle filters */}
              <div className="grid grid-cols-1 gap-3 md:contents">
                <Select
                  options={brandOptions}
                  value={filterBrand || ""}
                  onChange={handleBrandChange}
                  placeholder="Марка"
                  className="w-full"
                />

                <Select
                  options={modelOptions}
                  value={filterModel || ""}
                  onChange={handleModelChange}
                  placeholder="Модель"
                  className="w-full"
                  disabled={!filterBrand}
                />

                <Select
                  options={modificationOptions}
                  value={filterModification || ""}
                  onChange={handleModificationChange}
                  placeholder="Модификация"
                  className="w-full"
                  disabled={!filterModel}
                />
              </div>

              {/* Reset button - full width on mobile */}
              <div className="col-span-2 md:col-span-1">
                <Button
                  label="Сбросить"
                  variant="noArrow2"
                  className="h-[42px] w-full hover:text-black"
                  onClick={handleResetFilters}
                />
              </div>
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