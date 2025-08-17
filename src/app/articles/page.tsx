import { getAllContentItems } from '@/lib/unifiedSearch';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import { ContentCard } from '@/components/ui/ContentCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | Cheryl North | NorthWorks',
  description: 'Classical music articles and feature stories by Cheryl North, noted music columnist and critic.',
  keywords: ['classical music articles', 'music journalism', 'feature stories', 'Cheryl North', 'music criticism'],
  openGraph: {
    title: 'Articles | Cheryl North | NorthWorks',
    description: 'Classical music articles and feature stories by Cheryl North, noted music columnist and critic.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ArticlesPage() {
  // Get articles from unified content system (includes images)
  const allContent = getAllContentItems();
  const articles = allContent.filter(item => item.metadata.type === 'article');

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
      <div className="space-y-6">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sky-600">No articles available at this time.</p>
          </div>
        ) : (
          articles.map((article) => (
            <ContentCard
              key={article.metadata.id}
              item={article}
              showImage={true}
              showTags={true}
              showPublication={true}
              className="mb-4"
            />
          ))
        )}
      </div>
    </PageLayout>
  );
}