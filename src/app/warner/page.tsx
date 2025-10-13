import { generateCollectionBreadcrumbs } from "@/lib/breadcrumbUtils";
import PageTitle from "@/components/ui/PageTitle";
import UnifiedLayout from "@/components/layouts/UnifiedLayout";
import TwoColumnGrid from "@/components/ui/TwoColumnGrid";
import LandingCard from "@/components/ui/LandingCard";
import { getLandingPageNavigation } from "@/lib/unified-data";
import { generateCollectionMetadata } from "@/lib/metadataUtils";
import { getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { createMdxComponents, mdxOptions } from '@/lib/mdxConfig';
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

      {/* Main Content - render markdown body if exists */}
      {content?.content && (
        <div className="prose prose-lg max-w-6xl mx-auto mb-16">
          <MDXRemote 
            source={content.content}
            options={mdxOptions}
            components={createMdxComponents(content.frontmatter.images, content.frontmatter.useFigures)}
          />
        </div>
      )}

      {/* Content Cards - Two Column Grid Layout */}
      <TwoColumnGrid 
        variant="default"
        gap="lg"
        className="mt-16"
        equalHeight
      >
        {landingItems.map((item) => (
          <LandingCard
            key={item.id}
            title={item.title}
            description={item.summary || ''}
            href={item.url || `/warner/${item.slug}`}
            image={item.media?.[0] ? {
              src: item.media[0].url,
              alt: item.media[0].alt || item.title,
              width: item.media[0].width || 400,
              height: item.media[0].height || 300
            } : undefined}
            showTags={false}
            tags={item.tags}
          />
        ))}
      </TwoColumnGrid>
    </UnifiedLayout>
  );
}
