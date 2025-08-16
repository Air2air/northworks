/**
 * Normalized content types for unified search and display
 * All content items conform to this base structure
 */

// Base metadata structure for all content types
export interface ContentMetadata {
  id: string;
  type: 'interview' | 'article' | 'review' | 'professional' | 'publication' | 'background';
  category: string;
  subcategory?: string;
  status: 'published' | 'draft' | 'archived';
  featured?: boolean;
  source?: string;
  lastModified?: string;
}

// Base content structure
export interface ContentBody {
  title: string;
  subtitle?: string;
  summary?: string;
  body?: string;
  url?: string;
}

// Publication information
export interface PublicationInfo {
  name?: string;
  publisher?: string;
  author?: string;
  date?: string;
  url?: string;
  volume?: string;
  issue?: string;
  headline?: string;
}

// Subject/topic information
export interface SubjectInfo {
  people?: Array<{
    name: string;
    role?: string;
    nationality?: string;
    description?: string;
  }>;
  works?: Array<{
    title: string;
    composer?: string;
    genre?: string;
    year?: string;
  }>;
  organizations?: Array<{
    name: string;
    role?: string;
    location?: string;
  }>;
  venues?: Array<{
    name: string;
    location?: string;
    capacity?: string;
  }>;
}

// Media attachments
export interface MediaInfo {
  images?: Array<{
    url: string;
    type: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
  videos?: Array<{
    url: string;
    type: string;
    title?: string;
  }>;
  audio?: Array<{
    url: string;
    type: string;
    title?: string;
  }>;
}

// Professional information (for career content)
export interface ProfessionalInfo {
  position?: {
    title: string;
    organization: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  };
  education?: Array<{
    degree: string;
    field: string;
    institution: string;
    year?: string;
  }>;
  specializations?: string[];
  awards?: Array<{
    name: string;
    organization: string;
    year: string;
    description?: string;
  }>;
}

// Legacy data for backwards compatibility
export interface LegacyInfo {
  originalIndex?: number;
  rawContent?: string;
  migrationNotes?: string;
}

// Unified content item structure
export interface UnifiedContentItem {
  metadata: ContentMetadata;
  content: ContentBody;
  publication?: PublicationInfo;
  subject?: SubjectInfo;
  media?: MediaInfo;
  professional?: ProfessionalInfo;
  tags?: string[];
  legacy?: LegacyInfo;
}

// Collection metadata
export interface CollectionMetadata {
  id?: string;
  type: string;
  category: string;
  classification?: string;
  description?: string;
  count: number;
  generated: string;
  version: string;
  featured?: boolean;
}

// Unified collection structure
export interface UnifiedCollection {
  metadata: CollectionMetadata;
  items: UnifiedContentItem[];
}

// Search result structure
export interface SearchResult {
  item: UnifiedContentItem;
  score: number;
  matchedFields: string[];
  highlights?: Array<{
    field: string;
    text: string;
  }>;
}

// Search filters and options
export interface SearchOptions {
  query: string;
  types?: ContentMetadata['type'][];
  categories?: string[];
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'title' | 'type';
  sortOrder?: 'asc' | 'desc';
}

// Aggregated search results
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  facets: {
    types: Record<string, number>;
    categories: Record<string, number>;
    tags: Record<string, number>;
    years: Record<string, number>;
  };
  query: SearchOptions;
}

// Backwards compatibility types
export type ContentItem = UnifiedContentItem;
export type ContentType = ContentMetadata['type'];

// Legacy frontmatter interfaces for markdown processing
export interface BaseFrontmatter {
  id: string;
  title: string;
  type: ContentType;
  layout?: LayoutConfig;
  seo?: SEOConfig;
  conversion_date?: string;
  converted_from_html?: boolean;
}

export interface LayoutConfig {
  hasHero?: boolean;
  hasSidebar?: boolean;
  hasTwoColumn?: boolean;
  hasGallery?: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
}

// Specific frontmatter interfaces for backwards compatibility
export interface InterviewFrontmatter extends BaseFrontmatter {
  type: 'interview';
  subject?: SubjectInfo;
  publication?: PublicationInfo;
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
  }>;
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
    program?: Array<{
      composer: string;
      title: string;
      opus?: string;
      movements?: string[];
    }>;
    cast?: Array<{
      name: string;
      role: string;
      voice_type?: string;
    }>;
  };
  publication?: PublicationInfo;
  rating?: number;
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
  }>;
  subjects?: string[];
}

export interface ArticleFrontmatter extends BaseFrontmatter {
  type: 'article';
  publication?: PublicationInfo;
  category?: string;
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
  }>;
  subjects?: string[];
}

export interface ProfessionalFrontmatter extends BaseFrontmatter {
  type: 'professional';
  organization?: string;
  position?: string;
  duration?: string;
  description?: string;
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
  }>;
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
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
  }>;
  subjects?: string[];
}

export interface BackgroundFrontmatter extends BaseFrontmatter {
  type: 'background';
  profession?: string;
  education?: string[];
  affiliations?: string[];
  achievements?: string[];
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
  }>;
  subjects?: string[];
}

export type ContentFrontmatter = 
  | InterviewFrontmatter 
  | ReviewFrontmatter 
  | ArticleFrontmatter 
  | ProfessionalFrontmatter
  | PublicationFrontmatter
  | BackgroundFrontmatter;

export interface ContentData {
  frontmatter: ContentFrontmatter;
  content: string;
  slug: string;
}

// UI component interfaces
export interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
}
