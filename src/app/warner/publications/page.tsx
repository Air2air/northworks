import { getWarnerContentByPattern } from '@/lib/content';
import PageLayout from '@/components/layouts/PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import ContentList from '@/components/ui/ContentList';
import Link from 'next/link';

export default function WarnerPublicationsPage() {
  // Get publications content
  const publicationsContent = getWarnerContentByPattern('pub');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Warner North', href: '/warner', active: false },
    { label: 'Publications', href: '/warner/publications', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} className="min-h-screen bg-gray-50">
      <PageTitle
        title="Publications"
        description="Dr. Warner North's published works including reports, articles, and research papers."
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

      {/* Publications */}
      <ContentList 
        items={publicationsContent}
        baseUrl="/publications"
        emptyMessage="No publications available at this time."
      />
    </PageLayout>
  );
}
