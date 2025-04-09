import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:3001";
export const API_TOKEN = process.env.NEXT_PUBLIC_PAYLOAD_API_TOKEN;

export const getBanners = async () => {
  try {
    const response = await fetch(`${API_URL}/api/banners?depth=2`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

export const getAboutData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/about?depth=2`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch about data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching about data:", error);
    throw error;
  }
};

export const getAdvantageData = async () => {
  const response = await fetch(`${API_URL}/api/advantage`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch advantage data");
  return response.json();
};

export const getGeographyData = async () => {
  const response = await fetch(
    `${API_URL}/api/geography?populate[slides][populate][0]=map`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch geography data");
  return response.json();
};

export const getProductsData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products?populate=*`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getOnlineStores = async () => {
  const response = await fetch(`${API_URL}/api/online-stores?populate=*`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch online stores data");
  return response.json();
};

export const getPhysicalStores = async () => {
  const response = await fetch(`${API_URL}/api/physical-stores?populate=*`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch physical stores data");
  return response.json();
};

export const getContactData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contact data: ${response.status}`);
    }

    const data = await response.json();
    console.log("Contact data:", data);
    
    // If there are multiple entries, get the first one
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    throw error;
  }
};

export const getFooterData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/footer?populate=*`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching footer data:", error);
    throw error;
  }
};

export const getArticles = async (page = 1, pageSize = 9) => {
  // If no pagination parameters are provided, fetch all articles
  const url = page && pageSize
    ? `${API_URL}/api/news-items?populate=*&sort=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    : `${API_URL}/api/news-items?populate=*&sort=date:desc&limit=1000`; // Fetch up to 1000 articles

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
};

export const getArticle = async (slug) => {
  try {
    console.log(`Fetching article with slug: ${slug}`);
    const response = await fetch(
      `${API_URL}/api/news-items?filters[slug][$eq]=${slug}&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Article response:", data);
    
    // Payload CMS returns docs array
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    } else {
      console.error("No article found with slug:", slug);
      return null;
    }
  } catch (error) {
    console.error("Error in getArticle:", error);
    throw error;
  }
};

export const getProductCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categories?populate=*`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getSubcategories = async (categorySlug) => {
  try {
    const url = categorySlug
      ? `${API_URL}/api/subcategories?filters[parent_category][slug][$eq]=${categorySlug}&populate=*`
      : `${API_URL}/api/subcategories?populate=*`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch subcategories");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getSubcategories:", error);
    throw error;
  }
};

export const getProductCategory = async (slug) => {
  if (!slug) {
    console.error("No slug provided to getProductCategory");
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/product-categories?filters[slug][$eq]=${slug}&populate=catalogProducts`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch product category");
    }

    const data = await response.json();
    console.log("Category API Response:", data);

    if (!data.data?.[0]) {
      console.error("No category found with slug:", slug);
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error("Error in getProductCategory:", error);
    throw error;
  }
};

export async function getCatalogProducts(filters = {}) {
  try {
    const queryParams = new URLSearchParams();

    // Add filters if provided
    if (filters.category) {
      queryParams.append("filters[category][slug][$eq]", filters.category);
    }
    if (filters.subcategory) {
      queryParams.append(
        "filters[subcategory][slug][$eq]",
        filters.subcategory
      );
    }
    if (filters.brand) {
      queryParams.append("filters[brand][id][$eq]", filters.brand);
    }
    if (filters.model) {
      queryParams.append("filters[model][id][$eq]", filters.model);
    }
    if (filters.modification) {
      queryParams.append(
        "filters[modification][id][$eq]",
        filters.modification
      );
    }

    // Add populate parameter for related data
    queryParams.append("populate[0]", "brand");
    queryParams.append("populate[1]", "model");
    queryParams.append("populate[2]", "modification");
    queryParams.append("populate[3]", "images");
    queryParams.append("populate[4]", "specifications");
    queryParams.append("populate[5]", "category");
    queryParams.append("populate[6]", "subcategory");

    console.log(
      "Fetching catalog products with params:",
      queryParams.toString()
    );
    const response = await fetch(
      `${API_URL}/api/catalog-products?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Catalog products response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching catalog products:", error);
    throw error;
  }
}

// Get unique filter values for brand, model, and modification
export async function getFilterOptions() {
  try {
    const response = await fetch(
      `${API_URL}/api/catalog-products?fields[0]=brand&fields[1]=model&fields[2]=modification`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract unique values
    const brands = [
      ...new Set(data.data.map((product) => product.attributes.brand)),
    ];
    const models = [
      ...new Set(data.data.map((product) => product.attributes.model)),
    ];
    const modifications = [
      ...new Set(data.data.map((product) => product.attributes.modification)),
    ];

    return {
      brands,
      models,
      modifications,
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw error;
  }
}

export const getCatalogProduct = async (slug) => {
  const response = await fetch(
    `${API_URL}/api/catalog-products?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch catalog product");
  const data = await response.json();
  return data.data[0];
};

export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("populate", "category");

  if (filters.category) {
    console.log("Adding category filter:", filters.category);
    queryParams.append("filters[category][slug][$eq]", filters.category);
  }

  try {
    const url = `${API_URL}/api/products?${queryParams}`;
    console.log("Fetching products from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    console.log("Products API Response:", data);
    return data;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
};

export const getProduct = async (slug) => {
  const response = await fetch(
    `${API_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch product");
  const data = await response.json();
  return data.data[0];
};

export const getBrands = async () => {
  try {
    const response = await fetch(`${API_URL}/api/brands?populate=*`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const getModels = async (brandId) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("populate", "*");

    if (brandId) {
      queryParams.append("filters[brand][id][$eq]", brandId);
    }

    console.log("Fetching models with params:", queryParams.toString());
    const response = await fetch(`${API_URL}/api/models?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch models");
    }

    const data = await response.json();
    console.log("Models response:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

export const getModifications = async (modelId) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("populate", "*");

    if (modelId) {
      queryParams.append("filters[model][id][$eq]", modelId);
    }

    console.log("Fetching modifications with params:", queryParams.toString());
    const response = await fetch(
      `${API_URL}/api/modifications?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch modifications");
    }

    const data = await response.json();
    console.log("Modifications response:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching modifications:", error);
    throw error;
  }
};

export const getBannerByPage = async (page) => {
  const response = await fetch(
    `${API_URL}/api/about-banners/page/${page}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error(`Failed to fetch banner for page: ${page}`);
  return response.json();
};

export const getCategoriesData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_STRAPI_API_URL}/api/categories?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getModelsData = async (queryParams) => {
  try {
    const url = new URL(`${import.meta.env.VITE_STRAPI_API_URL}/api/models`);
    if (queryParams) {
      url.search = queryParams.toString();
    }
    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

export const getModificationsData = async (queryParams) => {
  try {
    const url = new URL(
      `${import.meta.env.VITE_STRAPI_API_URL}/api/modifications`
    );
    if (queryParams) {
      url.search = queryParams.toString();
    }
    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching modifications:", error);
    throw error;
  }
};

// SEO endpoints
export const getSeoBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${API_URL}/api/custom-pages?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch page data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return { data: null };
  }
};

export const getContentTypeSeo = async (contentType, id) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/${contentType}/${id}?populate=*`
    );
    return response;
  } catch (error) {
    console.error("Error fetching content type:", error);
    return { data: null };
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/api/products?filters[name][$containsi]=${query}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getCustomPage = async (slug) => {
  try {
    console.log(`Fetching custom page with slug: ${slug}`);
    
    // Use encodeURIComponent to safely encode the slug for URL inclusion
    const encodedSlug = encodeURIComponent(slug);
    
    const response = await fetch(
      `${API_URL}/api/custom-pages?filters[slug][equals]=${encodedSlug}&filters[status][equals]=published&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to fetch custom page: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Custom page response:", data);
    
    // Payload CMS returns docs array
    if (data.docs && data.docs.length > 0) {
      console.log(`Found page with slug '${slug}':`, data.docs[0].title);
      return data.docs[0];
    } else {
      console.error("No custom page found with slug:", slug);
      return null;
    }
  } catch (error) {
    console.error("Error in getCustomPage:", error);
    throw error;
  }
};

// Modify getCustomPages to fetch full data and support fetching all pages
export const getCustomPages = async (page = 1, pageSize = 10, forMenu = false) => {
  try {
    // Construct URL based on pagination parameters and menu filter
    const menuFilter = forMenu ? '&where[showInMenu][equals]=true' : '';
    const url = page && pageSize
      ? `${API_URL}/api/custom-pages?where[status][equals]=published${menuFilter}&depth=2&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=title:asc`
      : `${API_URL}/api/custom-pages?where[status][equals]=published${menuFilter}&depth=2&limit=1000&sort=title:asc`; // Fetch all (up to 1000) with depth=2
      
    console.log(`Fetching custom pages from URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error fetching custom pages:", errorText);
      throw new Error(`Failed to fetch custom pages: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Custom pages raw response:", data);
    
    // Return the full documents array, or an empty array if none exist
    if (data.docs && data.docs.length > 0) {
      // No longer mapping to limited fields, return full objects
      return data.docs; 
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in getCustomPages:", error);
    // Return empty array on error to prevent crashes in Header/Footer
    return []; 
  }
};

export const getSettings = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/settings?limit=1`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to fetch settings: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Payload CMS returns docs array
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    } else {
      console.warn("No settings found");
      return null;
    }
  } catch (error) {
    console.error("Error in getSettings:", error);
    return null;
  }
};

export const getPageDescription = async (pageType) => {
  try {
    const response = await fetch(
      `${API_URL}/api/page-descriptions?where[pageType][equals]=${pageType}&where[active][equals]=true&depth=2`,
      {
        headers: {
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to fetch page description: ${response.status}`);
    }

    const data = await response.json();
    
    // If there are multiple entries, get the first one
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching page description:", error);
    return null; // Return null instead of throwing to handle gracefully on the frontend
  }
};
