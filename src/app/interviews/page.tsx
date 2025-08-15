import { getContentByType } from '@/lib/content';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import Link from 'next/link';

export default function InterviewsPage() {
  // Get individual interviews
  const individualInterviews = getContentByType('interview');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Interviews', href: '/interviews', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Classical Music Interviews"
        description="Interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene."
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

      {/* Interviews */}
      <ContentList 
        items={individualInterviews}
        baseUrl="/interviews"
        emptyMessage="No interviews available at this time."
      />
    </PageLayout>
  );
}