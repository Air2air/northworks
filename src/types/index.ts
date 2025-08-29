/**
 * CENTRALIZED TYPE DEFINITIONS
 * ============================
 * 
 * This file consolidates all TypeScript interfaces and types used throughout the application.
 * It serves as the single source of truth for type definitions.
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
  const warnerCategories = ["professional", "publications", "background", "projects"];
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
// CORE CONTENT TYPES (from unified-content-schema.ts)
// ===============================================

export interface BaseContentItem {
  id: string;
  slug?: string;
  type: ContentType;
  category: ContentCategory;
  subcategory?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  body?: string;
  excerpt?: string;
  url?: string;
  internalUrl?: string;
  externalUrl?: string;
  status: ContentStatus;
  featured?: boolean;
  priority?: number;
  createdDate?: string;
  publishedDate?: string;
  lastModified?: string;
  source?: ContentSource;
  sourceFile?: string;
  migrationNotes?: string;
}

export type ContentType = 
  | 'interview' | 'article' | 'review' 
  | 'professional' | 'publication' | 'background' 
  | 'project' | 'bio' | 'company' | 'other';

export type ContentCategory =
  | 'interviews' | 'articles' | 'reviews'
  | 'professional' | 'publications' | 'background'
  | 'projects' | 'biography' | 'company' | 'other';

export type ContentStatus = 'published' | 'draft' | 'archived' | 'featured';
export type ContentSource = 'markdown' | 'json' | 'cms' | 'migration' | 'manual';

// Media Types
export interface MediaAsset {
  url: string;
  type: MediaType;
  alt?: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: number;
  duration?: string;
  variant?: MediaVariant;
  usage?: MediaUsage;
  credit?: string;
  copyright?: string;
  license?: string;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'pdf';
export type MediaVariant = 'thumbnail' | 'hero' | 'portrait' | 'landscape' | 'square' | 'icon' | 'logo' | 'original';
export type MediaUsage = 'primary' | 'secondary' | 'gallery' | 'background' | 'decorative' | 'logo' | 'download';

// Publication Info
export interface PublicationInfo {
  publisher?: string;
  publication?: string;
  author?: string;
  date?: string;
  headline?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  isbn?: string;
  url?: string;
  pdfUrl?: string;
  downloadUrl?: string;
}

// Professional Info
export interface ProfessionalInfo {
  position?: {
    title: string;
    organization: string;
    department?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  };
  project?: {
    name: string;
    description?: string;
    role?: string;
    duration?: string;
    budget?: string;
    outcome?: string;
  };
  education?: EducationRecord[];
  specializations?: string[];
  skills?: string[];
  certifications?: string[];
  awards?: AwardRecord[];
  honors?: string[];
  memberships?: string[];
}

export interface EducationRecord {
  degree: string;
  field: string;
  institution: string;
  location?: string;
  year?: string;
  honors?: string;
}

export interface AwardRecord {
  name: string;
  organization: string;
  year: string;
  description?: string;
  category?: string;
}

// Subject References
export interface SubjectInfo {
  people?: PersonReference[];
  works?: WorkReference[];
  organizations?: OrganizationReference[];
  venues?: VenueReference[];
  topics?: string[];
  keywords?: string[];
}

export interface PersonReference {
  name: string;
  role?: string;
  instrument?: string;
  voiceType?: string;
  nationality?: string;
  birthYear?: string;
  deathYear?: string;
  description?: string;
}

export interface WorkReference {
  title: string;
  composer?: string;
  genre?: string;
  key?: string;
  opus?: string;
  year?: string;
  movements?: string[];
}

export interface OrganizationReference {
  name: string;
  type?: 'opera_company' | 'symphony' | 'conservatory' | 'university' | 'government' | 'private' | 'other';
  location?: string;
  role?: string;
  description?: string;
}

export interface VenueReference {
  name: string;
  location?: string;
  type?: 'concert_hall' | 'opera_house' | 'theater' | 'university' | 'other';
  capacity?: string;
  description?: string;
}

// Unified Content Item
export interface UnifiedContentItem extends BaseContentItem {
  publication?: PublicationInfo;
  subject?: SubjectInfo;
  media?: MediaAsset[];
  professional?: ProfessionalInfo;
  tags?: string[];
  genres?: string[];
  instruments?: string[];
  composers?: string[];
  relatedItems?: string[];
  collections?: string[];
  viewCount?: number;
  downloadCount?: number;
  shareCount?: number;
  legacy?: {
    originalId?: string;
    originalFormat?: string;
    migrationDate?: string;
    migrationVersion?: string;
    originalData?: any;
  };
}

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
export interface UnifiedLayoutProps extends BaseComponentProps {
  breadcrumbs?: BreadcrumbItem[];
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
  collection?: "cheryl" | "warner" | "global";
}

export interface PageLayoutProps extends BaseComponentProps {
  breadcrumbs?: BreadcrumbItem[];
}

export interface ContentDetailLayoutProps {
  frontmatter: any;
  content: string;
  slug: string;
  contentType: string;
  breadcrumbConfig: {
    parentPath: string;
    parentLabel: string;
    grandParentPath?: string;
    grandParentLabel?: string;
  };
  collection?: "cheryl" | "warner" | "global";
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

// Card & List Components
export interface CardDisplayOptions {
  layout?: 'horizontal' | 'vertical' | 'minimal' | 'detailed';
  size?: 'small' | 'medium' | 'large' | 'xl';
  showImage?: boolean;
  showSummary?: boolean;
  showTags?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showPublication?: boolean;
  imageVariant?: MediaVariant;
  imagePosition?: 'left' | 'right' | 'top' | 'background';
  clickable?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'featured' | 'compact';
}

export interface ListDisplayOptions {
  layout?: 'list';
  columns?: 1;
  gap?: 'none' | 'small' | 'medium' | 'large';
  pagination?: boolean;
  itemsPerPage?: number;
  sortBy?: 'date' | 'title' | 'relevance' | 'category' | 'custom';
  sortOrder?: 'asc' | 'desc';
  groupBy?: 'none' | 'type' | 'category' | 'date' | 'author';
  cardOptions?: CardDisplayOptions;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

export interface UnifiedCardProps {
  item: UnifiedContentItem;
  options?: CardDisplayOptions;
  onClick?: (item: UnifiedContentItem) => void;
  className?: string;
  collection?: "cheryl" | "warner" | "global";
}

export interface UnifiedListProps {
  items: UnifiedContentItem[];
  options?: ListDisplayOptions;
  onItemClick?: (item: UnifiedContentItem) => void;
  onSelectionChange?: (items: UnifiedContentItem[]) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  collection?: "cheryl" | "warner" | "global";
}

// Section Components
export interface SectionCardProps {
  title?: string;
  content: string;
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

// Breadcrumbs Props
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  maxWidth?: string; // Maximum width for truncation (e.g., '200px', '12rem')
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

// Layout Props
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

// ===============================================
// LEGACY COMPATIBILITY EXPORTS
// ===============================================

// Main exports for application use
export type ContentItem = UnifiedContentItem;
export type DisplayOptions = CardDisplayOptions;
export type ListOptions = ListDisplayOptions;
