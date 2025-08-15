/**
 * Phase 4: Ultimate Integration - Migration utilities and type definitions
 */

import { Phase3EnhancedFrontmatter } from './phase3Enhanced';

// Migration Utilities for Converting Legacy Content
export interface MigrationReport {
  total_files: number;
  successfully_migrated: number;
  failed_migrations: number;
  warnings: MigrationWarning[];
  errors: MigrationError[];
  performance_improvements: PerformanceImprovement[];
}

export interface MigrationWarning {
  file: string;
  type: 'missing_field' | 'deprecated_field' | 'format_issue' | 'validation_warning';
  message: string;
  suggestion?: string;
}

export interface MigrationError {
  file: string;
  type: 'parse_error' | 'validation_error' | 'file_error';
  message: string;
  stack_trace?: string;
}

export interface PerformanceImprovement {
  metric: string;
  before: number;
  after: number;
  improvement_percentage: number;
}

// Content Enhancement Utilities
export function enhanceLegacyFrontmatter(
  legacyFrontmatter: any,
  contentBody: string,
  allContent: any[]
): Partial<Phase3EnhancedFrontmatter> {
  const enhanced: Partial<Phase3EnhancedFrontmatter> = {
    // Preserve legacy fields
    ...legacyFrontmatter,
    
    // Phase 1: Enhanced classification
    content_classification: {
      category: detectCategory(legacyFrontmatter, contentBody),
      subcategory: detectSubcategory(legacyFrontmatter),
      genre: extractGenres(legacyFrontmatter.subjects || []),
      era: extractEras(legacyFrontmatter.subjects || []),
      reading_time: estimateReadingTime(contentBody),
      featured: false,
      editorial_status: 'published'
    },
    
    // Phase 1: Enhanced publication
    enhanced_publication: {
      original_date: legacyFrontmatter.publication?.date || legacyFrontmatter.conversion_date,
      updated_date: new Date().toISOString().split('T')[0],
      publisher: legacyFrontmatter.publication?.publisher || 'Unknown',
      word_count: countWords(contentBody)
    },
    
    // Phase 1: Enhanced subjects
    enhanced_subjects: extractEnhancedSubjects(legacyFrontmatter.subjects || []),
    
    // Phase 1: Basic SEO
    enhanced_seo: {
      meta_title: generateMetaTitle(legacyFrontmatter.title, legacyFrontmatter.type),
      meta_description: generateMetaDescription(contentBody),
      keywords: extractKeywords(legacyFrontmatter.subjects || []),
      canonical_url: generateCanonicalUrl(legacyFrontmatter.id, legacyFrontmatter.type),
      schema_type: getSchemaType(legacyFrontmatter.type),
      structured_data: {
        '@context': 'https://schema.org',
        '@type': getSchemaType(legacyFrontmatter.type)
      }
    },
    
    // Phase 2: Media (convert legacy images)
    media: convertLegacyMedia(legacyFrontmatter.images || []),
    
    // Phase 2: Basic taxonomy
    advanced_taxonomy: {
      primary_subjects: legacyFrontmatter.subjects?.slice(0, 3) || [],
      people: extractPeople(legacyFrontmatter.subjects || []),
      organizations: extractOrganizations(legacyFrontmatter.subjects || []),
      venues: extractVenues(legacyFrontmatter.subjects || []),
      composers: extractComposers(legacyFrontmatter.subjects || []),
      works: extractWorks(legacyFrontmatter.subjects || []),
      instruments: extractInstruments(legacyFrontmatter.subjects || [])
    },
    
    // Phase 2: Generate relationships
    content_relationships: {
      related_content: generateBasicRelatedContent(legacyFrontmatter, allContent),
      cross_references: []
    },
    
    // Phase 3: Basic analytics structure
    analytics: {
      page_views: 0,
      average_time_on_page: '0:00',
      bounce_rate: 0,
      social_shares: { total: 0 },
      comments_count: 0,
      last_viewed: new Date().toISOString(),
      referral_sources: [],
      performance_metrics: {
        load_time: 0,
        largest_contentful_paint: 0,
        first_input_delay: 0,
        cumulative_layout_shift: 0,
        core_web_vitals_score: 'good' as const
      }
    },
    
    // Phase 3: Basic accessibility
    advanced_accessibility: {
      wcag_aa_compliant: false,
      wcag_aaa_compliant: false,
      alt_text_quality: 'needs_improvement' as const,
      heading_structure_valid: true,
      color_contrast_ratio: 4.5,
      transcript_available: false,
      captions_available: false,
      audio_description: false,
      sign_language: false,
      keyboard_navigation: true,
      screen_reader_optimized: true,
      focus_indicators: true,
      skip_links: true,
      reading_level: {
        grade_level: 12,
        flesch_reading_ease: calculateFleschScore(contentBody),
        flesch_kincaid_grade: 12,
        automated_readability_index: 12,
        recommended_age: '16+'
      },
      cognitive_accessibility_features: {
        clear_navigation: true,
        consistent_layout: true,
        error_prevention: true,
        help_available: false,
        timeout_warnings: false,
        content_summaries: false
      },
      accessibility_testing: {
        last_tested: new Date().toISOString(),
        testing_tools: ['automated'],
        manual_testing_completed: false,
        user_testing_completed: false,
        issues_found: [],
        overall_score: 75
      }
    },
    
    // Phase 3: Basic internationalization
    advanced_internationalization: {
      primary_language: 'en-US',
      available_translations: [],
      translation_status: 'none' as const,
      translation_quality: {
        accuracy_score: 0,
        fluency_score: 0,
        cultural_appropriateness: 0,
        technical_terminology: 0
      },
      cultural_adaptations: [],
      rtl_support: false,
      text_direction: 'ltr' as const
    },
    
    // Phase 3: Content management
    content_management: {
      editorial_workflow: {
        current_stage: 'published' as const,
        workflow_template: 'standard',
        stage_history: [],
        estimated_completion: undefined
      },
      approval_chain: [],
      version_history: [{
        version: '1.0',
        date: legacyFrontmatter.conversion_date || new Date().toISOString(),
        author: 'Migration Script',
        changes_summary: 'Migrated from legacy format',
        change_type: 'major' as const
      }],
      current_version: '1.0',
      content_optimization: {
        seo_score: 60,
        readability_score: calculateReadabilityScore(contentBody),
        optimization_suggestions: []
      },
      collaborators: [],
      review_assignments: []
    },
    
    // Phase 3: Technical metadata
    technical_metadata: {
      last_modified: new Date().toISOString(),
      content_hash: generateContentHash(contentBody),
      file_size: new Blob([contentBody]).size,
      word_count: countWords(contentBody),
      character_count: contentBody.length,
      estimated_reading_time: estimateReadingTime(contentBody),
      build_version: '1.0.0',
      deployment_environment: 'production' as const,
      cdn_cached: false,
      optimization_applied: [],
      image_optimization: false,
      lazy_loading: true,
      critical_css_inlined: false,
      external_resources: [],
      api_dependencies: []
    }
  };
  
  return enhanced;
}

// Helper functions for migration
function detectCategory(frontmatter: any, content: string): string {
  if (frontmatter.type === 'review') return 'classical-music';
  if (frontmatter.type === 'interview') return 'classical-music';
  if (frontmatter.type === 'article') return 'classical-music';
  return 'classical-music';
}

function detectSubcategory(frontmatter: any): string {
  return `${frontmatter.type}-content`;
}

function extractGenres(subjects: string[]): string[] {
  const genreKeywords = ['opera', 'symphony', 'chamber', 'vocal', 'instrumental'];
  return subjects.filter(subject => 
    genreKeywords.some(genre => subject.toLowerCase().includes(genre))
  );
}

function extractEras(subjects: string[]): string[] {
  const eraKeywords = {
    'baroque': ['Bach', 'Handel', 'Vivaldi'],
    'classical': ['Mozart', 'Haydn', 'Beethoven'],
    'romantic': ['Chopin', 'Brahms', 'Tchaikovsky', 'Puccini', 'Verdi', 'Wagner'],
    'modern': ['Stravinsky', 'Debussy', 'Ravel'],
    'contemporary': ['Glass', 'Reich', 'Adams']
  };
  
  const foundEras: string[] = [];
  for (const [era, composers] of Object.entries(eraKeywords)) {
    if (subjects.some(subject => 
      composers.some(composer => subject.includes(composer))
    )) {
      foundEras.push(era);
    }
  }
  
  return foundEras.length > 0 ? foundEras : ['romantic'];
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = countWords(content);
  return Math.ceil(wordCount / wordsPerMinute);
}

function countWords(content: string): number {
  return content.trim().split(/\s+/).length;
}

function extractEnhancedSubjects(subjects: string[]): any {
  return {
    people: extractPeople(subjects),
    organizations: extractOrganizations(subjects),
    venues: extractVenues(subjects),
    composers: extractComposers(subjects),
    works: extractWorks(subjects)
  };
}

function extractPeople(subjects: string[]): any[] {
  // Simple extraction based on common patterns
  const peopleKeywords = ['conductor', 'soprano', 'tenor', 'baritone', 'bass', 'pianist', 'violinist'];
  return subjects
    .filter(subject => peopleKeywords.some(keyword => subject.toLowerCase().includes(keyword)))
    .map(subject => ({ name: subject, role: 'performer' }));
}

function extractOrganizations(subjects: string[]): any[] {
  const orgKeywords = ['Opera', 'Symphony', 'Orchestra', 'Ensemble'];
  return subjects
    .filter(subject => orgKeywords.some(keyword => subject.includes(keyword)))
    .map(subject => ({ name: subject, type: 'musical_organization', location: 'Unknown' }));
}

function extractVenues(subjects: string[]): any[] {
  const venueKeywords = ['Hall', 'Theater', 'Theatre', 'House', 'Center'];
  return subjects
    .filter(subject => venueKeywords.some(keyword => subject.includes(keyword)))
    .map(subject => ({ name: subject, type: 'venue', location: 'Unknown' }));
}

function extractComposers(subjects: string[]): any[] {
  const knownComposers = [
    'Bach', 'Mozart', 'Beethoven', 'Chopin', 'Brahms', 'Tchaikovsky', 
    'Puccini', 'Verdi', 'Wagner', 'Mahler', 'Debussy', 'Stravinsky'
  ];
  
  return subjects
    .filter(subject => knownComposers.some(composer => subject.includes(composer)))
    .map(subject => ({ 
      name: subject, 
      nationality: 'Unknown', 
      period: 'romantic' // default
    }));
}

function extractWorks(subjects: string[]): any[] {
  // This would need more sophisticated logic in a real implementation
  return [];
}

function extractInstruments(subjects: string[]): any[] {
  const instruments = ['Piano', 'Violin', 'Cello', 'Flute', 'Clarinet', 'Trumpet', 'Voice'];
  return subjects
    .filter(subject => instruments.some(instrument => subject.includes(instrument)))
    .map(subject => ({ 
      name: subject, 
      family: 'unknown', 
      type: 'solo' 
    }));
}

function generateMetaTitle(title: string, type: string): string {
  return `${title} | ${type.charAt(0).toUpperCase() + type.slice(1)} | NorthWorks`;
}

function generateMetaDescription(content: string): string {
  const sentences = content.replace(/<[^>]*>/g, '').split(/[.!?]+/);
  const firstSentences = sentences.slice(0, 2).join('. ').trim();
  return firstSentences.length > 160 
    ? firstSentences.substring(0, 157) + '...'
    : firstSentences;
}

function extractKeywords(subjects: string[]): string[] {
  return subjects.slice(0, 10); // Take first 10 subjects as keywords
}

function generateCanonicalUrl(id: string, type: string): string {
  return `https://northworks.net/${type}s/${id}`;
}

function getSchemaType(contentType: string): string {
  switch (contentType) {
    case 'review': return 'Review';
    case 'article': return 'Article';
    case 'interview': return 'Article';
    case 'biography': return 'Person';
    default: return 'Article';
  }
}

function convertLegacyMedia(images: any[]): any {
  return {
    hero_image: images[0] ? {
      src: images[0].src,
      alt: images[0].alt || '',
      width: images[0].width,
      height: images[0].height
    } : undefined,
    gallery: images.slice(1).map(img => ({
      src: img.src,
      alt: img.alt || '',
      width: img.width,
      height: img.height
    })),
    audio_clips: [],
    video_clips: [],
    documents: []
  };
}

function generateBasicRelatedContent(frontmatter: any, allContent: any[]): any[] {
  // Simple implementation - in reality this would be more sophisticated
  return [];
}

function calculateFleschScore(content: string): number {
  // Simplified Flesch Reading Ease calculation
  const sentences = content.split(/[.!?]+/).length;
  const words = countWords(content);
  const syllables = words * 1.5; // Rough approximation
  
  if (sentences === 0 || words === 0) return 0;
  
  return 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
}

function calculateReadabilityScore(content: string): number {
  const fleschScore = calculateFleschScore(content);
  return Math.max(0, Math.min(100, Math.round(fleschScore)));
}

function generateContentHash(content: string): string {
  // Simple hash implementation - in production use a proper crypto library
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

// Batch Migration Function
export async function migrateAllContent(
  contentDirectory: string,
  outputDirectory: string,
  options: {
    dryRun?: boolean;
    backup?: boolean;
    validateOnly?: boolean;
    includeAnalytics?: boolean;
  } = {}
): Promise<MigrationReport> {
  const report: MigrationReport = {
    total_files: 0,
    successfully_migrated: 0,
    failed_migrations: 0,
    warnings: [],
    errors: [],
    performance_improvements: []
  };

  // Implementation would go here - file system operations, parsing, validation
  // This is a template for the actual migration logic
  
  return report;
}

// Content Validation Utilities
export function validateEnhancedContent(frontmatter: Phase3EnhancedFrontmatter): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Required fields validation
  if (!frontmatter.content_classification) {
    errors.push('Missing content_classification');
    score -= 20;
  }

  if (!frontmatter.enhanced_publication) {
    errors.push('Missing enhanced_publication');
    score -= 20;
  }

  if (!frontmatter.advanced_seo) {
    errors.push('Missing advanced_seo');
    score -= 15;
  }

  // Warnings for optional but recommended fields
  if (!frontmatter.media?.hero_image) {
    warnings.push('No hero image specified');
    score -= 5;
  }

  if (!frontmatter.advanced_taxonomy?.people?.length) {
    warnings.push('No people tagged');
    score -= 3;
  }

  if (!frontmatter.content_relationships?.related_content?.length) {
    warnings.push('No related content specified');
    score -= 2;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}
