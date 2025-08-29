/**
 * Generic Content Listing Page Component
 * Consolidates all content type listing pages (articles, reviews, interviews, etc.)
 */

import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedContentDisplay from '@/components/ui/UnifiedContentDisplay';
import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import type { Metadata } from 'next';

// Content type configuration
const CONTENT_CONFIG = {
  articles: {
    title: 'Articles',
    description: 'Classical music feature articles and commentary by Cheryl North',
    metaTitle: 'Articles | Cheryl North | NorthWorks',
    metaDescription: 'Music journalism and articles by Cheryl North about classical music, culture, and the arts.',
    keywords: ['music journalism', 'classical music articles', 'cultural commentary', 'Cheryl North', 'arts writing'],
    preset: 'cherylContent' as const
  },
  reviews: {
    title: 'Reviews',
    description: 'Classical music performance reviews by Cheryl North',
    metaTitle: 'Reviews | Cheryl North | NorthWorks',
    metaDescription: 'Classical music reviews and performance critiques by Cheryl North, covering opera, symphony, and chamber music.',
    keywords: ['classical music reviews', 'opera reviews', 'symphony reviews', 'Cheryl North', 'performance critiques'],
    preset: 'cherylContent' as const
  },
  interviews: {
    title: 'Classical Music Interviews',
    description: 'Interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene.',
    metaTitle: 'Interviews | Cheryl North | NorthWorks',
    metaDescription: 'Classical music interviews with major figures in the music world by Cheryl North, featuring artists, conductors, and composers.',
    keywords: ['classical music interviews', 'opera interviews', 'conductor interviews', 'Cheryl North', 'music journalism'],
    preset: 'cherylContent' as const
  },
  publications: {
    title: 'Publications & Research Papers',
    description: 'Publications and research papers by D. Warner North covering risk analysis, decision analysis, environmental protection, and nuclear waste management.',
    metaTitle: 'Publications & Research Papers | D. Warner North | NorthWorks',
    metaDescription: 'Publications and research papers by D. Warner North covering risk analysis, decision analysis, environmental protection, and nuclear waste management.',
    keywords: ['risk analysis', 'decision analysis', 'environmental protection', 'nuclear waste', 'research papers'],
    preset: 'warnerContent' as const
  },
  professional: {
    title: 'Professional Experience & Projects',
    description: 'Professional work and consulting experience of D. Warner North in risk analysis, decision analysis, and capital expenditure analysis.',
    metaTitle: 'Professional Experience & Projects | D. Warner North | NorthWorks',
    metaDescription: 'Professional work and consulting experience of D. Warner North in risk analysis, decision analysis, and capital expenditure analysis.',
    keywords: ['professional experience', 'consulting', 'risk analysis', 'decision analysis', 'capital expenditure'],
    preset: 'warnerContent' as const
  },
  background: {
    title: 'Background',
    description: 'Background information, education, and biographical details about D. Warner North, renowned expert in risk analysis and decision science.',
    metaTitle: 'Background | D. Warner North | NorthWorks',
    metaDescription: 'Background information, education, and biographical details about D. Warner North, renowned expert in risk analysis and decision science.',
    keywords: ['D. Warner North biography', 'risk analysis expert', 'decision science', 'education', 'professional background', 'career history'],
    preset: 'warnerContent' as const
  }
} as const;

export type ContentType = keyof typeof CONTENT_CONFIG;

// Local interface with specific typing
interface ContentListingPageProps {
  contentType: ContentType;
  items: UnifiedContentItem[];
}

/**
 * Generic content listing page component
 */
export default function ContentListingPage({ contentType, items }: ContentListingPageProps) {
  const config = CONTENT_CONFIG[contentType];
  const breadcrumbs = generateBreadcrumbsFromFrontmatter(contentType);

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title={config.title}
        description={config.description}
        align="left"
        size="medium"
      />

      <UnifiedContentDisplay
        items={items}
        preset={config.preset}
      />
    </UnifiedLayout>
  );
}
