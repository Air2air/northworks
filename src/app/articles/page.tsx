import { getContentByType } from '@/lib/unified-data';
import { generateCollectionBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import { generateListingMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateListingMetadata('articles', 'cheryl');

export default function ArticlesPage() {
  const breadcrumbs = generateCollectionBreadcrumbs('cheryl');
  const articles = getContentByType('article');

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Articles"
        description="Classical music feature articles and commentary by Cheryl North"
        align="left"
        size="medium"
      />
      
      <div className="mt-16">
        <UnifiedList 
          items={articles}
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