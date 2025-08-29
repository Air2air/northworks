import { generateCollectionBreadcrumbs } from "@/lib/breadcrumbUtils";
import PageTitle from "@/components/ui/PageTitle";
import UnifiedLayout from "@/components/layouts/UnifiedLayout";
import LandingGrid from "@/components/ui/LandingGrid";
import { getLandingPageNavigation } from "@/lib/unified-data";
import { generateCollectionMetadata } from "@/lib/metadataUtils";
import { getContentBySlug } from '@/lib/content';
import { Metadata } from "next";

export const metadata: Metadata = generateCollectionMetadata('warner');

export default function WarnerPage() {
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateCollectionBreadcrumbs("warner");

  // Get navigation items from centralized data function
  const landingItems = getLandingPageNavigation("warner");

  // Get content from frontmatter for title and description
  const content = getContentBySlug('w-main', false);
  const title = content?.frontmatter?.title || "D. Warner North";
  const description = content?.frontmatter?.description || "Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues";

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
        collection="warner"
        variant="text-only"
      />
    </UnifiedLayout>
  );
}
