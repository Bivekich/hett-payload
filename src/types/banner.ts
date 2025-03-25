// Banner interfaces for Payload CMS

// Media type from Payload CMS
export interface PayloadMedia {
  id: string;
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
}

// Individual slide in a banner
export interface PayloadBannerSlide {
  id?: string;
  number: string;
  subtitle: string;
  title: string;
  link: string;
  image: PayloadMedia;
}

// Full banner data structure
export interface PayloadBanner {
  id: string;
  title: string;
  slides: PayloadBannerSlide[];
  createdAt: string;
  updatedAt: string;
}

// Response structure from the Payload CMS API
export interface PayloadResponse {
  docs: PayloadBanner[];
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
