// Content type definitions for the NorthWorks website

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

export interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  type?: 'portrait' | 'group' | 'thumbnail' | 'hero';
}

export interface PublicationInfo {
  date?: string;
  publisher?: string;
  author?: string;
  url?: string;
  headline?: string;
}

export interface Person {
  name: string;
  role?: string;
  instrument?: string;
  bio?: string;
}

export interface SubjectInfo {
  people?: Person[];
  organizations?: string[];
  venues?: string[];
}

export interface PerformanceInfo {
  date: string;
  venue: string;
  organization: string;
  conductor?: string;
  director?: string;
  program?: MusicalWork[];
  cast?: CastMember[];
}

export interface MusicalWork {
  composer: string;
  title: string;
  opus?: string;
  movements?: string[];
}

export interface CastMember {
  name: string;
  role: string;
  voice_type?: string;
}

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

export interface Profile {
  name: string;
  title: string;
  image: string;
  description: string;
  link: string;
}

export interface RecentContentItem {
  title: string;
  description: string;
  link?: string;
  type: 'preview' | 'review' | 'interview' | 'publication' | 'workshop';
}

// Specific content type interfaces
export interface InterviewFrontmatter extends BaseFrontmatter {
  type: 'interview';
  subject?: SubjectInfo;
  publication?: PublicationInfo;
  images?: ContentImage[];
  subjects?: string[];
}

export interface ReviewFrontmatter extends BaseFrontmatter {
  type: 'review';
  performance?: PerformanceInfo;
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

export interface HomepageFrontmatter extends BaseFrontmatter {
  type: 'homepage';
  navigation?: NavigationItem[];
  hero_images?: ContentImage[];
  header_logo?: string;
  header_tagline?: string;
  profiles?: {
    warner: Profile;
    cheryl: Profile;
  };
  recent_content?: {
    cheryl: RecentContentItem[];
    warner: RecentContentItem[];
  };
}

export interface BiographyFrontmatter extends BaseFrontmatter {
  type: 'biography';
  profession?: string;
  education?: string[];
  affiliations?: string[];
  awards?: string[];
  images?: ContentImage[];
}

export type ContentType = 'interview' | 'review' | 'article' | 'biography' | 'homepage' | 'project' | 'professional';

export type ContentFrontmatter = 
  | InterviewFrontmatter 
  | ReviewFrontmatter 
  | ArticleFrontmatter 
  | BiographyFrontmatter
  | HomepageFrontmatter;

export interface ContentData {
  frontmatter: ContentFrontmatter;
  content: string;
  slug: string;
}
