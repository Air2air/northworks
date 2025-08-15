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
        align="left"
        size="medium"
      />

      {/* Interviews */}
      <ContentList 
        items={individualInterviews}
        baseUrl="/interviews"
        emptyMessage="No interviews available at this time."
      />
    </PageLayout>
  );
}