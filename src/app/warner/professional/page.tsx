import { getWarnerContentByPattern } from '@/lib/content';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import Link from 'next/link';

export default function WarnerProfessionalPage() {
  // Get professional/projects content
  const projectsContent = getWarnerContentByPattern('projects');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Warner North', href: '/warner', active: false },
    { label: 'Professional Work', href: '/warner/professional', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} className="min-h-screen bg-gray-50">
      <PageTitle
        title="Professional Experience & Projects"
        description="Dr. Warner North's consulting work, government service, and academic positions over 50+ years."
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

      {/* Professional content */}
      <ContentList 
        items={projectsContent}
        baseUrl="/professional"
        emptyMessage="No professional content available at this time."
      />
    </PageLayout>
  );
}
