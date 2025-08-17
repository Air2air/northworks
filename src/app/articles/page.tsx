import { getArticleContent } from '@/lib/unified-data';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
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

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl', href: '/cheryl', active: false },
    { label: 'Articles', href: '/articles', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Music Articles"
        description="Journalism, features, and cultural commentary on classical music"
        align="left"
        size="medium"
      />

      <UnifiedList 
        items={articleContent}
        options={{
          layout: 'list',
          searchable: true,
          filterable: true,
          sortBy: 'date',
          pagination: true,
          groupBy: 'category'
        }}
      />
    </PageLayout>
  );
}