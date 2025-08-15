/**
 * Enhanced Frontmatter Schema - Phase 1 Implementation
 * Core enhancements for performance, content classification, and enhanced publication metadata
 */

import { BaseFrontmatter, ContentImage, ContentType } from './content';

// Phase 1: Core Performance & Event Details
export interface PerformanceDetails {
  date: string;                    // ISO date format
  time?: string;                   // Performance time
  venue: string;
  venue_capacity?: number;
  venue_address?: string;
  organization: string;
  conductor?: string;
  director?: string;               // Stage director for opera
  program?: MusicalProgram[];
  cast?: CastMember[];
}

export interface MusicalProgram {
  composer: string;
  work: string;
  act?: string;
  duration?: string;
}

export interface CastMember {
  name: string;
  role: string;
  voice_type?: string;
}

// Phase 1: Enhanced Content Classification
export interface ContentClassification {
  category: 'classical-music' | 'opera' | 'symphony' | 'chamber-music' | 'vocal' | 'instrumental';
  subcategory?: string;            // specific type like 'opera-review', 'concert-preview'
  genre?: string[];               // musical genres covered ['opera', 'symphony']
  era?: string[];                 // musical periods ['romantic', 'modern', 'baroque']
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  reading_time?: number;          // estimated minutes
  content_warnings?: string[];    // any sensitive content
  featured?: boolean;             // highlight content
  editorial_status: 'draft' | 'review' | 'published' | 'archived';
}

// Phase 1: Enhanced Publication Metadata
export interface EnhancedPublication {
  original_date: string;          // when originally published
  updated_date?: string;          // last updated
  publisher: string;
  publication_name?: string;
  section?: string;
  page_number?: string;
  byline?: string;
  editor?: string;
  word_count?: number;
  print_edition?: boolean;
  online_url?: string;
  archive_url?: string;
  copyright_holder?: string;
  license?: string;
  syndication?: string[];         // other publications that carried this
}

// Phase 1: Enhanced Base Frontmatter
export interface EnhancedFrontmatter extends BaseFrontmatter {
  // Enhanced core fields
  performance?: PerformanceDetails;
  content_classification: ContentClassification;
  enhanced_publication: EnhancedPublication;
  
  // Enhanced media (simplified for Phase 1)
  hero_image?: ContentImage & {
    caption?: string;
    photographer?: string;
    copyright?: string;
  };
  
  // Enhanced subjects (expanded from basic subjects array)
  enhanced_subjects?: {
    people?: PersonReference[];
    organizations?: OrganizationReference[];
    venues?: VenueReference[];
    composers?: ComposerReference[];
    works?: WorkReference[];
  };
  
  // Basic SEO enhancement
  enhanced_seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
    canonical_url?: string;
  };
}

// Supporting interfaces for enhanced subjects
export interface PersonReference {
  name: string;
  role?: string;
  bio_link?: string;
}

export interface OrganizationReference {
  name: string;
  type?: string;
  location?: string;
  website?: string;
}

export interface VenueReference {
  name: string;
  type?: string;
  capacity?: number;
  location?: string;
}

export interface ComposerReference {
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  period?: string;
}

export interface WorkReference {
  title: string;
  composer: string;
  premiere_year?: number;
  genre?: string;
  acts?: number;
}

// Type guards for enhanced frontmatter
export function isEnhancedFrontmatter(frontmatter: any): frontmatter is EnhancedFrontmatter {
  return frontmatter && 
         typeof frontmatter.content_classification === 'object' && 
         typeof frontmatter.enhanced_publication === 'object';
}

// Utility function to convert basic frontmatter to enhanced
export function enhanceFrontmatter(
  basic: BaseFrontmatter,
  enhancement: Partial<EnhancedFrontmatter>
): EnhancedFrontmatter {
  return {
    ...basic,
    content_classification: enhancement.content_classification || {
      category: 'classical-music',
      editorial_status: 'published'
    },
    enhanced_publication: enhancement.enhanced_publication || {
      original_date: new Date().toISOString().split('T')[0],
      publisher: 'Unknown'
    },
    ...enhancement
  };
}
