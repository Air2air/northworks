import { getContentByType } from '@/lib/unified-data';
import { generateCollectionBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import { generateListingMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateListingMetadata('interviews', 'cheryl');

export default function InterviewsPage() {
  const breadcrumbs = generateCollectionBreadcrumbs('cheryl');
  const interviews = getContentByType('interview');

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Interviews"
        description="In-depth conversations with musicians, conductors, and performers"
        align="left"
        size="medium"
      />
      
      <div className="mt-16">
        <UnifiedList 
          items={interviews}
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