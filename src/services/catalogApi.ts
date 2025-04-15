import { API_URL, API_TOKEN } from './api';
import {
  Brand,
  Category,
  CatalogFilters,
  Model,
  Modification,
  PaginatedResponse,
  Product,
  Subcategory,
  ThirdSubcategory,
} from '../types/catalog';

// Helper function to build the query parameters
const buildQueryParams = (filters: CatalogFilters = {}): URLSearchParams => {
  const queryParams = new URLSearchParams();

  // Set a controlled depth to prevent excessive nesting
  // Use depth=1 by default to get the first level of relationships
  // This helps prevent the n+1 query problem and duplicate nested data
  queryParams.append('depth', filters.depth?.toString() || '1');

  // Add select fields to further optimize what data we get back when needed
  if (filters.select) {
    queryParams.append('fields', filters.select);
  }

  // Add pagination parameters
  if (filters.page) {
    queryParams.append('page', filters.page.toString());
  }
  if (filters.limit) {
    queryParams.append('limit', filters.limit.toString());
  }

  // Add sort parameter
  if (filters.sort) {
    queryParams.append('sort', filters.sort);
  }

  // Add filters
  if (filters.category) {
    queryParams.append('where[category][slug][equals]', filters.category);
  }
  if (filters.subcategory) {
    queryParams.append('where[subcategory][slug][equals]', filters.subcategory);
  }
  if (filters.thirdsubcategory) {
    queryParams.append('where[thirdsubcategory][slug][equals]', filters.thirdsubcategory);
  }
  if (filters.brand) {
    queryParams.append('where[brand][slug][equals]', filters.brand);
  }
  if (filters.model) {
    queryParams.append('where[model][slug][equals]', filters.model);
  }
  if (filters.modification) {
    queryParams.append('where[modification][slug][equals]', filters.modification);
  }
  if (filters.minPrice !== undefined) {
    queryParams.append('where[price][greater_than_equal]', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
    queryParams.append('where[price][less_than_equal]', filters.maxPrice.toString());
  }
  if (filters.inStock !== undefined) {
    queryParams.append('where[inStock][equals]', filters.inStock.toString());
  }
  if (filters.featured !== undefined) {
    queryParams.append('where[featured][equals]', filters.featured.toString());
  }
  
  // Handle complex search across multiple fields
  if (filters.search) {
    const searchTerm = filters.search;
    // Create an OR group for the search term across specified fields
    queryParams.append('where[or][0][name][like]', searchTerm);
    queryParams.append('where[or][1][oem][like]', searchTerm);
    queryParams.append('where[or][2][article][like]', searchTerm);
    queryParams.append('where[or][3][category.name][like]', searchTerm);
    queryParams.append('where[or][4][subcategory.name][like]', searchTerm);
    queryParams.append('where[or][5][thirdsubcategory.name][like]', searchTerm);
  }

  return queryParams;
};

// Categories API methods
export const getCategories = async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Category>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/categories?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategory = async (slug: string): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/api/categories?where[slug][equals]=${slug}&depth=2`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const data = await response.json();
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    }
    throw new Error(`Category with slug "${slug}" not found`);
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Subcategories API methods
export const getSubcategories = async (
  filters: CatalogFilters = {}
): Promise<PaginatedResponse<Subcategory>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/subcategories?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const getSubcategoriesByCategory = async (
  categorySlug: string
): Promise<PaginatedResponse<Subcategory>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/subcategories?where[category.slug][equals]=${categorySlug}&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    throw error;
  }
};

// ThirdSubcategories API methods
export const getThirdSubcategories = async (
  filters: CatalogFilters = {}
): Promise<PaginatedResponse<ThirdSubcategory>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/thirdsubcategories?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch third subcategories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching third subcategories:', error);
    throw error;
  }
};

export const getThirdSubcategoriesBySubcategory = async (
  subcategorySlug: string
): Promise<PaginatedResponse<ThirdSubcategory>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/thirdsubcategories?where[subcategory.slug][equals]=${subcategorySlug}&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch third subcategories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching third subcategories by subcategory:', error);
    throw error;
  }
};

// Brands API methods
export const getBrands = async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Brand>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/brands?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

// Models API methods
export const getModels = async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Model>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/models?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const getModelsByBrand = async (brandSlug: string): Promise<PaginatedResponse<Model>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/models?where[brand.slug][equals]=${brandSlug}&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching models by brand:', error);
    throw error;
  }
};

// Modifications API methods
export const getModifications = async (
  filters: CatalogFilters = {}
): Promise<PaginatedResponse<Modification>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/modifications?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch modifications: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching modifications:', error);
    throw error;
  }
};

export const getModificationsByModel = async (
  modelSlug: string
): Promise<PaginatedResponse<Modification>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/modifications?where[model.slug][equals]=${modelSlug}&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch modifications: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching modifications by model:', error);
    throw error;
  }
};

// Products API methods
export const getProducts = async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Product>> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await fetch(`${API_URL}/api/catalog?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Optimized method for catalog listing that returns minimal product data
// This dramatically reduces response size and prevents the n+1 query problem
export const getCatalogProducts = async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Product>> => {
  try {
    // Create optimized filters with depth=1 for images (so we get URLs) but otherwise minimal depth
    const optimizedFilters = {
      ...filters,
      depth: 1, // Use depth=1 to ensure we get image URLs
      select: 'id,name,slug,price,sku,images.image.url,images.alt,inStock,featured,oem,brand.name,brand.slug,model.name,model.slug,modification.name,modification.slug,category.name,category.slug,subcategory.name,subcategory.slug'
    };
    
    // Build query params to ensure relationships are properly filtered
    const queryParams = new URLSearchParams();
    
    // Add basic parameters
    queryParams.append('depth', optimizedFilters.depth.toString());
    queryParams.append('fields', optimizedFilters.select);
    
    // Add pagination and sorting
    if (optimizedFilters.page) {
      queryParams.append('page', optimizedFilters.page.toString());
    }
    if (optimizedFilters.limit) {
      queryParams.append('limit', optimizedFilters.limit.toString());
    }
    if (optimizedFilters.sort) {
      queryParams.append('sort', optimizedFilters.sort);
    }
    
    // Add filter conditions using the slug for filtering
    if (optimizedFilters.category) {
      queryParams.append('where[category.slug][equals]', optimizedFilters.category);
    }
    if (optimizedFilters.subcategory) {
      queryParams.append('where[subcategory.slug][equals]', optimizedFilters.subcategory);
    }
    if (optimizedFilters.brand) {
      queryParams.append('where[brand.slug][equals]', optimizedFilters.brand);
    }
    if (optimizedFilters.model) {
      queryParams.append('where[model.slug][equals]', optimizedFilters.model);
    }
    if (optimizedFilters.modification) {
      queryParams.append('where[modification.slug][equals]', optimizedFilters.modification);
    }
    
    // Add other filters
    if (optimizedFilters.minPrice !== undefined) {
      queryParams.append('where[price][greater_than_equal]', optimizedFilters.minPrice.toString());
    }
    if (optimizedFilters.maxPrice !== undefined) {
      queryParams.append('where[price][less_than_equal]', optimizedFilters.maxPrice.toString());
    }
    if (optimizedFilters.inStock !== undefined) {
      queryParams.append('where[inStock][equals]', optimizedFilters.inStock.toString());
    }
    if (optimizedFilters.featured !== undefined) {
      queryParams.append('where[featured][equals]', optimizedFilters.featured.toString());
    }
    if (optimizedFilters.search) {
      // Search in name, OEM, article, and category names
      const searchTerm = optimizedFilters.search;
      queryParams.append('where[or][0][name][like]', searchTerm);
      queryParams.append('where[or][1][oem][like]', searchTerm);
      queryParams.append('where[or][2][article][like]', searchTerm);
      queryParams.append('where[or][3][category.name][like]', searchTerm);      // Add category name
      queryParams.append('where[or][4][subcategory.name][like]', searchTerm);   // Add subcategory name
      queryParams.append('where[or][5][thirdsubcategory.name][like]', searchTerm); // Add third subcategory name
    }
    
    console.log('Optimized catalog query:', queryParams.toString());
    
    const response = await fetch(`${API_URL}/api/catalog?${queryParams.toString()}`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch catalog products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching catalog products:', error);
    throw error;
  }
};

export const getProduct = async (slug: string): Promise<Product> => {
  try {
    // For single product we need more detail, but still control the depth
    const filters: CatalogFilters = {
      depth: 1, // Limit depth to 1 level to avoid deep nesting
      // Only fetch the fields we need - this helps reduce response size dramatically
      select: 'id,name,slug,price,sku,description,shortDescription,images,inStock,featured,oem,specifications,marketplaceLinks,distributors,brand,model,modification,category,subcategory,metaTitle,metaDescription,createdAt,updatedAt'
    };
    
    const queryParams = buildQueryParams(filters);
    // Add the slug filter
    queryParams.append('where[slug][equals]', slug);
    
    const response = await fetch(
      `${API_URL}/api/catalog?${queryParams.toString()}`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    }
    throw new Error(`Product with slug "${slug}" not found`);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Search API method
export const searchCatalog = async (searchTerm: string): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/catalog?where[name][like]=${searchTerm}&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}; 