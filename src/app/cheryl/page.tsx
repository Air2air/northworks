import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import UnifiedCard from '@/components/ui/UnifiedCard';
import Link from 'next/link';
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
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: true }
  ];

  // Create navigation items for UnifiedCard
  const interviewsItem = {
    id: 'interviews-nav',
    slug: 'interviews',
    type: 'interview' as const,
    category: 'interviews' as const,
    title: 'Interviews',
    summary: 'In-depth conversations with musicians, conductors, and performers',
    url: '/interviews',
    status: 'published' as const,
    source: 'manual' as const,
    tags: ['interviews', 'musicians', 'conductors', 'performers']
  };

  const reviewsItem = {
    id: 'reviews-nav',
    slug: 'reviews',
    type: 'review' as const,
    category: 'reviews' as const,
    title: 'Reviews',
    summary: 'Concert reviews, opera critiques, and performance analysis',
    url: '/reviews',
    status: 'published' as const,
    source: 'manual' as const,
    tags: ['reviews', 'concerts', 'opera', 'performances']
  };

  const articlesItem = {
    id: 'articles-nav',
    slug: 'articles',
    type: 'article' as const,
    category: 'articles' as const,
    title: 'Articles',
    summary: 'Music journalism, features, and cultural commentary',
    url: '/articles',
    status: 'published' as const,
    source: 'manual' as const,
    tags: ['articles', 'journalism', 'features', 'commentary']
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title="Cheryl North"
        description="Noted classical music journalist for the Bay Area News Group and syndicated newspapers"
        align="left"
        size="medium"
      />

      {/* Content Cards - Single Column Layout */}
      <div className="space-y-6 mt-12">
          {/* Interviews Card */}
          <UnifiedCard
            item={interviewsItem}
            options={{
              layout: 'horizontal',
              size: 'medium',
              showTags: true,
              showSummary: true,
              clickable: true
            }}
          />

          {/* Reviews Card */}
          <UnifiedCard
            item={reviewsItem}
            options={{
              layout: 'horizontal',
              size: 'medium',
              showTags: true,
              showSummary: true,
              clickable: true
            }}
          />

          {/* Articles Card */}
          <UnifiedCard
            item={articlesItem}
            options={{
              layout: 'horizontal',
              size: 'medium',
              showTags: true,
              showSummary: true,
              clickable: true
            }}
          />
        </div>
    </PageLayout>
  );
}
