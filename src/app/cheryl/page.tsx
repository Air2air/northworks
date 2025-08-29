import { generateCollectionBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import LandingGrid from '@/components/ui/LandingGrid';
import { getLandingPageNavigation } from '@/lib/unified-data';
import { generateCollectionMetadata } from '@/lib/metadataUtils';
import { getContentBySlug } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = generateCollectionMetadata('cheryl');

export default function CherylPage() {
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateCollectionBreadcrumbs('cheryl');

  // Get navigation items from centralized data function
  const landingItems = getLandingPageNavigation('cheryl');

  // Get content from frontmatter for title and description
  const content = getContentBySlug('c-main', false);
  const title = content?.frontmatter?.title || "Cheryl North";
  const description = content?.frontmatter?.description || "Noted classical music journalist for the Bay Area News Group and syndicated newspapers";

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title={title}
        description={description}
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
