// Media/Image types
export interface Media {
  id: string;
  url: string;
  alt?: string;
  filename: string;
  mimeType: string;
  filesize?: number;
  width?: number;
  height?: number;
}

// Base content types with common fields
export interface BaseContent {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Rich text content type
export interface RichTextContent {
  root: {
    children: unknown[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

// Category types
export interface Category extends BaseContent {
  name: string;
  slug: string;
  description?: RichTextContent; // Rich text content
  image?: Media;
  icon?: Media;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Subcategory types
export interface Subcategory extends BaseContent {
  name: string;
  slug: string;
  description?: RichTextContent; // Rich text content
  category: Category | string;
  image?: Media;
  icon?: Media;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// ThirdSubcategory types
export interface ThirdSubcategory extends BaseContent {
  name: string;
  slug: string;
  description?: RichTextContent; // Rich text content
  subcategory: Subcategory | string;
  image?: Media;
  icon?: Media;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Brand types
export interface Brand extends BaseContent {
  name: string;
  slug: string;
  description?: RichTextContent; // Rich text content
  logo?: Media;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Model types
export interface Model extends BaseContent {
  name: string;
  slug: string;
  brand: Brand | string;
  description?: RichTextContent; // Rich text content
  featured: boolean;
  image?: Media;
  metaTitle?: string;
  metaDescription?: string;
}

// Modification types
export interface Modification extends BaseContent {
  name: string;
  slug: string;
  model: Model | string;
  description?: RichTextContent; // Rich text content
  yearStart?: number;
  yearEnd?: number;
  specifications?: Specification[];
  image?: Media;
  metaTitle?: string;
  metaDescription?: string;
}

// Specification for product characteristics
export interface Specification {
  name: string;
  value: string;
}

// Product Image type
export interface ProductImage {
  image: Media;
  alt?: string;
}

// Marketplace link types
export interface MarketplaceLink {
  name: string;
  url: string;
  logo?: string;
}

export interface MarketplaceLinks {
  ozon: string;
  wildberries: string;
  others?: MarketplaceLink[];
}

// Distributor type
export interface Distributor {
  name: string;
  url: string;
  location: string;
}

// Full Product type
export interface Product extends BaseContent {
  name: string;
  slug: string;
  article: string;
  price?: number;
  description?: RichTextContent; // Rich text content
  shortDescription?: string;
  brand?: Brand | string;
  model?: Model | string;
  modification?: Modification | string;
  category: Category | string;
  subcategory?: Subcategory | string;
  thirdsubcategory?: ThirdSubcategory | string;
  images: ProductImage[];
  featured: boolean;
  inStock: boolean;
  specifications?: Specification[];
  oem?: string;
  metaTitle?: string;
  metaDescription?: string;
  marketplaceLinks?: MarketplaceLinks;
  distributors?: Distributor[];
}

// Response types for API
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface CategoryResponse {
  docs: Category[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ProductResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Filter types
export interface CatalogFilters {
  category?: string;
  subcategory?: string;
  thirdsubcategory?: string;
  brand?: string;
  model?: string;
  modification?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  depth?: number; // Control nesting depth for related entities
  select?: string; // Control which fields to return
} 