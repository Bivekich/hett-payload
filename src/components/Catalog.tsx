"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
export const convertCmsProductToProduct = (cmsProduct: CmsProduct) => {
  // Process image URL to ensure it's absolute
  let imageUrl = '';
  
  if (cmsProduct.images && cmsProduct.images.length > 0) {
    console.log('Image data:', cmsProduct.images[0]); // Debug log
    
    // Handle different possible image formats
    if (typeof cmsProduct.images[0] === 'string') {
      // Direct string URL
      imageUrl = cmsProduct.images[0];
    } else if (typeof cmsProduct.images[0].image === 'string') {
      // Object with image as string
      imageUrl = cmsProduct.images[0].image;
    } else if (cmsProduct.images[0].image?.url) {
      // Object with nested image object containing url
      imageUrl = cmsProduct.images[0].image.url;
    } else if (typeof cmsProduct.images[0] === 'object' && 'url' in cmsProduct.images[0]) {
      // Direct object with url property (from API with depth=1)
      imageUrl = (cmsProduct.images[0] as { url: string }).url;
    }
    
    // Make URL absolute if it's relative
    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${API_URL}${imageUrl}`;
    }
    
    console.log('Processed image URL:', imageUrl); // Debug log
  }
  
  return {
    id: parseInt(cmsProduct.id),
    attributes: {
      name: cmsProduct.name,
      slug: cmsProduct.slug,
      article: cmsProduct.sku || '',
      price: cmsProduct.price ? cmsProduct.price.toString() : '',
      brand: typeof cmsProduct.brand === 'string' ? cmsProduct.brand : cmsProduct.brand?.name || '',
      model: typeof cmsProduct.model === 'string' ? cmsProduct.model : cmsProduct.model?.name || '',
      modification: typeof cmsProduct.modification === 'string' ? cmsProduct.modification : cmsProduct.modification?.name || '',
      oem: cmsProduct.oem || '',
      image: {
        data: {
          attributes: {
            url: imageUrl,
          },
        },
      },
      // Convert rich text to string if needed
      description: cmsProduct.description 
        ? typeof cmsProduct.description === 'string' 
          ? cmsProduct.description 
          : JSON.stringify(cmsProduct.description)
        : undefined,
      
      // Map specifications from CMS
      specifications: cmsProduct.specifications?.map(spec => ({
        name: spec.name,
        value: spec.value
      })) || [],
      
      // Map marketplace links
      marketplaceLinks: {
        ozon: cmsProduct.marketplaceLinks?.ozon || '',
        wildberries: cmsProduct.marketplaceLinks?.wildberries || '',
        others: cmsProduct.marketplaceLinks?.others?.map(m => ({
          name: m.name,
          url: m.url,
          logo: m.logo
        })) || []
      },
      
      // Map distributors
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
  const router = useRouter();
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

  // New helper function to update filter options based on fetched products
  const updateFilterOptions = useCallback((products: CmsProduct[]) => {
    if (!products.length) return;
    
    // Save the current category filter
    const currentCategorySlug = filterCategory;
    
    // For each product, collect the unique values of related entities
    const categorySet = new Set<number>();
    const subcategorySet = new Set<number>();
    const thirdSubcategorySet = new Set<number>();
    const brandSet = new Set<number>();
    const modelSet = new Set<number>();
    const modificationSet = new Set<number>();
    
    // Go through all products and collect IDs
    products.forEach(product => {
      // Safely get IDs handling both object and ID formats
      const categoryId = typeof product.category === 'object' ? product.category?.id : product.category;
      const subcategoryId = typeof product.subcategory === 'object' ? product.subcategory?.id : product.subcategory;
      const thirdSubcategoryId = typeof product.thirdsubcategory === 'object' ? product.thirdsubcategory?.id : product.thirdsubcategory;
      const brandId = typeof product.brand === 'object' ? product.brand?.id : product.brand;
      const modelId = typeof product.model === 'object' ? product.model?.id : product.model;
      const modificationId = typeof product.modification === 'object' ? product.modification?.id : product.modification;
      
      // Add IDs to sets if they exist
      if (categoryId) categorySet.add(Number(categoryId));
      if (subcategoryId) subcategorySet.add(Number(subcategoryId));
      if (thirdSubcategoryId) thirdSubcategorySet.add(Number(thirdSubcategoryId));
      if (brandId) brandSet.add(Number(brandId));
      if (modelId) modelSet.add(Number(modelId));
      if (modificationId) modificationSet.add(Number(modificationId));
    });
    
    console.log("Related entity IDs from products:", {
      categories: Array.from(categorySet),
      subcategories: Array.from(subcategorySet),
      thirdSubcategories: Array.from(thirdSubcategorySet),
      brands: Array.from(brandSet),
      models: Array.from(modelSet),
      modifications: Array.from(modificationSet)
    });
    
    // Only update filtered options if we're not on a specific category page
    // This prevents confusing the user when they're browsing a specific category
    if (!initialCategory && !currentCategorySlug) {
      // Update brand options based on the products we received
      setFilteredBrands(brands.filter(brand => 
        brandSet.has(Number(brand.id))
      ));
      
      // Update model options based on the products we received
      setFilteredModels(models.filter(model => 
        modelSet.has(Number(model.id))
      ));
      
      // Update modification options based on the products we received
      setFilteredModifications(modifications.filter(mod => 
        modificationSet.has(Number(mod.id))
      ));
    }
  }, [initialCategory, filterCategory, brands, models, modifications]);

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
      
      // Build filter object for API call
      const filters: CatalogFilters = {
          page: currentPage,
        limit: 12, // Show 12 products per page
        depth: 0, // Use flat response for better performance
      };
      
      // Only add filters if they are not null/empty
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
      
      console.log("API filters:", filters);
      
      // Use optimized catalog fetch to prevent n+1 query problems
      const response = await getCatalogProducts(filters);
      
      // Process products for display
      const cmsProducts = response.docs;
      
      console.log(`Fetched ${cmsProducts.length} products from API`);
      
      setCmsProducts(cmsProducts);
        setTotalPages(response.totalPages);
        
      // Convert CMS products to frontend format
      setProducts(cmsProducts.map(convertCmsProductToProduct));
        setIsLoading(false);
      
      // Log the IDs of the products we got back for debugging
      console.log("Product IDs returned:", cmsProducts.map(p => p.id));
      
      // After loading products, update the filtered options based on what we got back
      updateFilterOptions(cmsProducts);
      
    } catch (error) {
      console.error("Error fetching products:", error);
        setIsLoading(false);
      setProducts([]);
      setCmsProducts([]);
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
    updateFilterOptions
  ]);
  
  // Filter brands based on current category selection
  useEffect(() => {
    if (!metadataLoaded) return;
    
    // If no category selected, reset filters to all options
    if (!filterCategory) {
      setFilteredBrands(brands);
      console.log("No category filter, showing all brands");
      return;
    }
    
    // When a category is selected, only show brands that have products in this category
    console.log(`Filtering brands for category ${filterCategory}`);
    
    // Find the category object from the slug
    const categoryObj = categories.find(cat => cat.slug === filterCategory);
    if (!categoryObj) {
      console.log(`Could not find category object for slug ${filterCategory}`);
      setFilteredBrands(brands);
      return;
    }
    
    // For debugging: log the categoryId we're filtering by
    console.log(`Found category with ID ${categoryObj.id}`);
    
    // If no products loaded yet, we can't filter by products
    if (cmsProducts.length === 0) {
      console.log("No products loaded yet, can't filter brands by products");
      setFilteredBrands(brands);
      return;
    }
    
    // Create a set to store brand IDs that have products in this category
    const brandIds = new Set<string>();
    
    // Log product relationships for debugging
    cmsProducts.forEach(product => {
      const productCategoryId = typeof product.category === 'object' 
        ? product.category?.id 
        : product.category;
        
      const productBrandId = typeof product.brand === 'object'
        ? product.brand?.id
        : product.brand;
        
      if (productCategoryId && productBrandId) {
        console.log(`Product ${product.id} has category ${productCategoryId} and brand ${productBrandId}`);
      }
    });
    
    // Collect brands that have products in this category
    cmsProducts.forEach(product => {
      const productCategoryId = typeof product.category === 'object' 
        ? product.category?.id 
        : product.category;
        
      // Use toString() to normalize the comparison
      if (productCategoryId && productCategoryId.toString() === categoryObj.id.toString()) {
        const brandId = typeof product.brand === 'object' 
          ? product.brand?.id 
          : product.brand;
          
        if (brandId) {
          brandIds.add(brandId.toString());
        }
      }
    });
    
    console.log(`Found ${brandIds.size} matching brand IDs:`, Array.from(brandIds));
    
    // Filter brands to only those that have products in this category
    const categoryBrands = brands.filter(brand => 
      brandIds.has(brand.id.toString())
    );
    
    if (categoryBrands.length > 0) {
      setFilteredBrands(categoryBrands);
      console.log(`Filtered brands for category ${filterCategory}:`, categoryBrands.map(b => b.name));
    } else {
      // If no brands found, show all brands
      console.log(`No brands found for category ${filterCategory}, showing all brands`);
      setFilteredBrands(brands);
    }
  }, [metadataLoaded, filterCategory, categories, brands, cmsProducts]);

  // Filter models based on current brand selection
  useEffect(() => {
    if (!metadataLoaded) return;
    
    // If no brand selected, show models for the current category
    if (!filterBrand) {
      if (filterCategory && cmsProducts.length > 0) {
        // Find models that belong to products in this category
        const modelIds = new Set<string>();
        
        // Find the category object from the slug
        const categoryObj = categories.find(cat => cat.slug === filterCategory);
        if (!categoryObj) {
          console.log(`Could not find category object for slug ${filterCategory}`);
          setFilteredModels(models);
          return;
        }
        
        // Log the category we're filtering by
        console.log(`Filtering models for category ID ${categoryObj.id}`);
        
        cmsProducts.forEach(product => {
          const productCategoryId = typeof product.category === 'object' 
            ? product.category?.id 
            : product.category;
            
          // Use toString() to normalize the comparison
          if (productCategoryId && productCategoryId.toString() === categoryObj.id.toString()) {
            const modelId = typeof product.model === 'object' 
              ? product.model?.id 
              : product.model;
              
            if (modelId) {
              modelIds.add(modelId.toString());
            }
          }
        });
        
        console.log(`Found ${modelIds.size} matching model IDs:`, Array.from(modelIds));
        
        // Filter models to only those in this category
        const categoryModels = models.filter(model => 
          modelIds.has(model.id.toString())
        );
        
        if (categoryModels.length > 0) {
          setFilteredModels(categoryModels);
          console.log(`Filtered models for category ${filterCategory}:`, categoryModels.map(m => m.name));
          return;
        }
      }
      
      // Default to all models if no category filter or no matches
      setFilteredModels(models);
      return;
    }
    
    // When a brand is selected, show only models for that brand
    // First find the brand object
    const brandObj = brands.find(b => b.slug === filterBrand);
    if (!brandObj) {
      console.log(`Could not find brand object for slug ${filterBrand}`);
      setFilteredModels(models);
      return;
    }
    
    // Log the brand we're filtering by
    console.log(`Filtering models for brand ID ${brandObj.id}`);
    
    // For extra validation, check if there are products with this brand in the result set
    if (cmsProducts.length > 0) {
      const modelIds = new Set<string>();
      
      cmsProducts.forEach(product => {
        const productBrandId = typeof product.brand === 'object' 
          ? product.brand?.id 
          : product.brand;
          
        // Use toString() to normalize the comparison
        if (productBrandId && productBrandId.toString() === brandObj.id.toString()) {
          const modelId = typeof product.model === 'object' 
            ? product.model?.id 
            : product.model;
            
          if (modelId) {
            modelIds.add(modelId.toString());
          }
        }
      });
      
      console.log(`Found ${modelIds.size} models in products for brand ${filterBrand}:`, Array.from(modelIds));
      
      if (modelIds.size > 0) {
        // Filter models to only those in products
        const brandProductModels = models.filter(model => 
          modelIds.has(model.id.toString())
        );
        
        if (brandProductModels.length > 0) {
          setFilteredModels(brandProductModels);
          console.log(`Using product-based filtered models for brand ${filterBrand}:`, brandProductModels.map(m => m.name));
          return;
        }
      }
    }
    
    // Fall back to relationship-based filtering
    // Filter models to only those belonging to the selected brand
    const filtered = models.filter(model => {
      const modelBrandId = typeof model.brand === 'object' 
        ? model.brand?.id 
        : model.brand;
        
      return modelBrandId && modelBrandId.toString() === brandObj.id.toString();
    });
    
    if (filtered.length > 0) {
      setFilteredModels(filtered);
      console.log(`Filtered models for brand ${filterBrand}:`, filtered.map(m => m.name));
    } else {
      // If no matching models, show all models
      setFilteredModels(models);
      console.log(`No models found for brand ${filterBrand}, showing all models`);
    }
  }, [metadataLoaded, filterBrand, filterCategory, models, brands, cmsProducts, categories]);

  // Filter modifications based on current model selection
  useEffect(() => {
    if (!metadataLoaded) return;
    
    // If no model selected, but we have a brand, show modifications for that brand
    if (!filterModel && filterBrand && cmsProducts.length > 0) {
      // Find the brand object from the slug
      const brandObj = brands.find(b => b.slug === filterBrand);
      if (!brandObj) {
        console.log(`Could not find brand object for slug ${filterBrand}`);
        setFilteredModifications(modifications);
        return;
      }
      
      // Log the brand we're filtering by
      console.log(`Filtering modifications for brand ID ${brandObj.id}`);
      
      // Find modifications available for this brand from products
      const modIds = new Set<string>();
      
      cmsProducts.forEach(product => {
        const productBrandId = typeof product.brand === 'object' 
          ? product.brand?.id 
          : product.brand;
          
        // Use toString() to normalize the comparison
        if (productBrandId && productBrandId.toString() === brandObj.id.toString()) {
          const modId = typeof product.modification === 'object' 
            ? product.modification?.id 
            : product.modification;
            
          if (modId) {
            modIds.add(modId.toString());
          }
        }
      });
      
      console.log(`Found ${modIds.size} matching modification IDs for brand:`, Array.from(modIds));
      
      // Filter modifications to only those for this brand
      const brandMods = modifications.filter(mod => 
        modIds.has(mod.id.toString())
      );
      
      if (brandMods.length > 0) {
        setFilteredModifications(brandMods);
        console.log(`Filtered modifications for brand ${filterBrand}:`, brandMods.map(m => m.name));
        return;
      }
    }
    
    // If no model selected at all, show all modifications (or filtered by category if set)
    if (!filterModel) {
      if (filterCategory && cmsProducts.length > 0) {
        // Find the category object from the slug
        const categoryObj = categories.find(cat => cat.slug === filterCategory);
        if (!categoryObj) {
          console.log(`Could not find category object for slug ${filterCategory}`);
          setFilteredModifications(modifications);
          return;
        }
        
        // Log the category we're filtering by
        console.log(`Filtering modifications for category ID ${categoryObj.id}`);
        
        // Find modifications that belong to products in this category
        const modIds = new Set<string>();
        
        cmsProducts.forEach(product => {
          const productCategoryId = typeof product.category === 'object' 
            ? product.category?.id 
            : product.category;
            
          // Use toString() to normalize the comparison
          if (productCategoryId && productCategoryId.toString() === categoryObj.id.toString()) {
            const modId = typeof product.modification === 'object' 
              ? product.modification?.id 
              : product.modification;
              
            if (modId) {
              modIds.add(modId.toString());
            }
          }
        });
        
        console.log(`Found ${modIds.size} matching modification IDs for category:`, Array.from(modIds));
        
        // Filter modifications to only those in this category
        const categoryMods = modifications.filter(mod => 
          modIds.has(mod.id.toString())
        );
        
        if (categoryMods.length > 0) {
          setFilteredModifications(categoryMods);
          console.log(`Filtered modifications for category ${filterCategory}:`, categoryMods.map(m => m.name));
          return;
        }
      }
      
      // Default to all modifications
      setFilteredModifications(modifications);
      return;
    }
    
    // When a model is selected, show only modifications for that model
    // First find the model object
    const modelObj = models.find(m => m.slug === filterModel);
    if (!modelObj) {
      console.log(`Could not find model object for slug ${filterModel}`);
      setFilteredModifications(modifications);
      return;
    }
    
    // Log the model we're filtering by
    console.log(`Filtering modifications for model ID ${modelObj.id}`);
    
    // For extra validation, check if there are products with this model in the result set
    if (cmsProducts.length > 0) {
      const modIds = new Set<string>();
      
      cmsProducts.forEach(product => {
        const productModelId = typeof product.model === 'object' 
          ? product.model?.id 
          : product.model;
          
        // Use toString() to normalize the comparison
        if (productModelId && productModelId.toString() === modelObj.id.toString()) {
          const modId = typeof product.modification === 'object' 
            ? product.modification?.id 
            : product.modification;
            
          if (modId) {
            modIds.add(modId.toString());
          }
        }
      });
      
      console.log(`Found ${modIds.size} modifications in products for model ${filterModel}:`, Array.from(modIds));
      
      if (modIds.size > 0) {
        // Filter modifications to only those in products
        const modelProductMods = modifications.filter(mod => 
          modIds.has(mod.id.toString())
        );
        
        if (modelProductMods.length > 0) {
          setFilteredModifications(modelProductMods);
          console.log(`Using product-based filtered modifications for model ${filterModel}:`, modelProductMods.map(m => m.name));
          return;
        }
      }
    }
    
    // Fall back to relationship-based filtering
    // Filter modifications to only those belonging to the selected model
    const filtered = modifications.filter(mod => {
      const modModelId = typeof mod.model === 'object' 
        ? mod.model?.id 
        : mod.model;
        
      return modModelId && modModelId.toString() === modelObj.id.toString();
    });
    
    if (filtered.length > 0) {
      setFilteredModifications(filtered);
      console.log(`Filtered modifications for model ${filterModel}:`, filtered.map(m => m.name));
    } else {
      // If no matching modifications, show all modifications
      setFilteredModifications(modifications);
      console.log(`No modifications found for model ${filterModel}, showing all modifications`);
    }
  }, [metadataLoaded, filterModel, filterBrand, filterCategory, modifications, models, brands, cmsProducts, categories]);

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
    ...categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
    }))
  ];
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const subcategoryOptions = [
    { value: "", label: "Все подкатегории" },
    ...subcategories
    .filter(sub => {
        if (!formCategory) return true;
      
      // Check if subcategory belongs to selected category
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const thirdSubcategoryOptions = [
    { value: "", label: "Все третьи подкатегории" },
    ...thirdSubcategories
    .filter(third => {
      if (!formSubcategory) return true;
      
      // Check if third subcategory belongs to selected subcategory
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

  // Form handlers
  const handleCategoryChange = (value: string) => {
    setFormCategory(value || null);
    // Reset downstream filters
    setFormSubcategory(null);
    setFormThirdSubcategory(null);
    setFormBrand(null);
    setFormModel(null);
    setFormModification(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubcategoryChange = (value: string) => {
    if (value) {
      const sub = subcategories.find((s) => s.id.toString() === value);
      setFormSubcategory(sub || null);
    } else {
      setFormSubcategory(null);
    }
    // Reset third subcategory when subcategory changes
    setFormThirdSubcategory(null);
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleThirdSubcategoryChange = (value: string) => {
    if (value) {
      const third = thirdSubcategories.find((t) => t.id.toString() === value);
      setFormThirdSubcategory(third || null);
    } else {
      setFormThirdSubcategory(null);
    }
  };
  
  const handleBrandChange = (value: string) => {
    setFormBrand(value || null);
    // Reset downstream filters
    setFormModel(null);
    setFormModification(null);
  };
  
  const handleModelChange = (value: string) => {
    setFormModel(value || null);
    // Reset downstream filters
    setFormModification(null);
  };

  // Apply search from form
  const handleSearch = () => {
    // Check if "All categories" is selected when other filters are active
    const isSelectingAllCategories = formCategory === null && (formBrand || formModel || formModification);
    const isPathBasedCategory = pathname.includes('/catalog/') && pathname.split('/').length > 2;
    
    // If selecting "All categories" when a path-based category is active,
    // navigate to the main catalog page with filters as query params
    if (isSelectingAllCategories && isPathBasedCategory) {
      const queryParams = new URLSearchParams();
      
      if (formBrand) queryParams.set('brand', formBrand);
      if (formModel) queryParams.set('model', formModel);
      if (formModification) queryParams.set('modification', formModification);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      router.push(`/catalog${queryString}`);
      return;
    }
    
    // Update active filters from form
    setFilterCategory(formCategory);
    setFilterSubcategory(formSubcategory);
    setFilterThirdSubcategory(formThirdSubcategory);
    setFilterBrand(formBrand);
    setFilterModel(formModel);
    setFilterModification(formModification);
    
    // Mark as active search (to show "nothing found" when appropriate)
    setHasActiveSearch(true);
    
    // Reset to page 1 when searching
    setCurrentPage(1);
    
    console.log("Search applied:", {
      category: formCategory,
      subcategory: formSubcategory?.attributes.slug,
      thirdSubcategory: formThirdSubcategory?.attributes.slug,
      brand: formBrand,
      model: formModel,
      modification: formModification
    });
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
            <div className="flex flex-col md:flex-row gap-3 md:gap-5">
              <Select
                options={categoryOptions}
                value={formCategory || ""}
                onChange={handleCategoryChange}
                placeholder="Категория"
                className="w-full md:flex-2"
              />
              
              {/*
              <Select
                options={subcategoryOptions}
                value={formSubcategory ? formSubcategory.id.toString() : ""}
                onChange={handleSubcategoryChange}
                placeholder="Подкатегория"
                className="w-full md:flex-2"
              />
              */}

              {/*
              <Select
                options={thirdSubcategoryOptions}
                value={formThirdSubcategory ? formThirdSubcategory.id.toString() : ""}
                onChange={handleThirdSubcategoryChange}
                placeholder="Третья подкатегория"
                className="w-full md:flex-2"
              />
              */}

              <Select
                options={brandOptions}
                value={formBrand || ""}
                onChange={handleBrandChange}
                placeholder="Марка"
                className="w-full md:flex-2"
              />

              <Select
                options={modelOptions}
                value={formModel || ""}
                onChange={handleModelChange}
                placeholder="Модель"
                className="w-full md:flex-2"
              />

              <Select
                options={modificationOptions}
                value={formModification || ""}
                onChange={(value) => setFormModification(value || null)}
                placeholder="Модификация"
                className="w-full md:flex-2"
              />

              <div className="w-full flex-2">
                <Button
                  label="Найти"
                  variant="noArrow2"
                  className="h-[42px] w-full hover:text-black"
                  onClick={handleSearch}
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
            ) : products.length === 0 && (hasActiveSearch || searchParams?.get('search')) ? (
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