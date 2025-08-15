import { getContentByType } from '@/lib/content';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import Link from 'next/link';

export default function ArticlesPage() {
  // Get individual articles
  const individualArticles = getContentByType('article');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Articles', href: '/articles', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Classical Music Articles"
        description="Feature articles, profiles, and in-depth analysis of classical music and the arts."
        align="left"
        size="medium"
      />

      {/* Articles */}
      <ContentList 
        items={individualArticles}
        baseUrl="/articles"
        emptyMessage="No articles available at this time."
      />
    </PageLayout>
  );
}