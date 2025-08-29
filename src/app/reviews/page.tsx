import { getContentByType } from '@/lib/unified-data';
import { generateCollectionBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import { generateListingMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateListingMetadata('reviews', 'cheryl');

export default function ReviewsPage() {
  const breadcrumbs = generateCollectionBreadcrumbs('cheryl');
  const reviews = getContentByType('review');

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Reviews"
        description="Concert reviews, opera critiques, and performance analysis"
        align="left"
        size="medium"
      />
      
      <div className="mt-16">
        <UnifiedList 
          items={reviews}
          options={{
            layout: 'list',
            cardOptions: {
              layout: 'vertical',
              showImage: false,
              showSummary: true,
              showTags: true,
              showDate: true,
              variant: 'default'
            }
          }}
          collection="cheryl"
        />
      </div>
    </UnifiedLayout>
  );
}
