/**
 * Phase 2: Rich Media Integration & Advanced Taxonomy
 * Enhanced media management and relationship systems
 */

import { EnhancedFrontmatter } from './enhancedFrontmatter';

// Phase 2: Rich Media Management
export interface MediaGallery {
  hero_image?: EnhancedImage;
  gallery?: EnhancedImage[];
  audio_clips?: AudioClip[];
  video_clips?: VideoClip[];
  documents?: DocumentReference[];
}

export interface EnhancedImage {
  src: string;
  alt: string;
  caption?: string;
  photographer?: string;
  copyright?: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  type?: 'portrait' | 'group' | 'action' | 'venue' | 'instrument';
  tags?: string[];
  date_taken?: string;
}

export interface AudioClip {
  title: string;
  src: string;
  duration?: string;
  description?: string;
  performer?: string;
  composer?: string;
  work?: string;
  copyright?: string;
}

export interface VideoClip {
  title: string;
  src: string;
  duration?: string;
  description?: string;
  thumbnail?: string;
  performer?: string;
  venue?: string;
  date_recorded?: string;
  copyright?: string;
}

export interface DocumentReference {
  title: string;
  src: string;
  type: 'pdf' | 'doc' | 'program' | 'score' | 'libretto';
  description?: string;
  file_size?: string;
  page_count?: number;
}

// Phase 2: Advanced Taxonomy & Relationships
export interface AdvancedTaxonomy {
  primary_subjects: string[];
  secondary_subjects?: string[];
  
  people: PersonTaxonomy[];
  organizations: OrganizationTaxonomy[];
  venues: VenueTaxonomy[];
  composers: ComposerTaxonomy[];
  works: WorkTaxonomy[];
  instruments: InstrumentTaxonomy[];
  
  musical_elements?: MusicalElements;
  historical_context?: HistoricalContext;
  cultural_significance?: CulturalSignificance;
}

export interface PersonTaxonomy {
  name: string;
  role: string;
  bio_link?: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  specialties?: string[];
  notable_works?: string[];
  awards?: string[];
  education?: string[];
  debut_year?: number;
}

export interface OrganizationTaxonomy {
  name: string;
  type: 'opera_company' | 'symphony' | 'chamber_group' | 'conservatory' | 'venue' | 'publisher';
  location: string;
  website?: string;
  founded_year?: number;
  current_status?: 'active' | 'disbanded' | 'merged';
  notable_achievements?: string[];
  artistic_director?: string;
  music_director?: string;
}

export interface VenueTaxonomy {
  name: string;
  type: 'opera_house' | 'concert_hall' | 'church' | 'outdoor' | 'recording_studio';
  capacity?: number;
  location: string;
  address?: string;
  opened_year?: number;
  architect?: string;
  acoustics_description?: string;
  notable_features?: string[];
}

export interface ComposerTaxonomy {
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality: string;
  period: 'medieval' | 'renaissance' | 'baroque' | 'classical' | 'romantic' | 'modern' | 'contemporary';
  style?: string[];
  major_works?: string[];
  influences?: string[];
  students?: string[];
}

export interface WorkTaxonomy {
  title: string;
  composer: string;
  premiere_year?: number;
  premiere_venue?: string;
  genre: 'opera' | 'symphony' | 'concerto' | 'chamber' | 'vocal' | 'choral' | 'ballet';
  subgenre?: string;
  key?: string;
  opus_number?: string;
  duration?: string;
  movements?: string[];
  instrumentation?: string[];
  notable_recordings?: string[];
}

export interface InstrumentTaxonomy {
  name: string;
  family: 'strings' | 'woodwinds' | 'brass' | 'percussion' | 'keyboard' | 'voice' | 'electronic';
  type: 'solo' | 'ensemble' | 'orchestral';
  range?: string;
  notable_performers?: string[];
  common_repertoire?: string[];
}

export interface MusicalElements {
  keys?: string[];
  tempo_markings?: string[];
  dynamics?: string[];
  forms?: string[];
  techniques?: string[];
  harmonic_analysis?: string[];
}

export interface HistoricalContext {
  time_period: string;
  cultural_movement?: string;
  historical_events?: string[];
  social_context?: string[];
  political_context?: string[];
}

export interface CulturalSignificance {
  influence_on_later_works?: string[];
  cultural_impact?: string[];
  educational_value?: string[];
  preservation_status?: string;
  awards_received?: string[];
}

// Phase 2: Enhanced Navigation & Relationships
export interface ContentRelationships {
  related_content: RelatedContent[];
  series_info?: SeriesInfo;
  collection_info?: CollectionInfo;
  cross_references?: CrossReference[];
}

export interface RelatedContent {
  id: string;
  title: string;
  type: string;
  relation: 'same_composer' | 'same_performer' | 'same_venue' | 'same_season' | 'same_genre' | 'sequel' | 'prequel' | 'related_topic';
  strength: 'strong' | 'medium' | 'weak';
  description?: string;
}

export interface SeriesInfo {
  series_title: string;
  series_description?: string;
  part_number: number;
  total_parts?: number;
  previous_part?: string;
  next_part?: string;
}

export interface CollectionInfo {
  collection_name: string;
  collection_description?: string;
  collection_curator?: string;
  items_in_collection: string[];
}

export interface CrossReference {
  reference_type: 'mentions' | 'quotes' | 'discusses' | 'references';
  target_id: string;
  target_title: string;
  context?: string;
  page_number?: number;
  timestamp?: string;
}

// Phase 2: Enhanced User Experience
export interface UserExperienceEnhancements {
  accessibility: AccessibilityFeatures;
  internationalization: InternationalizationFeatures;
  personalization: PersonalizationFeatures;
}

export interface AccessibilityFeatures {
  alt_text_quality: 'excellent' | 'good' | 'needs_improvement';
  transcript_available: boolean;
  audio_description: boolean;
  sign_language: boolean;
  reading_level: 'elementary' | 'middle_school' | 'high_school' | 'college' | 'graduate';
  screen_reader_optimized: boolean;
  keyboard_navigation: boolean;
  color_contrast_aa: boolean;
  color_contrast_aaa: boolean;
}

export interface InternationalizationFeatures {
  primary_language: string;
  available_translations: string[];
  translation_status: 'complete' | 'partial' | 'machine' | 'none';
  translator_notes?: string;
  cultural_adaptations?: string[];
}

export interface PersonalizationFeatures {
  difficulty_adaptable: boolean;
  interest_tags: string[];
  recommended_for: string[];
  learning_objectives?: string[];
  prerequisite_knowledge?: string[];
}

// Combined Phase 2 Enhanced Frontmatter
export interface Phase2EnhancedFrontmatter extends EnhancedFrontmatter {
  // Phase 2 additions
  media: MediaGallery;
  advanced_taxonomy: AdvancedTaxonomy;
  content_relationships: ContentRelationships;
  user_experience: UserExperienceEnhancements;
}

// Utility functions for Phase 2
export function createMediaGallery(
  heroImage?: EnhancedImage,
  gallery?: EnhancedImage[],
  audioClips?: AudioClip[],
  videoClips?: VideoClip[]
): MediaGallery {
  return {
    hero_image: heroImage,
    gallery: gallery || [],
    audio_clips: audioClips || [],
    video_clips: videoClips || [],
    documents: []
  };
}

export function generateRelatedContent(
  currentContent: Phase2EnhancedFrontmatter,
  allContent: Phase2EnhancedFrontmatter[]
): RelatedContent[] {
  const related: RelatedContent[] = [];
  
  // Find content with same composers
  if (currentContent.advanced_taxonomy.composers) {
    for (const composer of currentContent.advanced_taxonomy.composers) {
      const sameComposerContent = allContent.filter(content => 
        content.id !== currentContent.id &&
        content.advanced_taxonomy.composers?.some(c => c.name === composer.name)
      );
      
      for (const content of sameComposerContent.slice(0, 3)) {
        related.push({
          id: content.id,
          title: content.title,
          type: content.type,
          relation: 'same_composer',
          strength: 'strong',
          description: `Also features ${composer.name}`
        });
      }
    }
  }
  
  // Find content with same venues
  if (currentContent.advanced_taxonomy.venues) {
    for (const venue of currentContent.advanced_taxonomy.venues) {
      const sameVenueContent = allContent.filter(content =>
        content.id !== currentContent.id &&
        content.advanced_taxonomy.venues?.some(v => v.name === venue.name)
      );
      
      for (const content of sameVenueContent.slice(0, 2)) {
        if (!related.find(r => r.id === content.id)) {
          related.push({
            id: content.id,
            title: content.title,
            type: content.type,
            relation: 'same_venue',
            strength: 'medium',
            description: `Also at ${venue.name}`
          });
        }
      }
    }
  }
  
  return related.slice(0, 6); // Limit to 6 related items
}
