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
        description="Feature articles and analysis pieces covering the classical music world, with insights from performances, personalities, and trends."
        align="center"
        size="medium"
      />

      {/* Search hint */}
      <div className="text-center mb-8">
        <Link 
          href="/search"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔍 Search All Content
        </Link>
      </div>

      {/* Content list */}
      <ContentList 
        items={individualArticles}
        baseUrl="/articles"
        emptyMessage="No articles available at this time."
      />
    </PageLayout>
  );
}