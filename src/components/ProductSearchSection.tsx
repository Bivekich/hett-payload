"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryCard from "./CategoryCard";
import Button from "./uiKit/Button";
import Select from "./uiKit/Select";
import VinRequestModal from "./uiKit/VinRequestModal";
import {
  getCategories,
  getBrands,
  getModels,
  getModifications,
  getSubcategories,
  getThirdSubcategories,
  getCatalogProducts,
} from "../services/catalogApi";
import {
  Category,
  Brand as CmsBrand,
  Model as CmsModel,
  Modification,
  Subcategory as CmsSubcategory,
  ThirdSubcategory as CmsThirdSubcategory,
  Product as CmsProduct,
  CatalogFilters,
} from "../types/catalog";
import { API_URL } from "@/services/api";

// Interface for category cards display
interface CategoryCardData {
  id: string;
  title: string;
  iconSrc: string;
  slug: string;
}

// Helper function to convert CMS subcategory to frontend subcategory format (Copied from Catalog.tsx)
interface SubcategoryAttributes {
  name: string;
  slug?: string;
}
interface Subcategory {
  id: number;
  attributes: SubcategoryAttributes;
  category?: Category | string;
}
const convertCmsSubcategoryToSubcategory = (
  cmsSubcategory: CmsSubcategory
): Subcategory => {
  return {
    id: parseInt(cmsSubcategory.id),
    attributes: {
      name: cmsSubcategory.name,
      slug: cmsSubcategory.slug,
    },
    category: cmsSubcategory.category,
  };
};

// Helper function to convert CMS third subcategory to frontend format (Copied from Catalog.tsx)
interface ThirdSubcategoryAttributes {
  name: string;
  slug?: string;
}
interface ThirdSubcategory {
  id: number;
  attributes: ThirdSubcategoryAttributes;
  subcategory?: Subcategory | string;
}
const convertCmsThirdSubcategoryToThirdSubcategory = (
  cmsThirdSubcategory: CmsThirdSubcategory
): ThirdSubcategory => {
  let subcategoryValue: string | Subcategory;
  if (typeof cmsThirdSubcategory.subcategory === "string") {
    subcategoryValue = cmsThirdSubcategory.subcategory;
  } else if (cmsThirdSubcategory.subcategory) {
    subcategoryValue = convertCmsSubcategoryToSubcategory(
      cmsThirdSubcategory.subcategory
    );
  } else {
    subcategoryValue = "";
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

const ProductSearchSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(true);
  const [metadataLoaded, setMetadataLoaded] = useState<boolean>(false);
  const [isFetchingFilterOptions, setIsFetchingFilterOptions] =
    useState<boolean>(false);

  // State for category cards
  const [categoryCards, setCategoryCards] = useState<CategoryCardData[]>([]);

  // --- Refactored State ---
  // Master Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [thirdSubcategories, setThirdSubcategories] = useState<
    ThirdSubcategory[]
  >([]);
  const [brands, setBrands] = useState<CmsBrand[]>([]);
  const [models, setModels] = useState<CmsModel[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);

  // Filtered Options State (for dropdowns)
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([]);
  const [filteredThirdSubcategories, setFilteredThirdSubcategories] = useState<
    ThirdSubcategory[]
  >([]);
  const [filteredBrands, setFilteredBrands] = useState<CmsBrand[]>([]);
  const [filteredModels, setFilteredModels] = useState<CmsModel[]>([]);
  const [filteredModifications, setFilteredModifications] = useState<
    Modification[]
  >([]);

  // Selected Filter State
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSubcategory, setFilterSubcategory] =
    useState<Subcategory | null>(null);
  const [filterThirdSubcategory, setFilterThirdSubcategory] =
    useState<ThirdSubcategory | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [filterModification, setFilterModification] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetched Products State (for filter logic)
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>([]);

  // --- Refactored Initial Metadata Fetch ---
  useEffect(() => {
    console.log(
      "[ProductSearchSection] Initial metadata fetch effect running (should only run once)"
    );
    const fetchMetadata = async () => {
      try {
        setIsMetadataLoading(true);

        // Fetch all metadata in parallel
        const [
          categoriesResponse,
          subcategoriesResponse,
          thirdSubcategoriesResponse,
          brandsResponse,
          modelsResponse,
          modificationsResponse,
        ] = await Promise.all([
          getCategories({ limit: 500, depth: 1 }),
          getSubcategories({ limit: 1000, depth: 1 }),
          getThirdSubcategories({ limit: 1000, depth: 1 }),
          getBrands({ limit: 500, depth: 1 }),
          getModels({ limit: 2000, depth: 1 }),
          getModifications({ limit: 5000, depth: 1 }),
        ]);

        const fetchedCategories = categoriesResponse.docs;
        const fetchedSubcategories = subcategoriesResponse.docs.map(
          convertCmsSubcategoryToSubcategory
        );
        const fetchedThirdSubcategories = thirdSubcategoriesResponse.docs.map(
          convertCmsThirdSubcategoryToThirdSubcategory
        );
        const fetchedBrands = brandsResponse.docs;
        const fetchedModels = modelsResponse.docs;
        const fetchedModifications = modificationsResponse.docs;

        // Set Master Data State
        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
        setThirdSubcategories(fetchedThirdSubcategories);
        setBrands(fetchedBrands);
        setModels(fetchedModels);
        setModifications(fetchedModifications);

        // Initialize Filtered Options State
        setFilteredCategories(fetchedCategories);
        setFilteredSubcategories(fetchedSubcategories);
        setFilteredThirdSubcategories(fetchedThirdSubcategories);
        setFilteredBrands(fetchedBrands);
        setFilteredModels(fetchedModels);
        setFilteredModifications(fetchedModifications);

        // Format categories for category cards
        const formattedCategoryCards = fetchedCategories
          .slice(0, 5) // Limit to 5 categories for the grid
          .map((category: Category) => {
            let iconSrc = "/images/default_category_icon.svg";
            const imageObj = category.icon || category.image;
            if (
              typeof imageObj === "object" &&
              imageObj !== null &&
              imageObj.url
            ) {
              iconSrc = imageObj.url.startsWith("/")
                ? `${API_URL}${imageObj.url}`
                : imageObj.url;
            }
            return {
              id: category.id.toString(),
              title: category.name,
              iconSrc,
              slug: category.slug,
            };
          });
        setCategoryCards(formattedCategoryCards);

        setMetadataLoaded(true);
      } catch (err) {
        console.error("Error fetching metadata:", err);
      } finally {
        setIsMetadataLoading(false);
      }
    };

    fetchMetadata();
  }, []);
  // --- End Refactored Initial Metadata Fetch ---

  // --- Add fetchProducts Function (Copied & Adapted from Catalog.tsx) ---
  const fetchProducts = useCallback(
    async (page = 1) => {
      // Added page argument
      if (!metadataLoaded) {
        console.log(
          "(ProductSearchSection) Skipping fetchProducts: metadata not loaded."
        );
        return;
      }

      try {
        setIsFetchingFilterOptions(true);
        // console.log("(ProductSearchSection) Fetching products with filters:", { /* filters */ });

        const currentFilters: CatalogFilters = {
          page: page, // Use function argument for page
          limit: 4, // Limit results on homepage search section (adjust as needed)
          depth: 1, // Crucial: Ensure depth 1 to populate relations
        };

        // Add filters from state
        if (filterCategory) currentFilters.category = filterCategory;
        if (filterSubcategory)
          currentFilters.subcategory = filterSubcategory.attributes.slug || "";
        if (filterThirdSubcategory)
          currentFilters.thirdsubcategory =
            filterThirdSubcategory.attributes.slug || "";
        if (filterBrand) currentFilters.brand = filterBrand;
        if (filterModel) currentFilters.model = filterModel;
        if (filterModification)
          currentFilters.modification = filterModification;
        if (searchQuery.trim()) currentFilters.search = searchQuery.trim(); // Include text search

        // console.log("(ProductSearchSection) API filters:", currentFilters);

        const response = await getCatalogProducts(currentFilters);
        const fetchedCmsProducts = response.docs;

        // console.log(`(ProductSearchSection) Fetched ${fetchedCmsProducts.length} products`);

        // Update state only if it's the first page fetch triggered by a filter change
        // Or handle pagination differently if needed here (e.g., append results?)
        // For simplicity, let's just overwrite with the first page results for now
        setCmsProducts(fetchedCmsProducts);
      } catch (err) {
        console.error("(ProductSearchSection) Error fetching products:", err);
        // setError('Ошибка загрузки предложений'); // No need to set unused error state
        // Optionally clear products on error or keep stale data?
        setCmsProducts([]);
      } finally {
        setIsFetchingFilterOptions(false);
      }
    },
    [
      // Dependencies for fetchProducts
      metadataLoaded,
      filterCategory,
      filterSubcategory,
      filterThirdSubcategory,
      filterBrand,
      filterModel,
      filterModification,
      searchQuery, // Include searchQuery
      // currentPage is passed as an argument, so not needed here directly
    ]
  );
  // --- End fetchProducts Function ---

  // --- Centralized useEffect to update filter options (Copied from Catalog.tsx) ---
  useEffect(() => {
    if (!metadataLoaded) return;

    // 1. Filter based on available products (if any)
    const categoryIdsFromProducts = new Set<string>();
    const subcategoryIdsFromProducts = new Set<string>();
    const thirdSubcategoryIdsFromProducts = new Set<string>();
    const brandIdsFromProducts = new Set<string>();
    const modelIdsFromProducts = new Set<string>();
    const modificationIdsFromProducts = new Set<string>();

    // Note: In ProductSearchSection, cmsProducts might not be actively fetched
    // unless we implement immediate fetching or after a search click.
    // For now, this logic might primarily rely on the master lists until products are fetched.
    if (cmsProducts.length > 0) {
      cmsProducts.forEach((product) => {
        const categoryId =
          typeof product.category === "object"
            ? product.category?.id?.toString()
            : typeof product.category === "string"
            ? product.category
            : undefined;
        const subcategoryId =
          typeof product.subcategory === "object"
            ? product.subcategory?.id?.toString()
            : typeof product.subcategory === "string"
            ? product.subcategory
            : undefined;
        const thirdSubcategoryId =
          typeof product.thirdsubcategory === "object"
            ? product.thirdsubcategory?.id?.toString()
            : typeof product.thirdsubcategory === "string"
            ? product.thirdsubcategory
            : undefined;

        // Correctly handle the brand array
        if (Array.isArray(product.brand)) {
          product.brand.forEach((brandRef) => {
            const brandId =
              typeof brandRef === "object" && brandRef !== null
                ? brandRef.id?.toString()
                : typeof brandRef === "string" || typeof brandRef === "number"
                ? String(brandRef)
                : undefined;
            if (brandId) brandIdsFromProducts.add(brandId);
          });
        } else if (product.brand) {
          // Handle potential single object/ID case
          const brandId =
            typeof product.brand === "object" && product.brand !== null
              ? product.brand.id?.toString()
              : typeof product.brand === "string" ||
                typeof product.brand === "number"
              ? String(product.brand)
              : undefined;
          if (brandId) brandIdsFromProducts.add(brandId);
        }

        const modelId =
          typeof product.model === "object"
            ? product.model?.id?.toString()
            : typeof product.model === "string"
            ? product.model
            : undefined;
        const modificationId =
          typeof product.modification === "object"
            ? product.modification?.id?.toString()
            : typeof product.modification === "string"
            ? product.modification
            : undefined;

        if (categoryId) categoryIdsFromProducts.add(categoryId);
        if (subcategoryId) subcategoryIdsFromProducts.add(subcategoryId);
        if (thirdSubcategoryId)
          thirdSubcategoryIdsFromProducts.add(thirdSubcategoryId);
        if (modelId) modelIdsFromProducts.add(modelId);
        if (modificationId) modificationIdsFromProducts.add(modificationId);
      });
    }

    // 2. Determine the final filtered lists based on selections and product data

    // Categories: Filter based on selected brand (if products available)
    let finalFilteredCategories = categories;
    if (filterBrand) {
      // Only filter categories by products if products related to the brand exist
      if (cmsProducts.length > 0) {
        finalFilteredCategories = categories.filter((cat) =>
          categoryIdsFromProducts.has(cat.id.toString())
        );
      } else {
        // If brand is selected but no products fetched yet, *don't* filter categories strictly.
        // Keep all categories available until products are fetched or search is triggered.
        // Or, fetch products associated *only* with the brand to determine categories? - simpler to keep all for now.
        // finalFilteredCategories = []; // Avoid strict filtering here for usability
      }
    }
    setFilteredCategories(finalFilteredCategories);

    // Subcategories: Filter by selected category AND brand products (if applicable)
    let finalFilteredSubcategories = subcategories;
    if (filterCategory) {
      finalFilteredSubcategories = finalFilteredSubcategories.filter(
        (sub) =>
          typeof sub.category === "object" &&
          sub.category?.slug === filterCategory
      );
    }
    // Further filter by brand/products if a brand is selected
    if (filterBrand) {
      if (cmsProducts.length > 0) {
        finalFilteredSubcategories = finalFilteredSubcategories.filter((sub) =>
          subcategoryIdsFromProducts.has(sub.id.toString())
        );
      } else {
        // Avoid strict filtering if no products fetched yet
        // finalFilteredSubcategories = [];
      }
    }
    setFilteredSubcategories(finalFilteredSubcategories);

    // ThirdSubcategories: Filter by selected subcategory AND brand products (if applicable)
    let finalFilteredThirdSubcategories = thirdSubcategories;
    if (filterSubcategory) {
      finalFilteredThirdSubcategories = finalFilteredThirdSubcategories.filter(
        (third) =>
          typeof third.subcategory === "object" &&
          third.subcategory?.id === filterSubcategory.id
      );
    }
    if (filterBrand) {
      // Also filter by brand products
      if (cmsProducts.length > 0) {
        finalFilteredThirdSubcategories =
          finalFilteredThirdSubcategories.filter((third) =>
            thirdSubcategoryIdsFromProducts.has(third.id.toString())
          );
      } else {
        // Avoid strict filtering
        // finalFilteredThirdSubcategories = [];
      }
    }
    setFilteredThirdSubcategories(finalFilteredThirdSubcategories);

    // Brands: Filter by selected taxonomy products OR show all if no taxonomy selected
    let finalFilteredBrands = brands;
    if (filterCategory || filterSubcategory || filterThirdSubcategory) {
      if (cmsProducts.length > 0) {
        finalFilteredBrands = brands.filter((brand) =>
          brandIdsFromProducts.has(brand.id.toString())
        );
      } else {
        // If taxonomy selected but no products fetched, keep all brands available for now.
        // We could fetch products matching the taxonomy to filter brands, but let's keep it simple.
        // finalFilteredBrands = [];
      }
    }
    setFilteredBrands(finalFilteredBrands);

    // Models: Filter first by selected brand, then by available products
    let finalFilteredModels = models;
    if (filterBrand) {
      finalFilteredModels = finalFilteredModels.filter(
        (model) =>
          // Ensure model.brand is populated (needs depth >= 1 in models fetch)
          typeof model.brand === "object" && model.brand?.slug === filterBrand
      );
      // Refine by products if available
      if (cmsProducts.length > 0) {
        const modelsInProducts = finalFilteredModels.filter((model) =>
          modelIdsFromProducts.has(model.id.toString())
        );
        if (modelsInProducts.length > 0) {
          finalFilteredModels = modelsInProducts;
        } else {
          // Keep brand-filtered list if product filtering yields nothing
          console.log(
            "(ProductSearchSection) No models found in current products for selected brand, showing all models for the brand."
          );
        }
      } else {
        // If only brand selected, but no products fetched yet, show all models for that brand.
        // Strict filtering only if other filters *are* active but yield no products (which won't happen until fetch)
        // if (filterCategory || filterSubcategory || filterThirdSubcategory || filterModel || filterModification || searchQuery) {
        //    finalFilteredModels = [];
        // }
      }
    } else {
      // If no brand selected, show all models initially
      finalFilteredModels = models;
    }
    setFilteredModels(finalFilteredModels);

    // Modifications: Filter first by selected model, then by available products
    let finalFilteredModifications = modifications;
    if (filterModel) {
      finalFilteredModifications = finalFilteredModifications.filter(
        (mod) =>
          // Ensure mod.model is populated (needs depth >= 1 in modifications fetch)
          typeof mod.model === "object" && mod.model?.slug === filterModel
      );
      // Refine by products if available
      if (cmsProducts.length > 0) {
        const modificationsInProducts = finalFilteredModifications.filter(
          (mod) => modificationIdsFromProducts.has(mod.id.toString())
        );
        if (modificationsInProducts.length > 0) {
          finalFilteredModifications = modificationsInProducts;
        } else {
          console.log(
            "(ProductSearchSection) No modifications found in current products for selected model, showing all modifications for the model."
          );
        }
      } else {
        // If only model selected, but no products fetched yet, show all mods for that model.
        // Strict filtering would apply later if other filters + model yield no products after fetch.
        // if (filterCategory || filterSubcategory || filterThirdSubcategory || filterBrand || filterModification || searchQuery) {
        //    finalFilteredModifications = [];
        // }
      }
    } else {
      // If no model selected, show all modifications initially
      finalFilteredModifications = modifications;
    }
    setFilteredModifications(finalFilteredModifications);

    // console.log("(ProductSearchSection) Updated Filter Options Based on Selection/Products:", {
    //    categories: finalFilteredCategories.length,
    //    subcategories: finalFilteredSubcategories.length,
    //    thirdSubcategories: finalFilteredThirdSubcategories.length,
    //    brands: finalFilteredBrands.length,
    //    models: finalFilteredModels.length,
    //    modifications: finalFilteredModifications.length
    // });
  }, [
    // Dependencies: Master lists, selected filters, and fetched products
    categories,
    subcategories,
    thirdSubcategories,
    brands,
    models,
    modifications, // Master Lists
    filterCategory,
    filterSubcategory,
    filterThirdSubcategory,
    filterBrand,
    filterModel, // Selected Filters
    cmsProducts, // Fetched Products
    metadataLoaded,
  ]);
  // --- End Centralized useEffect ---

  // --- Add useEffect to Fetch Products on Filter Change ---
  useEffect(() => {
    // Fetch products whenever filters change, but only after metadata is loaded
    if (metadataLoaded) {
      fetchProducts(1); // Fetch first page when filters change
    }
  }, [
    metadataLoaded,
    filterCategory,
    filterSubcategory,
    filterThirdSubcategory,
    filterBrand,
    filterModel,
    filterModification,
    searchQuery, // Include searchQuery as filter
    fetchProducts, // Include fetchProducts as dependency
  ]);
  // --- End Fetch Products useEffect ---

  // --- Update Handlers ---
  const handleCategoryChange = (value: string) => {
    const newCategorySlug = value || null;
    setFilterCategory(newCategorySlug);
    setFilterSubcategory(null);
    setFilterThirdSubcategory(null);
  };

  const handleSubcategoryChange = (value: string) => {
    let newSubcategory: Subcategory | null = null;
    if (value) {
      newSubcategory =
        subcategories.find((s) => s.id.toString() === value) || null;
    }
    setFilterSubcategory(newSubcategory);
    setFilterThirdSubcategory(null);
  };

  const handleThirdSubcategoryChange = (value: string) => {
    let newThirdSub: ThirdSubcategory | null = null;
    if (value) {
      newThirdSub =
        thirdSubcategories.find((t) => t.id.toString() === value) || null;
    }
    setFilterThirdSubcategory(newThirdSub);
  };

  const handleBrandChange = (value: string) => {
    const newBrandSlug = value || null;
    setFilterBrand(newBrandSlug);
    setFilterModel(null);
    setFilterModification(null);
  };

  const handleModelChange = (value: string) => {
    const newModelSlug = value || null;
    setFilterModel(newModelSlug);
    setFilterModification(null);
  };

  const handleModificationChange = (value: string) => {
    const newModificationSlug = value || null;
    setFilterModification(newModificationSlug);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilterCategory(null);
    setFilterSubcategory(null);
    setFilterThirdSubcategory(null);
    setFilterBrand(null);
    setFilterModel(null);
    setFilterModification(null);
    setSearchQuery("");
  };
  // --- End Update Handlers ---

  // --- Search Initiation - UPDATED ---
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Пожалуйста, введите поисковый запрос.");
      return;
    }

    // Create new URLSearchParams just for search
    const queryParams = new URLSearchParams();
    queryParams.set("search", searchQuery.trim());

    const queryString = queryParams.toString();
    router.push(`/catalog${queryString ? "?" + queryString : ""}`);
  };

  const handleApplyFilters = () => {
    const isAnyFilterActive =
      filterCategory ||
      filterSubcategory ||
      filterThirdSubcategory ||
      filterBrand ||
      filterModel ||
      filterModification;

    if (!isAnyFilterActive) {
      alert("Пожалуйста, выберите хотя бы один фильтр.");
      return;
    }

    // Create new URLSearchParams for filters only
    const queryParams = new URLSearchParams();

    if (filterCategory) {
      queryParams.set("category", filterCategory);
    }

    if (filterSubcategory) {
      queryParams.set(
        "subcategory",
        filterSubcategory.attributes.slug || filterSubcategory.id.toString()
      );
    }

    if (filterThirdSubcategory) {
      queryParams.set(
        "thirdsubcategory",
        filterThirdSubcategory.attributes.slug ||
          filterThirdSubcategory.id.toString()
      );
    }

    if (filterBrand) {
      queryParams.set("brand", filterBrand);
    }

    if (filterModel) {
      queryParams.set("model", filterModel);
    }

    if (filterModification) {
      queryParams.set("modification", filterModification);
    }

    const queryString = queryParams.toString();
    router.push(`/catalog${queryString ? "?" + queryString : ""}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Navigate on Enter
    }
  };
  // --- End Search Initiation ---

  // UPDATED Category Card Click Handler
  const handleCategoryClick = (categorySlug: string) => {
    // Get current parameters to preserve others (like search)
    const queryParams = new URLSearchParams(searchParams.toString());

    // Set the category based on the clicked card
    queryParams.set("category", categorySlug);

    // Clear potentially conflicting lower-level taxonomy params
    queryParams.delete("subcategory");
    queryParams.delete("thirdsubcategory");

    const queryString = queryParams.toString();
    router.push(`/catalog${queryString ? "?" + queryString : ""}`);
  };

  const openVinModal = () => setIsVinModalOpen(true);
  const closeVinModal = () => setIsVinModalOpen(false);

  // --- Updated Option Generation ---
  const categoryOptions = [
    { value: "", label: "Все категории" },
    ...filteredCategories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  const subcategoryOptions = [
    { value: "", label: "Все подкатегории" },
    ...filteredSubcategories
      // Filter further based on the *currently selected* category in the form
      // This ensures dropdown only shows relevant items even if filtered list is broader
      .filter((sub) => {
        if (!filterCategory) return true; // Show all filtered if no category selected
        return (
          typeof sub.category === "object" &&
          sub.category?.slug === filterCategory
        );
      })
      .map((sub) => ({
        value: sub.id.toString(), // Use ID for value as it's unique
        label: sub.attributes.name,
      })),
  ];

  const thirdSubcategoryOptions = [
    { value: "", label: "Все третьи подкатегории" },
    ...filteredThirdSubcategories
      .filter((third) => {
        if (!filterSubcategory) return true; // Show all filtered if no subcategory selected
        return (
          typeof third.subcategory === "object" &&
          third.subcategory?.id === filterSubcategory.id
        );
      })
      .map((third) => ({
        value: third.id.toString(), // Use ID for value
        label: third.attributes.name,
      })),
  ];

  const brandOptions = [
    { value: "", label: "Все марки" },
    ...filteredBrands.map((brand) => ({
      value: brand.slug,
      label: brand.name,
    })),
  ];

  const modelOptions = [
    { value: "", label: "Все модели" },
    ...filteredModels
      // No need for further filtering here as the centralized useEffect already handles brand dependency
      .map((model) => ({
        value: model.slug,
        label: model.name,
      })),
  ];

  const modificationOptions = [
    { value: "", label: "Все модификации" },
    ...filteredModifications
      // No need for further filtering here as the centralized useEffect already handles model dependency
      .map((mod) => ({
        value: mod.slug,
        label: mod.name,
      })),
  ];
  // --- End Updated Option Generation ---

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
                <div className="w-[163px] max-lg:hidden">
                  <Button
                    label="Запросить по VIN"
                    variant="noArrow"
                    className="flex justify-center items-center w-full border-none"
                    hideArrow
                    onClick={openVinModal}
                  />
                </div>
              </div>

              {/* Search section */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-4">
                <Select
                  options={categoryOptions}
                  value={filterCategory || ""}
                  onChange={handleCategoryChange}
                  placeholder="Категория"
                  className="lg:col-span-1"
                />
                <Select
                  options={subcategoryOptions}
                  value={
                    filterSubcategory ? filterSubcategory.id.toString() : ""
                  }
                  onChange={handleSubcategoryChange}
                  placeholder="Подкатегория"
                  className="lg:col-span-1"
                  disabled={!filterCategory || subcategoryOptions.length <= 1} // Disable if no category or no options
                />
                <Select
                  options={thirdSubcategoryOptions}
                  value={
                    filterThirdSubcategory
                      ? filterThirdSubcategory.id.toString()
                      : ""
                  }
                  onChange={handleThirdSubcategoryChange}
                  placeholder="Раздел"
                  className="lg:col-span-1"
                  disabled={
                    !filterSubcategory || thirdSubcategoryOptions.length <= 1
                  } // Disable if no subcat or no options
                />
                <Select
                  options={brandOptions}
                  value={filterBrand || ""}
                  onChange={handleBrandChange}
                  placeholder="Марка"
                  className="lg:col-span-1"
                />
                <Select
                  options={modelOptions}
                  value={filterModel || ""}
                  onChange={handleModelChange}
                  placeholder="Модель"
                  className="lg:col-span-1"
                  disabled={!filterBrand || modelOptions.length <= 1} // Disable if no brand or no options
                />
                <Select
                  options={modificationOptions}
                  value={filterModification || ""}
                  onChange={handleModificationChange}
                  placeholder="Модификация"
                  className="lg:col-span-1"
                  disabled={!filterModel || modificationOptions.length <= 1} // Disable if no model or no options
                />
                <Button
                  label="Применить"
                  onClick={handleApplyFilters}
                  className="w-full py-3 lg:py-0 h-full lg:col-span-1 hover:text-black"
                  variant="noArrow2"
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
                onClick={openVinModal}
              />
            </div>
          </div>
        </div>

        {/* VIN Request Modal */}
        <VinRequestModal isOpen={isVinModalOpen} onClose={closeVinModal} />

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {isMetadataLoading ? (
            // Show skeleton loaders for cards
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg animate-pulse h-[150px]"
              ></div>
            ))
          ) : categoryCards.length > 0 ? (
            categoryCards.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="cursor-pointer transition-transform duration-200"
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
