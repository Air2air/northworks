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
          description="is president and principal scientist of NorthWorks, Inc., and consulting professor in the Department of Management Science and Engineering at Stanford University. For over fifty years Dr. North has carried out applications of decision analysis and risk analysis for electric utilities in the US and Mexico, for the petroleum and chemical industries, and for government agencies with responsibility for energy and environmental protection."
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
          description="Warner's wife and the director of the music journalism activities of NorthWorks) is a noted music columnist for the Oakland Tribune and other papers of the Alameda Newspaper Group. She writes performance reviews and feature articles for other publications, including Opera Now, based in Great Britain. Profile/interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene have become an important specialty for which she is in demand."
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
