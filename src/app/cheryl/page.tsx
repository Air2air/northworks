import { generateCollectionBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import LandingGrid from '@/components/ui/LandingGrid';
import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cheryl North - Classical Music Journalist | NorthWorks',
  description: 'Cheryl North is a noted music columnist for Classical Voice of North Carolina and ANG Newspapers, specializing in opera, symphony, and chamber music interviews.',
  keywords: ['classical music', 'opera', 'music journalism', 'interviews', 'music reviews', 'symphony', 'chamber music'],
  openGraph: {
    title: 'Cheryl North - Classical Music Journalist',
    description: 'Noted music columnist specializing in opera, symphony, and chamber music interviews.',
    type: 'profile',
    siteName: 'NorthWorks'
  }
};

export default function CherylPage() {
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateCollectionBreadcrumbs('cheryl');

  // Create navigation items for UnifiedCard
  const interviewsItem: UnifiedContentItem = {
    id: 'interviews-nav',
    slug: 'interviews',
    type: 'interview',
    category: 'interviews',
    title: 'Interviews',
    summary: 'In-depth conversations with musicians, conductors, and performers',
    url: '/interviews',
    status: 'published',
    source: 'manual',
    tags: ['interviews', 'musicians', 'conductors', 'performers']
  };

  const reviewsItem: UnifiedContentItem = {
    id: 'reviews-nav',
    slug: 'reviews',
    type: 'review',
    category: 'reviews',
    title: 'Reviews',
    summary: 'Concert reviews, opera critiques, and performance analysis',
    url: '/reviews',
    status: 'published',
    source: 'manual',
    tags: ['reviews', 'concerts', 'opera', 'performances']
  };

  const articlesItem: UnifiedContentItem = {
    id: 'articles-nav',
    slug: 'articles',
    type: 'article',
    category: 'articles',
    title: 'Articles',
    summary: 'Music journalism, features, and cultural commentary',
    url: '/articles',
    status: 'published',
    source: 'manual',
    tags: ['articles', 'journalism', 'features', 'commentary']
  };

  const landingItems = [
    interviewsItem,
    reviewsItem,
    articlesItem
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title="Cheryl North"
        description="Noted classical music journalist for the Bay Area News Group and syndicated newspapers"
        align="left"
        size="medium"
      />

      {/* Content Cards - Responsive Grid Layout */}
      <LandingGrid 
        items={landingItems}
        collection="cheryl"
      />
    </UnifiedLayout>
  );
}
