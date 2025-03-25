// Product interfaces
export interface ProductImage {
  data?: {
    attributes?: {
      url?: string;
    };
  };
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
