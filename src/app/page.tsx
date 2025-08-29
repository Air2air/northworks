import { getContentBySlug } from '@/lib/content';
import { CollectionType } from '@/types';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedCard from '@/components/ui/UnifiedCard';
import Link from 'next/link';
import { generateMetadataFromContent } from '@/lib/metadataUtils';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadataFromContent('index', {
  type: 'website',
  defaultTitle: 'NorthWorks',
  defaultDescription: 'Classical Music and Risk Analysis platform'
});

export default function HomePage() {
  const homeData = getContentBySlug('index');
  
  if (!homeData) {
    return (
      <UnifiedLayout>
        <div className="text-center">
          <PageTitle 
            title="NorthWorks"
            description="Classical Music and Risk Analysis"
            size="medium"
            align="left"
          />
        </div>
      </UnifiedLayout>
    );
  }

  // Extract title and description from frontmatter
  const title = homeData.frontmatter?.title || "NorthWorks";
  const description = homeData.frontmatter?.description || "Classical Music and Risk Analysis";

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
    <UnifiedLayout>
      <PageTitle
        title={title}
        description={description}
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
            collection={"global" as CollectionType}
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
            collection={"global" as CollectionType}
          />
        </div>
    </UnifiedLayout>
  );
}
