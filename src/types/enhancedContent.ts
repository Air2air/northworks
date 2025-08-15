/**
 * Enhanced Frontmatter Types for Better Component Consolidation
 * Extends base types with additional props for unified components
 */

import { 
  BaseFrontmatter, 
  NavigationItem, 
  Breadcrumb, 
  ContentImage, 
  PublicationInfo, 
  SubjectInfo, 
  PerformanceInfo 
} from './content';

// Enhanced base frontmatter with common props for all page types
export interface EnhancedBaseFrontmatter extends BaseFrontmatter {
  // Navigation and structure
  navigation?: NavigationItem[];
  breadcrumbs?: Breadcrumb[];
  
  // Page configuration
  showHero?: boolean;
  showSidebar?: boolean;
  showThumbnails?: boolean;
  layoutType?: 'grid' | 'list' | 'cards';
  
  // Content organization
  contentType?: 'interview' | 'article' | 'review' | 'project' | 'professional';
  indexRoute?: string;
  backRoute?: string;
  
  // Display options
  pageSize?: number;
  enableFilters?: boolean;
  enableSearch?: boolean;
  sortBy?: 'date' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
}

// Enhanced content frontmatter that supports all content types
export interface EnhancedContentFrontmatter extends EnhancedBaseFrontmatter {
  // Content metadata
  subject?: SubjectInfo;
  publication?: PublicationInfo;
  performance?: PerformanceInfo;
  rating?: number;
  category?: string;
  subjects?: string[];
  images?: ContentImage[];
  
  // Professional content
  organization?: string;
  role?: string;
  duration?: string;
  status?: 'active' | 'completed' | 'ongoing';
  
  // Academic/research content
  coauthors?: string[];
  institution?: string;
  department?: string;
  
  // Collection/index specific
  totalItems?: number;
  featuredItems?: string[];
  relatedContent?: string[];
}

// Unified page configuration for consolidated components
export interface UnifiedPageConfig {
  contentType: string;
  dataSource: {
    slug?: string;
    type?: string;
    filter?: Record<string, any>;
  };
  display: {
    title: string;
    description: string;
    layout: 'grid' | 'list' | 'cards';
    showThumbnails: boolean;
    itemsPerPage: number;
  };
  features: {
    enableSearch: boolean;
    enableFilters: boolean;
    enablePagination: boolean;
    enableSorting: boolean;
  };
  navigation: {
    breadcrumbs: Breadcrumb[];
    backLink?: {
      href: string;
      label: string;
    };
    indexLink?: {
      href: string;
      label: string;
    };
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Type guards for enhanced frontmatter
export function isEnhancedContentFrontmatter(frontmatter: any): frontmatter is EnhancedContentFrontmatter {
  return frontmatter && typeof frontmatter === 'object' && 'type' in frontmatter;
}

export function hasNavigationProps(frontmatter: any): frontmatter is EnhancedBaseFrontmatter {
  return frontmatter && (frontmatter.navigation || frontmatter.breadcrumbs);
}

// Factory functions for creating enhanced frontmatter
export function createEnhancedFrontmatter(
  base: BaseFrontmatter,
  enhancements: Partial<EnhancedContentFrontmatter>
): EnhancedContentFrontmatter {
  return {
    ...base,
    ...enhancements
  };
}

export function createUnifiedPageConfig(
  contentType: string,
  overrides: Partial<UnifiedPageConfig> = {}
): UnifiedPageConfig {
  const defaults: UnifiedPageConfig = {
    contentType,
    dataSource: {
      type: contentType
    },
    display: {
      title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}s`,
      description: `Browse ${contentType}s`,
      layout: 'grid',
      showThumbnails: contentType === 'interview',
      itemsPerPage: 12
    },
    features: {
      enableSearch: true,
      enableFilters: true,
      enablePagination: true,
      enableSorting: true
    },
    navigation: {
      breadcrumbs: [
        { label: 'Home', href: '/', active: false },
        { label: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}s`, href: `/${contentType}s`, active: true }
      ]
    },
    metadata: {
      title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}s`,
      description: `Browse all ${contentType}s`,
      keywords: [contentType, 'classical music', 'music']
    }
  };

  return {
    ...defaults,
    ...overrides,
    dataSource: { ...defaults.dataSource, ...overrides.dataSource },
    display: { ...defaults.display, ...overrides.display },
    features: { ...defaults.features, ...overrides.features },
    navigation: { ...defaults.navigation, ...overrides.navigation },
    metadata: { ...defaults.metadata, ...overrides.metadata }
  };
}
