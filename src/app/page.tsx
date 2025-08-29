import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import TwoColumnGrid from '@/components/ui/TwoColumnGrid';
import LandingCard from '@/components/ui/LandingCard';
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

  return (
    <UnifiedLayout>
      <PageTitle
        title={title}
        description={description}
        align="left"
        size="medium"
      />

      {/* Two Column Navigation Grid */}
      <TwoColumnGrid 
        variant="default"
        gap="lg"
        className="mt-16"
        equalHeight
      >
        <LandingCard
          title="D. Warner North"
          description="Risk analysis consultant with 50+ years of experience in decision analysis, environmental protection, and government consulting. Explore professional background, publications, and consulting work."
          href="/warner"
          image={{
            src: '/images/warner-north-6-06.jpg',
            alt: 'D. Warner North',
            width: 400,
            height: 350
          }}
        />
        
        <LandingCard
          title="Cheryl North"
          description="Classical music journalist and critic specializing in opera, symphony, and chamber music. Discover interviews with world-renowned artists, performance reviews, and musical insights."
          href="/cheryl"
          image={{
            src: '/images/cheriemug.jpg',
            alt: 'Cheryl North',
            width: 400,
            height: 350
          }}
        />
      </TwoColumnGrid>

    </UnifiedLayout>
  );
}
