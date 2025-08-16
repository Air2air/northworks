import { getAllContentItems } from '@/lib/unifiedSearch';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import { ContentCard } from '@/components/ui/ContentCard';

export default function InterviewsPage() {
  // Get interviews from unified content system (includes images)
  const allContent = getAllContentItems();
  const interviews = allContent.filter(item => item.metadata.type === 'interview');

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
      <div className="space-y-6">
        {interviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sky-600">No interviews available at this time.</p>
          </div>
        ) : (
          interviews.map((interview) => (
            <ContentCard
              key={interview.metadata.id}
              item={interview}
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