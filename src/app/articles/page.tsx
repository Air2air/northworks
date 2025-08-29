import { getArticleContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedContentDisplay, { CONTENT_DISPLAY_PRESETS } from '@/components/ui/UnifiedContentDisplay';
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

      <UnifiedContentDisplay
        items={articleContent}
        preset="cherylContent"
      />
    </UnifiedLayout>
  );
}