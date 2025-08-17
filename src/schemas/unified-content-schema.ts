/**
 * UNIFIED CONTENT SCHEMA
 * ===================
 * 
 * This schema consolidates all content types (w-* and c-*) into a unified structure
 * that enables reusable components and consistent data handling.
 * 
 * Goals:
 * 1. Single card component for all content types
 * 2. Single list component for all content types  
 * 3. Normalized JSON data structure
 * 4. Backwards compatibility with existing data
 * 5. Type safety throughout the application
 */

// ===============================================
// CORE CONTENT SCHEMA
// ===============================================

export interface BaseContentItem {
  // Universal identifiers
  id: string;
  slug?: string;
  
  // Content classification
  type: ContentType;
  category: ContentCategory;
  subcategory?: string;
  
  // Core content
  title: string;
  subtitle?: string;
  summary?: string;
  body?: string;
  excerpt?: string;
  
  // Navigation and URLs
  url?: string;
  internalUrl?: string;
  externalUrl?: string;
  
  // Status and metadata
  status: ContentStatus;
  featured?: boolean;
  priority?: number;
  
  // Timestamps
  createdDate?: string;
  publishedDate?: string;
  lastModified?: string;
  
  // Source tracking
  source?: ContentSource;
  sourceFile?: string;
  migrationNotes?: string;
}

// ===============================================
// CONTENT CLASSIFICATION
// ===============================================

export type ContentType = 
  | 'interview'      // c-* interviews
  | 'article'        // c-* articles  
  | 'review'         // c-* reviews
  | 'professional'   // w-* professional content
  | 'publication'    // w-* publications
  | 'background'     // w-* background content
  | 'project'        // w-* project content
  | 'bio'           // w-* biographical content
  | 'company'       // w-* company content
  | 'other';        // Miscellaneous

export type ContentCategory =
  | 'interviews'
  | 'articles' 
  | 'reviews'
  | 'professional'
  | 'publications'
  | 'background'
  | 'projects'
  | 'biography'
  | 'company'
  | 'other';

export type ContentStatus = 'published' | 'draft' | 'archived' | 'featured';

export type ContentSource = 'markdown' | 'json' | 'cms' | 'migration' | 'manual';

// ===============================================
// ENHANCED CONTENT ATTRIBUTES
// ===============================================

export interface PublicationInfo {
  // Basic publication info
  publisher?: string;
  publication?: string;
  author?: string;
  date?: string;
  
  // Detailed publication info
  headline?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  isbn?: string;
  
  // URLs and downloads
  url?: string;
  pdfUrl?: string;
  downloadUrl?: string;
}

export interface SubjectInfo {
  // People mentioned in content
  people?: PersonReference[];
  
  // Musical works and compositions
  works?: WorkReference[];
  
  // Organizations and institutions
  organizations?: OrganizationReference[];
  
  // Venues and locations
  venues?: VenueReference[];
  
  // Topics and themes
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

export interface MediaAsset {
  // Basic media info
  url: string;
  type: MediaType;
  alt?: string;
  title?: string;
  caption?: string;
  
  // Media properties
  width?: number;
  height?: number;
  size?: number;
  duration?: string;
  
  // Media classification
  variant?: MediaVariant;
  usage?: MediaUsage;
  
  // Attribution
  credit?: string;
  copyright?: string;
  license?: string;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'pdf';

export type MediaVariant = 
  | 'thumbnail' 
  | 'hero' 
  | 'portrait' 
  | 'landscape' 
  | 'square' 
  | 'icon' 
  | 'logo'
  | 'original';

export type MediaUsage = 
  | 'primary' 
  | 'secondary' 
  | 'gallery' 
  | 'background' 
  | 'decorative'
  | 'logo'
  | 'download';

export interface ProfessionalInfo {
  // Position information
  position?: {
    title: string;
    organization: string;
    department?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  };
  
  // Project information
  project?: {
    name: string;
    description?: string;
    role?: string;
    duration?: string;
    budget?: string;
    outcome?: string;
  };
  
  // Education
  education?: EducationRecord[];
  
  // Professional details
  specializations?: string[];
  skills?: string[];
  certifications?: string[];
  
  // Recognition
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

export interface PerformanceInfo {
  // Event details
  date?: string;
  venue?: VenueReference;
  organization?: OrganizationReference;
  
  // Performance specifics
  program?: WorkReference[];
  conductor?: PersonReference;
  director?: PersonReference;
  cast?: PersonReference[];
  
  // Review details (for review content)
  rating?: number;
  highlights?: string[];
  criticisms?: string[];
}

export interface InterviewInfo {
  // Interview metadata
  interviewDate?: string;
  interviewLocation?: string;
  interviewer?: PersonReference;
  interviewee?: PersonReference[];
  
  // Content classification
  topics?: string[];
  focus?: 'career' | 'performance' | 'technique' | 'personal' | 'artistic' | 'educational';
  
  // Context
  occasion?: string;
  backgroundContext?: string;
}

// ===============================================
// UNIFIED CONTENT ITEM
// ===============================================

export interface UnifiedContentItem extends BaseContentItem {
  // Enhanced attributes (optional based on content type)
  publication?: PublicationInfo;
  subject?: SubjectInfo;
  media?: MediaAsset[];
  professional?: ProfessionalInfo;
  performance?: PerformanceInfo;
  interview?: InterviewInfo;
  
  // Categorization and discovery
  tags?: string[];
  genres?: string[];
  instruments?: string[];
  composers?: string[];
  
  // Relationships
  relatedItems?: string[]; // IDs of related content
  collections?: string[];  // Collection IDs this item belongs to
  
  // Analytics and engagement
  viewCount?: number;
  downloadCount?: number;
  shareCount?: number;
  
  // Legacy data (for migration)
  legacy?: {
    originalId?: string;
    originalFormat?: string;
    migrationDate?: string;
    migrationVersion?: string;
    originalData?: any;
  };
}

// ===============================================
// COLLECTION SCHEMA
// ===============================================

export interface ContentCollection {
  // Collection metadata
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  category: ContentCategory;
  
  // Collection organization
  items: UnifiedContentItem[];
  count: number;
  
  // Collection attributes
  featured?: boolean;
  curated?: boolean;
  automated?: boolean;
  
  // Timestamps
  created?: string;
  lastModified?: string;
  lastUpdated?: string;
  
  // Versioning
  version: string;
  schema?: string;
  
  // Source information
  source?: ContentSource;
  generator?: string;
  
  // Collection statistics
  stats?: {
    totalItems: number;
    publishedItems: number;
    featuredItems: number;
    mediaCount: number;
    averageLength?: number;
  };
}

// ===============================================
// COMPONENT INTERFACES
// ===============================================

export interface CardDisplayOptions {
  // Layout options
  layout?: 'horizontal' | 'vertical' | 'minimal' | 'detailed';
  size?: 'small' | 'medium' | 'large' | 'xl';
  
  // Content display
  showImage?: boolean;
  showSummary?: boolean;
  showTags?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showPublication?: boolean;
  
  // Image handling
  imageVariant?: MediaVariant;
  imagePosition?: 'left' | 'right' | 'top' | 'background';
  
  // Interaction
  clickable?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  
  // Styling
  className?: string;
  variant?: 'default' | 'minimal' | 'featured' | 'compact';
}

export interface ListDisplayOptions {
  // Layout
  layout?: 'grid' | 'list' | 'masonry' | 'carousel';
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'small' | 'medium' | 'large';
  
  // Pagination
  pagination?: boolean;
  itemsPerPage?: number;
  
  // Filtering and sorting
  sortBy?: 'date' | 'title' | 'relevance' | 'category' | 'custom';
  sortOrder?: 'asc' | 'desc';
  groupBy?: 'none' | 'type' | 'category' | 'date' | 'author';
  
  // Card options
  cardOptions?: CardDisplayOptions;
  
  // Interactive features
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  
  // Empty states
  emptyMessage?: string;
  loadingMessage?: string;
}

// ===============================================
// SEARCH AND FILTER INTERFACES
// ===============================================

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

// ===============================================
// MIGRATION AND COMPATIBILITY
// ===============================================

export interface MigrationMapping {
  // Source mapping
  sourceType: 'markdown' | 'json' | 'csv' | 'database';
  sourceFields: Record<string, string>;
  
  // Target mapping
  targetFields: Record<string, string>;
  transformations?: Record<string, (value: any) => any>;
  
  // Validation
  requiredFields: string[];
  optionalFields: string[];
  defaultValues: Record<string, any>;
}

export interface DataNormalizationConfig {
  // Field standardization
  dateFormat: string;
  urlNormalization: boolean;
  textCleaning: boolean;
  
  // Content processing
  generateSummaries: boolean;
  extractTags: boolean;
  enhanceMetadata: boolean;
  
  // Media processing
  optimizeImages: boolean;
  generateThumbnails: boolean;
  validateUrls: boolean;
}

// ===============================================
// VALIDATION AND TYPES
// ===============================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    totalFields: number;
    validFields: number;
    missingFields: number;
    invalidFields: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ===============================================
// EXPORT UNIFIED TYPES
// ===============================================

// Main exports for application use
export type ContentItem = UnifiedContentItem;
export type Collection = ContentCollection;
export type DisplayOptions = CardDisplayOptions;
export type ListOptions = ListDisplayOptions;

// Legacy compatibility (remove when migration complete)
// export type { ContentCard, ContentList } from '../types/content';

// Component prop types
export interface UnifiedCardProps {
  item: UnifiedContentItem;
  options?: CardDisplayOptions;
  onClick?: (item: UnifiedContentItem) => void;
  className?: string;
}

export interface UnifiedListProps {
  items: UnifiedContentItem[];
  options?: ListDisplayOptions;
  onItemClick?: (item: UnifiedContentItem) => void;
  onSelectionChange?: (items: UnifiedContentItem[]) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}
