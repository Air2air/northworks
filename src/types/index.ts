/**
 * CENTRALIZED TYPE DEFINITIONS
 * ============================
 * 
 * This file consolidates all TypeScript interfaces and types used throughout the application.
 * It serves as the single source of truth for type definexport interface SectionGridProps {
  content: string;
  frontmatter?: any;
  className?: string;
}s.
 */

// ===============================================
// COLLECTION SYSTEM
// ===============================================

export type CollectionType = "cheryl" | "warner" | "global";

export interface CollectionConfig {
  id: CollectionType;
  name: string;
  displayName: string;
  description: string;
  basePath: string;
  contentPrefix: string;
}

export const COLLECTIONS: Record<CollectionType, CollectionConfig> = {
  cheryl: {
    id: "cheryl",
    name: "cheryl",
    displayName: "Cheryl North",
    description: "Classical music journalism, interviews, articles, and reviews",
    basePath: "/cheryl",
    contentPrefix: "c-"
  },
  warner: {
    id: "warner", 
    name: "warner",
    displayName: "D. Warner North",
    description: "Risk analysis, professional work, publications, and background",
    basePath: "/warner",
    contentPrefix: "w-"
  },
  global: {
    id: "global",
    name: "global", 
    displayName: "All Collections",
    description: "Search across all content collections",
    basePath: "/",
    contentPrefix: ""
  }
};

// Collection utility functions
export function getCollectionFromSlug(slug: string): CollectionType {
  if (slug?.startsWith("w-")) return "warner";
  if (slug?.startsWith("c-")) return "cheryl";
  return "global";
}

export function getCollectionFromCategory(category: string): CollectionType {
  const warnerCategories = ["professional", "publications", "background"];
  const cherylCategories = ["interviews", "articles", "reviews"];
  
  if (warnerCategories.includes(category)) return "warner";
  if (cherylCategories.includes(category)) return "cheryl";
  return "global";
}

export function isValidCollection(collection: string): collection is CollectionType {
  return collection === "cheryl" || collection === "warner" || collection === "global";
}

export function getCollectionConfig(collection: CollectionType): CollectionConfig {
  return COLLECTIONS[collection];
}

export function getSearchUrlForCollection(collection: CollectionType, query?: string): string {
  const baseUrl = "/search";
  const params = new URLSearchParams();
  
  if (collection !== "global") {
    params.set("collection", collection);
  }
  
  if (query) {
    params.set("q", query);
  }
  
  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

// ===============================================
// CORE CONTENT TYPES (re-exported from unified-content-schema.ts)
// ===============================================

// Re-export core content types from the unified schema
export type {
  BaseContentItem,
  ContentType,
  ContentCategory,
  ContentStatus,
  ContentSource,
  UnifiedContentItem,
  MediaAsset,
  MediaType,
  MediaVariant,
  MediaUsage,
  PublicationInfo,
  ProfessionalInfo,
  EducationRecord,
  AwardRecord,
  SubjectInfo,
  PersonReference,
  WorkReference,
  OrganizationReference,
  VenueReference,
  CardDisplayOptions,
  ListDisplayOptions,
  UnifiedCardProps,
  UnifiedListProps
} from '@/schemas/unified-content-schema';

// Import specific types for use in this file
import type {
  ContentType,
  ContentCategory,
  ContentStatus,
  SubjectInfo,
  PublicationInfo,
  WorkReference,
  PersonReference,
  UnifiedContentItem,
  CardDisplayOptions,
  ListDisplayOptions
} from '@/schemas/unified-content-schema';







// ===============================================
// UI COMPONENT TYPES
// ===============================================

// Common UI Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation & Layout
export interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

// ===============================================
// COMPONENT PROP INTERFACES
// ===============================================

// Layout Components
export interface PageLayoutProps extends BaseComponentProps {
  breadcrumbs?: BreadcrumbItem[];
}

// UI Components
export interface PageTitleProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export interface TagsProps {
  tags: string[];
  variant?: 'small' | 'medium' | 'large' | 'compact';
  className?: string;
  collection?: CollectionType;
}

export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export interface ImageGalleryProps {
  images: ContentImage[];
  showCaptions?: boolean;
  inline?: boolean;
}

export interface PublicationInfoProps {
  date?: string | null;
  publication?: string;
  section?: string;
  author?: string;
  title?: string;
  className?: string;
}



// Section Components
export interface SectionCardProps {
  title?: string;
  content: string;
  index?: number;
  className?: string;
}

export interface SectionGridProps {
  content: string;
  frontmatter: any;
  className?: string;
}

export interface SectionSearchInterfaceProps {
  onSearchChange: (query: string) => void;
  sections: Array<{
    content: string;
    index: number;
    isEmpty: boolean;
  }>;
  searchQuery: string;
}

// Search Components  
export interface SearchFilters {
  types?: ContentType[];
  categories?: ContentCategory[];
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  authors?: string[];
  publishers?: string[];
  venues?: string[];
  instruments?: string[];
  composers?: string[];
  status?: ContentStatus[];
}

export interface SearchOptions {
  query?: string;
  filters?: SearchFilters;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  item: UnifiedContentItem;
  score: number;
  highlights?: {
    field: string;
    text: string;
  }[];
  explanation?: string;
}

export interface SearchInterfaceProps {
  allContent: UnifiedContentItem[];
  collection?: "cheryl" | "warner" | "global";
}

// ===============================================
// PAGE COMPONENT TYPES
// ===============================================

export interface PageProps {
  params: Promise<{ slug: string }>;
}

export interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ===============================================
// CONTENT DATA TYPES
// ===============================================

export interface ContentData {
  frontmatter: any;
  content: string;
  slug: string;
}

export interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
}

// Legacy frontmatter interfaces (for backward compatibility)
export interface BaseFrontmatter {
  id: string;
  title: string;
  type: ContentType;
  conversion_date?: string;
  converted_from_html?: boolean;
}

export interface InterviewFrontmatter extends BaseFrontmatter {
  type: 'interview';
  subject?: SubjectInfo;
  publication?: PublicationInfo;
  images?: ContentImage[];
  subjects?: string[];
}

export interface ReviewFrontmatter extends BaseFrontmatter {
  type: 'review';
  performance?: {
    date: string;
    venue: string;
    organization: string;
    conductor?: string;
    director?: string;
    program?: WorkReference[];
    cast?: PersonReference[];
  };
  publication?: PublicationInfo;
  rating?: number;
  images?: ContentImage[];
  subjects?: string[];
}

export interface ArticleFrontmatter extends BaseFrontmatter {
  type: 'article';
  publication?: PublicationInfo;
  category?: string;
  images?: ContentImage[];
  subjects?: string[];
}

export interface ProfessionalFrontmatter extends BaseFrontmatter {
  type: 'professional';
  organization?: string;
  position?: string;
  duration?: string;
  description?: string;
  images?: ContentImage[];
  subjects?: string[];
}

export interface PublicationFrontmatter extends BaseFrontmatter {
  type: 'publication';
  publication?: PublicationInfo;
  authors?: string[];
  journal?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  pdf_url?: string;
  images?: ContentImage[];
  subjects?: string[];
}

export interface BackgroundFrontmatter extends BaseFrontmatter {
  type: 'background';
  profession?: string;
  education?: string[];
  affiliations?: string[];
  achievements?: string[];
  images?: ContentImage[];
  subjects?: string[];
}

export type ContentFrontmatter = 
  | InterviewFrontmatter | ReviewFrontmatter | ArticleFrontmatter 
  | ProfessionalFrontmatter | PublicationFrontmatter | BackgroundFrontmatter;

// ===============================================
// UTILITY TYPES
// ===============================================

// CollectionType is now defined in the Collection System section above

// ===============================================
// COMPONENT PROP INTERFACES
// ===============================================

// Navigation Props
export interface NavigationProps {
  items: NavigationItem[];
}

// Pagination Props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

// Publication Info Props
export interface PublicationInfoProps {
  date?: string | null;
  publication?: string;
  section?: string;
  author?: string;
  title?: string;
  className?: string;
}

// Lazy Image Props
export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export interface CardImageProps {
  item: any; // UnifiedContentItem from schema
  variant: any; // MediaVariant from schema
  showImage: boolean;
  className?: string;
}

// Breadcrumbs Props
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  maxWidth?: string; // Maximum width for truncation (e.g., '200px', '12rem')
}

// Layout Props - Unified interface for all layout needs
export interface UnifiedLayoutProps {
  children?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  
  // Content detail specific props (optional)
  frontmatter?: any;
  content?: string;
  slug?: string;
  contentType?: string;
  breadcrumbConfig?: {
    parentPath: string;
    parentLabel: string;
    grandParentPath?: string;
    grandParentLabel?: string;
  };
  collection?: CollectionType;
}

// Page Component Props
export interface UnifiedContentPageProps {
  data: any; // NormalizedContentData from lib
  backLinkOverride?: {
    label: string;
    href: string;
  };
}

export interface ContentListingPageProps {
  contentType: any; // ContentType from specific page components 
  items: any[]; // UnifiedContentItem array
  collection?: CollectionType;
  category?: string;
  title?: string;
  description?: string;
}

export interface ContentDetailPageProps {
  frontmatter: any;
  content: string;
  slug: string;
  collection?: CollectionType;
}

// ===============================================
// LEGACY COMPATIBILITY EXPORTS
// ===============================================

// Main exports for application use (re-exported from unified schema)
export type {
  ContentItem,
  DisplayOptions,
  ListOptions
} from '@/schemas/unified-content-schema';
