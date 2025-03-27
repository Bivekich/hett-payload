// Product interfaces
export interface ProductImage {
  data?: {
    attributes?: {
      url?: string;
    };
  };
}

// Marketplace link interfaces
export interface MarketplaceLink {
  name: string;
  url: string;
  logo?: string;
}

export interface MarketplaceLinks {
  ozon?: string;
  wildberries?: string;
  others?: MarketplaceLink[];
}

// Distributor interface
export interface Distributor {
  name: string;
  url: string;
  location?: string;
}

// Specification interface
export interface Specification {
  name: string;
  value: string;
}

export interface ProductAttributes {
  name: string;
  slug: string;
  article: string;
  price?: string;
  brand: string;
  model: string;
  modification: string;
  oem: string;
  image?: ProductImage;
  description?: string;
  specifications?: Specification[];
  marketplaceLinks?: MarketplaceLinks;
  distributors?: Distributor[];
}

export interface Product {
  id: number;
  attributes: ProductAttributes;
}

// Characteristic interface for the ProductCharacteristics component
export interface Characteristic {
  label: string;
  value: string;
}

// Thumbnail interface for the ImageGallery component
export interface Thumbnail {
  id: number;
  url: string | null;
}
