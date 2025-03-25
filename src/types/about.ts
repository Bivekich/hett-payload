import { PayloadMedia } from "./banner";

// Lexical editor content type
export interface LexicalContent {
  root: {
    type: string;
    format: string;
    indent: number;
    version: number;
    children: Array<{
      type: string;
      format: string;
      indent: number;
      version: number;
      children: Array<{
        mode: string;
        text: string;
        type: string;
        style: string;
        detail: number;
        format: number;
        version: number;
      }>;
      direction: string;
      textStyle: string;
      textFormat: number;
    }>;
    direction: string;
  };
}

// Feature item in the features list
export interface AboutFeature {
  id?: string;
  title: string;
  description: string;
  icon?: PayloadMedia;
}

// Production section content
export interface ProductionSection {
  title: string;
  description: LexicalContent; // Rich text content
  image: PayloadMedia;
}

// Partner in the buy section
export interface Partner {
  id?: string;
  name: string;
  logo: PayloadMedia;
  url?: string;
}

// Distributor feature
export interface DistributorFeature {
  id?: string;
  text: string;
  iconType?: 'wallet' | 'widgets' | 'time' | 'truck' | 'custom';
  customIcon?: PayloadMedia;
}

// Distributor information
export interface Distributor {
  title?: string;
  website?: string;
  websiteUrl?: string;
  image?: PayloadMedia;
  logo?: PayloadMedia;
  buttonText?: string;
  buttonUrl?: string;
  features?: DistributorFeature[];
}

// Buy section content
export interface BuySection {
  title: string;
  description: LexicalContent; // Rich text content
  onlineTitle?: string;
  distributor?: Distributor;
  partners: Partner[];
}

// Full about data structure
export interface AboutData {
  id: string;
  title: string;
  mainContent: LexicalContent; // Rich text content
  mainImage: PayloadMedia;
  features: AboutFeature[];
  productionSection: ProductionSection;
  buySection: BuySection;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Response structure from the Payload CMS API
export interface AboutResponse {
  docs: AboutData[];
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
