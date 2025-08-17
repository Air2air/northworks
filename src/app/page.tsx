import { getContentBySlug } from '@/lib/content';
import PageLayout from '@/components/layouts/PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedCard from '@/components/ui/UnifiedCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NorthWorks - Classical Music and Risk Analysis',
  description: 'Unified platform combining classical music journalism by Cheryl North and professional risk analysis expertise by D. Warner North. Search across interviews, articles, reviews, and professional portfolio content.',
  keywords: ['NorthWorks', 'classical music', 'risk analysis', 'Warner North', 'Cheryl North', 'music journalism', 'decision analysis', 'consulting', 'opera reviews'],
  openGraph: {
    title: 'NorthWorks - Classical Music and Risk Analysis',
    description: 'Unified platform combining classical music journalism and professional risk analysis expertise.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function HomePage() {
  const homeData = getContentBySlug('index');
  
  if (!homeData) {
    return (
      <PageLayout>
        <div className="text-center">
          <PageTitle 
            title="NorthWorks"
            description=""
            size="medium"
            align="left"
          />
        </div>
      </PageLayout>
    );
  }

  // Create navigation items for UnifiedCard
  const warnerItem = {
    id: 'warner-nav',
    slug: 'warner',
    type: 'professional' as const,
    category: 'professional' as const,
    title: 'D. Warner North',
    summary: 'Risk analysis consultant with 50+ years of experience in decision analysis, environmental protection, and government consulting.',
    url: '/warner',
    status: 'published' as const,
    source: 'manual' as const,
    tags: ['risk analysis', 'decision analysis', 'consulting', 'environmental']
  };

  const cherylItem = {
    id: 'cheryl-nav',
    slug: 'cheryl',
    type: 'article' as const,
    category: 'articles' as const,
    title: 'Cheryl North',
    summary: 'Classical music journalist and critic specializing in opera, symphony, and chamber music with extensive interview collection.',
    url: '/cheryl',
    status: 'published' as const,
    source: 'manual' as const,
    tags: ['classical music', 'opera', 'journalism', 'interviews']
  };

  return (
    <PageLayout>
      <PageTitle
        title="NorthWorks"
        description="Classical Music and Risk Analysis"
        align="left"
        size="medium"
      />

      {/* Main Content */}
      <div className="mt-12">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: homeData.content }} />
        </div>
      </div>

      {/* Navigation Cards - Single Column Layout */}
      <div className="space-y-6 mt-16">
          {/* D. Warner North Card */}
          <UnifiedCard
            item={warnerItem}
            options={{
              layout: 'horizontal',
              size: 'large',
              showTags: true,
              showSummary: true,
              clickable: true
            }}
          />

          {/* Cheryl North Card */}
          <UnifiedCard
            item={cherylItem}
            options={{
              layout: 'horizontal',
              size: 'large',
              showTags: true,
              showSummary: true,
              clickable: true
            }}
          />
        </div>
    </PageLayout>
  );
}
