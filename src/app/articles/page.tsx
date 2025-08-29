import { getArticleContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | Cheryl North | NorthWorks',
  description: 'Music journalism and articles by Cheryl North about classical music, culture, and the arts.',
  keywords: ['music journalism', 'classical music articles', 'cultural commentary', 'Cheryl North', 'arts writing'],
  openGraph: {
    title: 'Articles | Cheryl North | NorthWorks',
    description: 'Music journalism and articles by Cheryl North about classical music and culture.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ArticlesPage() {
  // Load normalized article content data
  const articleContent = getArticleContent();

  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('article');

  return (
        <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Articles"
        description="Classical music feature articles and commentary by Cheryl North"
        align="left"
        size="medium"
      />

      {articleContent && articleContent.length > 0 ? (
        <UnifiedList
          items={articleContent}
          options={{
            layout: 'list',
            itemsPerPage: 20,
            pagination: true,
            sortBy: 'date',
            sortOrder: 'desc'
          }}
          collection="cheryl"
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found.</p>
        </div>
      )}
    </UnifiedLayout>
  );
}