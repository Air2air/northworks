/**
 * Phase 3: Advanced Features - Analytics, Accessibility, and SEO
 */

import { Phase2EnhancedFrontmatter } from './phase2Enhanced';

// Phase 3: Analytics & Performance Tracking
export interface AnalyticsData {
  page_views: number;
  unique_visitors?: number;
  average_time_on_page: string; // e.g., "4:32"
  bounce_rate: number; // 0.0 to 1.0
  social_shares: SocialShares;
  comments_count: number;
  last_viewed: string; // ISO date
  popular_sections?: PopularSection[];
  referral_sources: ReferralSource[];
  search_keywords?: string[];
  user_demographics?: UserDemographics;
  performance_metrics: PerformanceMetrics;
}

export interface SocialShares {
  total: number;
  facebook?: number;
  twitter?: number;
  linkedin?: number;
  reddit?: number;
  email?: number;
}

export interface PopularSection {
  section_id: string;
  section_title: string;
  engagement_score: number; // 0.0 to 1.0
  time_spent: string;
}

export interface ReferralSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface UserDemographics {
  age_groups?: AgeGroup[];
  locations?: LocationData[];
  devices?: DeviceData[];
  interests?: string[];
}

export interface AgeGroup {
  range: string; // e.g., "25-34"
  percentage: number;
}

export interface LocationData {
  country: string;
  city?: string;
  percentage: number;
}

export interface DeviceData {
  type: 'desktop' | 'mobile' | 'tablet';
  percentage: number;
}

export interface PerformanceMetrics {
  load_time: number; // milliseconds
  largest_contentful_paint: number;
  first_input_delay: number;
  cumulative_layout_shift: number;
  core_web_vitals_score: 'good' | 'needs_improvement' | 'poor';
}

// Phase 3: Enhanced SEO & Discovery
export interface AdvancedSEO {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  canonical_url: string;
  
  // Open Graph
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: 'article' | 'website' | 'music.song' | 'music.album' | 'profile';
  
  // Twitter Cards
  twitter_card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_creator?: string;
  
  // Schema.org structured data
  schema_type: 'Article' | 'Review' | 'MusicRecording' | 'Event' | 'Person' | 'Organization';
  structured_data: StructuredData;
  
  // Advanced SEO features
  hreflang?: LanguageAlternate[];
  robots?: RobotsSettings;
  breadcrumb_schema?: BreadcrumbSchema[];
}

export interface LanguageAlternate {
  lang: string;
  url: string;
}

export interface RobotsSettings {
  index: boolean;
  follow: boolean;
  archive?: boolean;
  snippet?: boolean;
  max_snippet?: number;
  max_image_preview?: 'none' | 'standard' | 'large';
}

export interface BreadcrumbSchema {
  position: number;
  name: string;
  url: string;
}

export interface StructuredData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

// Phase 3: Enhanced Accessibility
export interface AdvancedAccessibility {
  // WCAG compliance levels
  wcag_aa_compliant: boolean;
  wcag_aaa_compliant: boolean;
  
  // Content accessibility
  alt_text_quality: 'excellent' | 'good' | 'needs_improvement' | 'missing';
  heading_structure_valid: boolean;
  color_contrast_ratio: number;
  
  // Media accessibility
  transcript_available: boolean;
  captions_available: boolean;
  audio_description: boolean;
  sign_language: boolean;
  
  // Navigation accessibility
  keyboard_navigation: boolean;
  screen_reader_optimized: boolean;
  focus_indicators: boolean;
  skip_links: boolean;
  
  // Content accessibility
  reading_level: ReadingLevel;
  plain_language_score?: number; // 0-100
  cognitive_accessibility_features: CognitiveFeatures;
  
  // Testing and validation
  accessibility_testing: AccessibilityTesting;
}

export interface ReadingLevel {
  grade_level: number;
  flesch_reading_ease: number;
  flesch_kincaid_grade: number;
  automated_readability_index: number;
  recommended_age: string; // e.g., "16+"
}

export interface CognitiveFeatures {
  clear_navigation: boolean;
  consistent_layout: boolean;
  error_prevention: boolean;
  help_available: boolean;
  timeout_warnings: boolean;
  content_summaries: boolean;
}

export interface AccessibilityTesting {
  last_tested: string; // ISO date
  testing_tools: string[];
  manual_testing_completed: boolean;
  user_testing_completed: boolean;
  issues_found: AccessibilityIssue[];
  overall_score: number; // 0-100
}

export interface AccessibilityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  location: string;
  status: 'open' | 'in_progress' | 'resolved';
  wcag_criterion?: string;
}

// Phase 3: Enhanced Internationalization
export interface AdvancedInternationalization {
  primary_language: string;
  available_translations: TranslationInfo[];
  translation_status: 'complete' | 'partial' | 'machine' | 'none';
  
  // Translation quality
  translation_quality: TranslationQuality;
  translator_notes?: string;
  cultural_adaptations: CulturalAdaptation[];
  
  // Localization
  date_format?: string;
  number_format?: string;
  currency?: string;
  time_zone?: string;
  
  // RTL support
  rtl_support: boolean;
  text_direction?: 'ltr' | 'rtl' | 'auto';
}

export interface TranslationInfo {
  language: string;
  language_name: string;
  completion_percentage: number;
  last_updated: string;
  translator: string;
  reviewer?: string;
}

export interface TranslationQuality {
  accuracy_score: number; // 0-100
  fluency_score: number; // 0-100
  cultural_appropriateness: number; // 0-100
  technical_terminology: number; // 0-100
}

export interface CulturalAdaptation {
  type: 'content' | 'imagery' | 'examples' | 'references';
  description: string;
  target_culture: string;
  adaptation_notes?: string;
}

// Phase 3: Enhanced Content Management
export interface ContentManagement {
  // Workflow and status
  editorial_workflow: EditorialWorkflow;
  approval_chain: ApprovalStep[];
  publication_schedule?: PublicationSchedule;
  
  // Version control
  version_history: VersionHistory[];
  current_version: string;
  
  // Content optimization
  content_optimization: ContentOptimization;
  
  // Collaboration
  collaborators: Collaborator[];
  review_assignments: ReviewAssignment[];
}

export interface EditorialWorkflow {
  current_stage: 'draft' | 'review' | 'editing' | 'approval' | 'scheduled' | 'published' | 'archived';
  workflow_template: string;
  stage_history: WorkflowStage[];
  estimated_completion?: string;
}

export interface WorkflowStage {
  stage: string;
  entered_date: string;
  completed_date?: string;
  assigned_to?: string;
  notes?: string;
}

export interface ApprovalStep {
  step_number: number;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  date?: string;
  comments?: string;
}

export interface PublicationSchedule {
  scheduled_date: string;
  scheduled_time?: string;
  timezone: string;
  auto_publish: boolean;
  social_media_scheduling?: SocialMediaSchedule[];
}

export interface SocialMediaSchedule {
  platform: string;
  scheduled_time: string;
  message: string;
  status: 'scheduled' | 'published' | 'failed';
}

export interface VersionHistory {
  version: string;
  date: string;
  author: string;
  changes_summary: string;
  change_type: 'major' | 'minor' | 'patch' | 'hotfix';
  backup_url?: string;
}

export interface ContentOptimization {
  seo_score: number; // 0-100
  readability_score: number; // 0-100
  engagement_score?: number; // 0-100
  
  optimization_suggestions: OptimizationSuggestion[];
  ab_test_results?: ABTestResult[];
}

export interface OptimizationSuggestion {
  type: 'seo' | 'readability' | 'engagement' | 'accessibility' | 'performance';
  priority: 'low' | 'medium' | 'high';
  suggestion: string;
  impact_estimate: string;
  implemented: boolean;
}

export interface ABTestResult {
  test_name: string;
  variant: string;
  conversion_rate: number;
  confidence_level: number;
  sample_size: number;
  winner: boolean;
}

export interface Collaborator {
  name: string;
  role: string;
  email: string;
  permissions: string[];
  last_activity?: string;
}

export interface ReviewAssignment {
  reviewer: string;
  type: 'content' | 'technical' | 'legal' | 'factual';
  deadline: string;
  status: 'assigned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Combined Phase 3 Enhanced Frontmatter
export interface Phase3EnhancedFrontmatter extends Phase2EnhancedFrontmatter {
  // Phase 3 additions
  analytics: AnalyticsData;
  advanced_seo: AdvancedSEO;
  advanced_accessibility: AdvancedAccessibility;
  advanced_internationalization: AdvancedInternationalization;
  content_management: ContentManagement;
  
  // Technical metadata
  technical_metadata: TechnicalMetadata;
}

export interface TechnicalMetadata {
  last_modified: string; // ISO datetime
  content_hash: string;
  file_size: number; // bytes
  word_count: number;
  character_count: number;
  estimated_reading_time: number; // minutes
  
  // Build and deployment
  build_version: string;
  deployment_environment: 'development' | 'staging' | 'production';
  cdn_cached: boolean;
  cache_expiry?: string;
  
  // Performance
  optimization_applied: string[];
  image_optimization: boolean;
  lazy_loading: boolean;
  critical_css_inlined: boolean;
  
  // Dependencies
  external_resources: ExternalResource[];
  api_dependencies: string[];
}

export interface ExternalResource {
  type: 'script' | 'stylesheet' | 'font' | 'image' | 'video' | 'audio';
  url: string;
  loading_strategy: 'eager' | 'lazy' | 'preload' | 'prefetch';
  critical: boolean;
}

// Utility functions for Phase 3
export function calculateContentScore(frontmatter: Phase3EnhancedFrontmatter): number {
  const scores = [
    frontmatter.advanced_seo?.structured_data ? 20 : 0,
    frontmatter.advanced_accessibility?.wcag_aa_compliant ? 25 : 0,
    frontmatter.content_management?.content_optimization?.seo_score || 0,
    frontmatter.analytics?.performance_metrics?.core_web_vitals_score === 'good' ? 15 : 0,
    frontmatter.advanced_internationalization?.translation_status === 'complete' ? 10 : 0,
    frontmatter.media?.gallery && frontmatter.media.gallery.length > 0 ? 10 : 0
  ];
  
  return scores.reduce((sum, score) => sum + score, 0);
}

export function generateStructuredData(frontmatter: Phase3EnhancedFrontmatter): StructuredData {
  const baseData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': frontmatter.advanced_seo.schema_type,
    'name': frontmatter.title,
    'description': frontmatter.advanced_seo.meta_description,
    'url': frontmatter.advanced_seo.canonical_url,
    'datePublished': frontmatter.enhanced_publication.original_date,
    'dateModified': frontmatter.enhanced_publication.updated_date || frontmatter.enhanced_publication.original_date
  };

  // Add type-specific data
  if (frontmatter.type === 'review' && frontmatter.performance) {
    return {
      ...baseData,
      '@type': 'Review',
      'reviewBody': frontmatter.advanced_seo.meta_description,
      'itemReviewed': {
        '@type': 'Event',
        'name': frontmatter.performance.program?.[0]?.work || 'Musical Performance',
        'location': {
          '@type': 'Place',
          'name': frontmatter.performance.venue,
          'address': frontmatter.performance.venue_address
        },
        'startDate': frontmatter.performance.date
      }
    };
  }

  return baseData;
}
